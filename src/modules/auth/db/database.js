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
    PRAGMA foreign_keys = ON;

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

// ─── DEBUG VISUAL PARA DEMO MÓDULO 1 ────────────────────────────────────────
// Estas funciones son solo para evidencia en video. No usan console.table porque
// en Expo/Metro suele imprimirse incompleto. Se imprime una tabla compacta.

const DEBUG_DB = true;

function valorSeguro(value) {
  if (value === null || value === undefined) return 'NULL';
  return String(value);
}

function cortar(value, max = 22) {
  const text = valorSeguro(value);
  if (text.length <= max) return text;
  return `${text.slice(0, max - 3)}...`;
}

function imprimirTabla(titulo, rows, columns) {
  if (!DEBUG_DB) return;

  console.log(`\n========== ${titulo} ==========`);

  if (!rows || rows.length === 0) {
    console.log('Sin registros.\n');
    return;
  }

  const widths = {};

  columns.forEach((col) => {
    const headerLength = col.label.length;
    const maxContentLength = Math.max(
      ...rows.map((row) => cortar(row[col.key], col.max ?? 22).length),
      headerLength
    );
    widths[col.key] = Math.min(Math.max(maxContentLength, headerLength), col.max ?? 22);
  });

  const line = `+${columns.map((col) => '-'.repeat(widths[col.key] + 2)).join('+')}+`;
  const header = `|${columns
    .map((col) => ` ${col.label.padEnd(widths[col.key])} `)
    .join('|')}|`;

  console.log(line);
  console.log(header);
  console.log(line);

  rows.forEach((row) => {
    const rowText = `|${columns
      .map((col) => {
        const value = cortar(row[col.key], widths[col.key]);
        return ` ${value.padEnd(widths[col.key])} `;
      })
      .join('|')}|`;
    console.log(rowText);
  });

  console.log(`${line}\n`);
}

export async function debugUsuarios() {
  const database = await getDB();

  const rows = await database.getAllAsync(`
    SELECT
      id,
      nombre,
      email,
      rol
    FROM usuarios
    ORDER BY id DESC
  `);

  imprimirTabla('SELECT * FROM usuarios', rows, [
    { key: 'id', label: 'id', max: 4 },
    { key: 'nombre', label: 'nombre', max: 18 },
    { key: 'email', label: 'email', max: 28 },
    { key: 'rol', label: 'rol', max: 12 },
  ]);
}

export async function debugAuth() {
  const database = await getDB();

  const rows = await database.getAllAsync(`
    SELECT
      id,
      email,
      substr(password_hash, 1, 12) || '...' AS pass_hash,
      reset_codigo,
      codigo_verificacion AS cod_email
    FROM usuarios
    ORDER BY id DESC
  `);

  imprimirTabla('SELECT auth / códigos', rows, [
    { key: 'id', label: 'id', max: 4 },
    { key: 'email', label: 'email', max: 28 },
    { key: 'pass_hash', label: 'pass_hash', max: 15 },
    { key: 'reset_codigo', label: 'reset', max: 8 },
    { key: 'cod_email', label: 'cod_email', max: 10 },
  ]);
}

export async function debugPerfilCompleto() {
  const database = await getDB();

  const rows = await database.getAllAsync(`
    SELECT
      u.id AS user_id,
      u.nombre,
      u.email,
      p.edad,
      p.peso,
      p.altura,
      p.genero,
      p.objetivo,
      p.nivel,
      p.dias_semana
    FROM usuarios u
    LEFT JOIN perfiles p ON u.id = p.usuario_id
    ORDER BY u.id DESC
  `);

  imprimirTabla('SELECT usuarios + perfiles', rows, [
    { key: 'user_id', label: 'user', max: 5 },
    { key: 'nombre', label: 'nombre', max: 16 },
    { key: 'email', label: 'email', max: 24 },
    { key: 'edad', label: 'edad', max: 5 },
    { key: 'peso', label: 'peso', max: 6 },
    { key: 'altura', label: 'altura', max: 6 },
    { key: 'genero', label: 'genero', max: 8 },
    { key: 'objetivo', label: 'objetivo', max: 16 },
    { key: 'nivel', label: 'nivel', max: 12 },
    { key: 'dias_semana', label: 'dias', max: 12 },
  ]);
}

export async function debugSesiones() {
  const database = await getDB();

  const rows = await database.getAllAsync(`
    SELECT
      s.id,
      s.usuario_id,
      u.email,
      substr(s.token, 1, 12) || '...' AS token,
      s.created_at
    FROM sesiones s
    LEFT JOIN usuarios u ON s.usuario_id = u.id
    ORDER BY s.id DESC
  `);

  imprimirTabla('SELECT * FROM sesiones', rows, [
    { key: 'id', label: 'id', max: 4 },
    { key: 'usuario_id', label: 'user', max: 5 },
    { key: 'email', label: 'email', max: 26 },
    { key: 'token', label: 'token', max: 15 },
    { key: 'created_at', label: 'created_at', max: 19 },
  ]);
}

export async function debugModulo1() {
  console.log('\n========== ESTADO COMPLETO MÓDULO 1 ==========');
  await debugUsuarios();
  await debugPerfilCompleto();
  await debugAuth();
  await debugSesiones();
}

// ─── Usuarios ────────────────────────────────────────────────────────────────

// RF01 – Registro de nuevo usuario (rol usuario_app asignado automáticamente)
export async function registerUser(nombre, email, password_hash) {
  const database = await getDB();

  console.log('\n\n========== RF01 · ANTES DEL REGISTRO ==========');
  await debugUsuarios();

  const result = await database.runAsync(
    'INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)',
    [nombre, email, password_hash]
  );

  console.log('\n\n========== RF01 · DESPUÉS DEL REGISTRO ==========');
  await debugUsuarios();
  await debugAuth();

  return result.lastInsertRowId;
}

// RF03 – Login: solo permite rol usuario_app (rechaza administrador)
export async function loginUser(email, password_hash) {
  const database = await getDB();

  console.log('\n\n========== RF03 · ANTES DEL LOGIN ==========');
  await debugSesiones();

  const user = await database.getFirstAsync(
    `SELECT * FROM usuarios 
     WHERE email = ? AND password_hash = ? AND rol = 'usuario_app'`,
    [email, password_hash]
  );

  console.log('\n\n========== RF03 · RESULTADO DEL LOGIN ==========');
  imprimirTabla('SELECT usuario autenticado', user ? [user] : [], [
    { key: 'id', label: 'id', max: 4 },
    { key: 'nombre', label: 'nombre', max: 18 },
    { key: 'email', label: 'email', max: 28 },
    { key: 'rol', label: 'rol', max: 12 },
  ]);

  return user || null;
}

// RF05 – Guardar código de reset de contraseña
export async function savePasswordResetCode(email, codigo, expira_at) {
  const database = await getDB();

  console.log('\n\n========== RF05 · ANTES DE GENERAR CÓDIGO RESET ==========');
  await debugAuth();

  await database.runAsync(
    `UPDATE usuarios SET reset_codigo = ?, reset_expira_at = ? WHERE email = ?`,
    [codigo, expira_at, email]
  );

  console.log('\n\n========== RF05 · DESPUÉS DE GENERAR CÓDIGO RESET ==========');
  await debugAuth();
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

  console.log('\n\n========== RF05 · ANTES DE CAMBIAR CONTRASEÑA ==========');
  await debugAuth();

  await database.runAsync(
    `UPDATE usuarios SET password_hash = ?, reset_codigo = NULL, reset_expira_at = NULL WHERE email = ?`,
    [nuevo_hash, email]
  );

  console.log('\n\n========== RF05 · DESPUÉS DE CAMBIAR CONTRASEÑA ==========');
  await debugAuth();

  return { ok: true };
}

// RF04 – Edición de nombre y email en usuarios
export async function updateUserBasic(usuario_id, nombre, email) {
  const database = await getDB();

  console.log('\n\n========== RF04 · ANTES DE ACTUALIZAR USUARIO ==========');
  await debugUsuarios();

  await database.runAsync(
    'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?',
    [nombre, email, usuario_id]
  );

  console.log('\n\n========== RF04 · DESPUÉS DE ACTUALIZAR USUARIO ==========');
  await debugUsuarios();
}

// RF07 – Guardar código de verificación para cambio de correo (paso 1)
export async function saveEmailChangeCode(usuario_id, codigo, expira_at) {
  const database = await getDB();

  console.log('\n\n========== RF07 · ANTES DE GENERAR CÓDIGO CAMBIO CORREO ==========');
  await debugAuth();

  await database.runAsync(
    `UPDATE usuarios 
     SET codigo_verificacion = ?, codigo_expira_at = ?
     WHERE id = ?`,
    [codigo, expira_at, usuario_id]
  );

  console.log('\n\n========== RF07 · DESPUÉS DE GENERAR CÓDIGO CAMBIO CORREO ==========');
  await debugAuth();
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

  const existente = await database.getFirstAsync(
    'SELECT id FROM usuarios WHERE email = ? AND id != ?',
    [nuevo_email, usuario_id]
  );
  if (existente) return { ok: false, error: 'Ese correo ya está registrado en otra cuenta' };

  console.log('\n\n========== RF08 · ANTES DE CAMBIAR CORREO ==========');
  await debugUsuarios();
  await debugAuth();

  await database.runAsync(
    `UPDATE usuarios 
     SET email = ?,
         email_pendiente = NULL,
         codigo_verificacion = NULL,
         codigo_expira_at = NULL
     WHERE id = ?`,
    [nuevo_email, usuario_id]
  );

  console.log('\n\n========== RF08 · DESPUÉS DE CAMBIAR CORREO ==========');
  await debugUsuarios();
  await debugAuth();

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

// RF02 – Guardar encuesta inicial. UPSERT para evitar duplicar perfiles.
export async function saveProfile(usuario_id, datos) {
  const database = await getDB();

  console.log('\n\n========== RF02 · ANTES DE GUARDAR PERFIL ==========');
  await debugPerfilCompleto();

  await database.runAsync(
    `INSERT INTO perfiles 
     (usuario_id, edad, peso, altura, genero, objetivo, nivel, dias_semana)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(usuario_id) DO UPDATE SET
       edad = excluded.edad,
       peso = excluded.peso,
       altura = excluded.altura,
       genero = excluded.genero,
       objetivo = excluded.objetivo,
       nivel = excluded.nivel,
       dias_semana = excluded.dias_semana`,
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

  console.log('\n\n========== RF02 · DESPUÉS DE GUARDAR PERFIL ==========');
  await debugPerfilCompleto();
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

// RF04 – Actualizar datos del perfil (nombre en usuarios + resto en perfiles)
// El cambio de correo se maneja por RF07/RF08 para conservar el flujo con código.
export async function updateProfile(usuario_id, datos) {
  const database = await getDB();

  console.log('\n\n========== RF04 · ANTES DE EDITAR PERFIL ==========');
  await debugPerfilCompleto();

  await database.runAsync(
    'UPDATE usuarios SET nombre = ? WHERE id = ?',
    [datos.nombre, usuario_id]
  );

  await database.runAsync(
    `INSERT INTO perfiles
     (usuario_id, edad, peso, altura, genero, objetivo, nivel, dias_semana)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(usuario_id) DO UPDATE SET
       edad = excluded.edad,
       peso = excluded.peso,
       altura = excluded.altura,
       genero = excluded.genero,
       objetivo = excluded.objetivo,
       nivel = COALESCE(excluded.nivel, perfiles.nivel),
       dias_semana = COALESCE(excluded.dias_semana, perfiles.dias_semana)`,
    [
      usuario_id,
      datos.edad,
      datos.peso,
      datos.altura,
      datos.genero,
      datos.objetivo,
      datos.nivel ?? null,
      datos.diasSemana ?? null,
    ]
  );

  console.log('\n\n========== RF04 · DESPUÉS DE EDITAR PERFIL ==========');
  await debugPerfilCompleto();
}

// ─── Sesiones ────────────────────────────────────────────────────────────────

// RF03 – Guardar token de sesión tras login exitoso
export async function saveSession(usuario_id, token) {
  const database = await getDB();

  console.log('\n\n========== RF03 · ANTES DE GUARDAR SESIÓN ==========');
  await debugSesiones();

  await database.runAsync(
    'INSERT OR REPLACE INTO sesiones (usuario_id, token) VALUES (?, ?)',
    [usuario_id, token]
  );

  console.log('\n\n========== RF03 · DESPUÉS DE GUARDAR SESIÓN ==========');
  await debugSesiones();
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

  console.log('\n\n========== RF06 · ANTES DE CERRAR SESIÓN ==========');
  await debugSesiones();

  await database.runAsync(
    'DELETE FROM sesiones WHERE token = ?',
    [token]
  );

  console.log('\n\n========== RF06 · DESPUÉS DE CERRAR SESIÓN ==========');
  await debugSesiones();
}
