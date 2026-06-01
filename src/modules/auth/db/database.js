import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

// ─── Conexión ────────────────────────────────────────────────────────────────
// expo-sqlite v16 (SDK 54): openDatabaseAsync en lugar de openDatabase
let db = null;

export async function getDB() {
  if (!db) {
    db = await SQLite.openDatabaseAsync('dpuas.db');
  }
  return db;
}

// ─── Inicialización de tablas ────────────────────────────────────────────────
// RF01 – Registro (tabla usuarios + rol)
// RF02 – Perfil/encuesta (tabla perfiles con nivel, dias_semana)
// RF03 – Login (rol validado en loginUser)
// RF04 – Edición de perfil
// RF05 – Recuperación contraseña (columnas reset_codigo, reset_expira_at)
// RF06 – Cierre de sesión (tabla sesiones)
// RF07 – Solicitud cambio email (columna email_pendiente + codigo_verificacion)
export async function initDB() {
  const database = await getDB();

  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS usuarios (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre              TEXT    NOT NULL,
      email               TEXT    UNIQUE NOT NULL,
      email_pendiente     TEXT,
      codigo_verificacion TEXT,
      codigo_expira_at    TEXT,
      reset_codigo        TEXT,
      reset_expira_at     TEXT,
      password_hash       TEXT    NOT NULL,
      rol                 TEXT    NOT NULL DEFAULT 'usuario_app',
      created_at          TEXT    DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS perfiles (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id    INTEGER UNIQUE NOT NULL,
      edad          INTEGER,
      peso          REAL,
      altura        REAL,
      genero        TEXT,
      objetivo      TEXT,
      nivel         TEXT,
      dias_semana   TEXT,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sesiones (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id    INTEGER NOT NULL,
      token         TEXT    UNIQUE NOT NULL,
      created_at    TEXT    DEFAULT (datetime('now')),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    );
  `);
}

// ─── Utilidades ──────────────────────────────────────────────────────────────

// RF01 / RF05 – Hash de contraseña con SHA-256
export async function hashPassword(password) {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
}

// ─── Usuarios ────────────────────────────────────────────────────────────────

// RF01 – Registro de nuevo usuario (rol usuario_app asignado automáticamente)
export async function registerUser(nombre, email, password_hash) {
  const database = await getDB();
  const result = await database.runAsync(
    'INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)',
    [nombre, email, password_hash]
  );
  return result.lastInsertRowId;
}

// RF03 – Login: solo permite rol usuario_app (rechaza administrador)
export async function loginUser(email, password_hash) {
  const database = await getDB();
  const user = await database.getFirstAsync(
    `SELECT * FROM usuarios 
     WHERE email = ? AND password_hash = ? AND rol = 'usuario_app'`,
    [email, password_hash]
  );
  return user || null;
}

// RF05 – Guardar código de reset de contraseña
export async function savePasswordResetCode(email, codigo, expira_at) {
  const database = await getDB();
  await database.runAsync(
    `UPDATE usuarios SET reset_codigo = ?, reset_expira_at = ? WHERE email = ?`,
    [codigo, expira_at, email]
  );
}

// RF05 – Verificar código de reset y actualizar password_hash
export async function resetPassword(email, codigo_ingresado, nuevo_hash) {
  const database = await getDB();

  const user = await database.getFirstAsync(
    `SELECT reset_codigo, reset_expira_at FROM usuarios WHERE email = ?`,
    [email]
  );

  if (!user) return { ok: false, error: 'Correo no encontrado' };
  if (user.reset_codigo !== codigo_ingresado)
    return { ok: false, error: 'Código incorrecto' };
  if (new Date(user.reset_expira_at) < new Date())
    return { ok: false, error: 'Código expirado' };

  await database.runAsync(
    `UPDATE usuarios SET password_hash = ?, reset_codigo = NULL, reset_expira_at = NULL WHERE email = ?`,
    [nuevo_hash, email]
  );

  return { ok: true };
}

// RF04 – Edición de nombre y email en usuarios
export async function updateUserBasic(usuario_id, nombre, email) {
  const database = await getDB();
  await database.runAsync(
    'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?',
    [nombre, email, usuario_id]
  );
}

// RF07 – Guardar código de verificación para cambio de correo (paso 1)
export async function saveEmailChangeCode(usuario_id, codigo, expira_at) {
  const database = await getDB();
  await database.runAsync(
    `UPDATE usuarios 
     SET codigo_verificacion = ?, codigo_expira_at = ?
     WHERE id = ?`,
    [codigo, expira_at, usuario_id]
  );
}

// RF08 – Verificar código y actualizar email directamente al nuevo correo confirmado
export async function confirmEmailChange(usuario_id, codigo_ingresado, nuevo_email) {
  const database = await getDB();

  const user = await database.getFirstAsync(
    `SELECT codigo_verificacion, codigo_expira_at FROM usuarios WHERE id = ?`,
    [usuario_id]
  );

  if (!user) return { ok: false, error: 'Usuario no encontrado' };
  if (user.codigo_verificacion !== codigo_ingresado)
    return { ok: false, error: 'Código incorrecto' };
  if (new Date(user.codigo_expira_at) < new Date())
    return { ok: false, error: 'Código expirado' };

  // Verificar que el nuevo email no esté en uso por otra cuenta
  const existente = await database.getFirstAsync(
    'SELECT id FROM usuarios WHERE email = ? AND id != ?',
    [nuevo_email, usuario_id]
  );
  if (existente) return { ok: false, error: 'Ese correo ya está registrado en otra cuenta' };

  // Actualizar el email directamente
  await database.runAsync(
    `UPDATE usuarios 
     SET email = ?,
         email_pendiente = NULL,
         codigo_verificacion = NULL,
         codigo_expira_at = NULL
     WHERE id = ?`,
    [nuevo_email, usuario_id]
  );

  return { ok: true };
}

// Verificar si un email ya existe (usado en RF01 y RF08)
export async function emailExists(email) {
  const database = await getDB();
  const row = await database.getFirstAsync(
    'SELECT id FROM usuarios WHERE email = ?',
    [email]
  );
  return !!row;
}

// ─── Perfiles ────────────────────────────────────────────────────────────────

// RF02 – Guardar encuesta inicial (INSERT OR REPLACE para poder re-ejecutar)
export async function saveProfile(usuario_id, datos) {
  const database = await getDB();
  await database.runAsync(
    `INSERT OR REPLACE INTO perfiles 
     (usuario_id, edad, peso, altura, genero, objetivo, nivel, dias_semana)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      usuario_id,
      datos.edad,
      datos.peso,
      datos.altura,
      datos.genero,
      datos.objetivo,
      datos.nivel,
      datos.diasSemana,
    ]
  );
}

// RF02 – Valida si el usuario ya completo la encuesta inicial
export async function hasProfile(usuario_id) {
  const database = await getDB();
  const row = await database.getFirstAsync(
    'SELECT usuario_id FROM perfiles WHERE usuario_id = ? LIMIT 1',
    [usuario_id]
  );
  return !!row;
}

// RF04 – Obtener perfil completo (JOIN usuarios + perfiles)
export async function getProfile(usuario_id) {
  const database = await getDB();
  const row = await database.getFirstAsync(
    `SELECT u.id, u.nombre, u.email, u.rol, u.created_at,
            p.edad, p.peso, p.altura, p.genero, p.objetivo, p.nivel, p.dias_semana
     FROM usuarios u
     LEFT JOIN perfiles p ON u.id = p.usuario_id
     WHERE u.id = ?`,
    [usuario_id]
  );
  return row || null;
}

// RF04 – Actualizar datos del perfil (nombre/email en usuarios + resto en perfiles)
export async function updateProfile(usuario_id, datos) {
  const database = await getDB();

  await database.runAsync(
    'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?',
    [datos.nombre, datos.email, usuario_id]
  );

  await database.runAsync(
    `UPDATE perfiles 
     SET edad = ?, peso = ?, altura = ?, genero = ?, objetivo = ?
     WHERE usuario_id = ?`,
    [datos.edad, datos.peso, datos.altura, datos.genero, datos.objetivo, usuario_id]
  );
}

// ─── Sesiones ────────────────────────────────────────────────────────────────

// RF03 – Guardar token de sesión tras login exitoso
export async function saveSession(usuario_id, token) {
  const database = await getDB();
  await database.runAsync(
    'INSERT OR REPLACE INTO sesiones (usuario_id, token) VALUES (?, ?)',
    [usuario_id, token]
  );
}

// RF03 – Obtener usuario a partir de token (para SplashScreen / auto-login)
export async function getSession(token) {
  const database = await getDB();
  const row = await database.getFirstAsync(
    `SELECT u.* FROM sesiones s
     JOIN usuarios u ON s.usuario_id = u.id
     WHERE s.token = ?`,
    [token]
  );
  return row || null;
}

// RF06 – Eliminar sesión (cierre de sesión seguro, invalida token)
export async function deleteSession(token) {
  const database = await getDB();
  await database.runAsync(
    'DELETE FROM sesiones WHERE token = ?',
    [token]
  );
}
