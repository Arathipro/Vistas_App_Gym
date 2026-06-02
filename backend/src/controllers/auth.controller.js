import { query } from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signSessionToken, hashToken } from '../utils/token.js';

function generarCodigo() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function addMinutes(minutes) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

function sanitizeUser(row) {
  if (!row) return null;
  return {
    id: row.id_usuario,
    id_usuario: row.id_usuario,
    nombre: row.nombre,
    email: row.email,
    rol: row.nombre_rol,
    created_at: row.created_at,
  };
}

export async function requestRegisterCode(req, res, next) {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ ok: false, error: 'Nombre, correo y contraseña son obligatorios.' });
    }

    const emailLower = email.trim().toLowerCase();
    const exists = await query('SELECT id_usuario FROM usuarios WHERE lower(email) = lower($1)', [emailLower]);

    if (exists.rowCount > 0) {
      return res.status(409).json({ ok: false, error: 'Este correo ya está registrado.' });
    }

    const code = generarCodigo();
    const passwordHash = await hashPassword(password);
    const expiresAt = addMinutes(15);

    await query(
      `INSERT INTO codigos_verificacion (email_destino, codigo, tipo, payload, expira_at)
       VALUES ($1, $2, 'registro', $3, $4)`,
      [
        emailLower,
        code,
        JSON.stringify({ nombre: nombre.trim(), email: emailLower, password_hash: passwordHash }),
        expiresAt,
      ]
    );

    console.log('Código registro generado:', { email: emailLower, code });

    return res.json({ ok: true, message: 'Código de verificación generado.', dev_code: code });
  } catch (error) {
    next(error);
  }
}

export async function confirmRegister(req, res, next) {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ ok: false, error: 'Correo y código son obligatorios.' });
    }

    const emailLower = email.trim().toLowerCase();

    const codeResult = await query(
      `SELECT * FROM codigos_verificacion
       WHERE lower(email_destino) = lower($1)
         AND codigo = $2
         AND tipo = 'registro'
         AND usado = false
       ORDER BY created_at DESC
       LIMIT 1`,
      [emailLower, code]
    );

    if (codeResult.rowCount === 0) {
      return res.status(400).json({ ok: false, error: 'Código incorrecto.' });
    }

    const codeRow = codeResult.rows[0];
    if (new Date(codeRow.expira_at) < new Date()) {
      return res.status(400).json({ ok: false, error: 'Código expirado.' });
    }

    const payload = codeRow.payload;

    const roleResult = await query('SELECT id_rol FROM roles WHERE nombre_rol = $1', ['usuario_app']);
    const roleId = roleResult.rows[0].id_rol;

    const userResult = await query(
      `INSERT INTO usuarios (id_rol, nombre, email, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id_usuario, nombre, email, created_at`,
      [roleId, payload.nombre, payload.email, payload.password_hash]
    );

    await query('UPDATE codigos_verificacion SET usado = true WHERE id_codigo = $1', [codeRow.id_codigo]);

    return res.status(201).json({ ok: true, user: userResult.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ ok: false, error: 'Este correo ya está registrado.' });
    }
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ ok: false, error: 'Correo y contraseña son obligatorios.' });
    }

    const emailLower = email.trim().toLowerCase();

    const userResult = await query(
      `SELECT u.*, r.nombre_rol
       FROM usuarios u
       JOIN roles r ON u.id_rol = r.id_rol
       WHERE lower(u.email) = lower($1)
         AND u.activo = true`,
      [emailLower]
    );

    if (userResult.rowCount === 0) {
      return res.status(401).json({ ok: false, error: 'Credenciales incorrectas.' });
    }

    const user = userResult.rows[0];

    if (user.nombre_rol !== 'usuario_app') {
      return res.status(403).json({ ok: false, error: 'Rol no permitido en app móvil.' });
    }

    const validPassword = await comparePassword(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ ok: false, error: 'Credenciales incorrectas.' });
    }

    const token = signSessionToken({ id_usuario: user.id_usuario, rol: user.nombre_rol });
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await query('UPDATE sesiones SET revoked_at = NOW() WHERE id_usuario = $1 AND revoked_at IS NULL', [user.id_usuario]);
    await query(
      `INSERT INTO sesiones (id_usuario, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id_usuario, tokenHash, expiresAt]
    );

    return res.json({ ok: true, token, user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function saveProfile(req, res, next) {
  try {
    const idUsuario = req.user.id_usuario;
    const { nombre, edad, peso, altura, genero, objetivo, nivel, diasSemana } = req.body;

    if (nombre?.trim()) {
      await query(
        `UPDATE usuarios
         SET nombre = $1,
             updated_at = NOW()
         WHERE id_usuario = $2`,
        [nombre.trim(), idUsuario]
      );
    }

    await query(
      `INSERT INTO perfiles (id_usuario, edad, peso, altura, genero, objetivo, nivel, dias_semana)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id_usuario) DO UPDATE SET
         edad = EXCLUDED.edad,
         peso = EXCLUDED.peso,
         altura = EXCLUDED.altura,
         genero = EXCLUDED.genero,
         objetivo = EXCLUDED.objetivo,
         nivel = EXCLUDED.nivel,
         dias_semana = EXCLUDED.dias_semana,
         updated_at = NOW()`,
      [idUsuario, edad, peso, altura, genero, objetivo, nivel, diasSemana]
    );

    const result = await query(
      `SELECT u.id_usuario, u.nombre, u.email, r.nombre_rol AS rol,
              p.edad, p.peso, p.altura, p.genero, p.objetivo, p.nivel, p.dias_semana
       FROM usuarios u
       JOIN roles r ON u.id_rol = r.id_rol
       LEFT JOIN perfiles p ON u.id_usuario = p.id_usuario
       WHERE u.id_usuario = $1`,
      [idUsuario]
    );

    return res.json({ ok: true, perfil: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req, res, next) {
  try {
    const idUsuario = req.user.id_usuario;

    const result = await query(
      `SELECT u.id_usuario, u.nombre, u.email, r.nombre_rol AS rol,
              p.edad, p.peso, p.altura, p.genero, p.objetivo, p.nivel, p.dias_semana
       FROM usuarios u
       JOIN roles r ON u.id_rol = r.id_rol
       LEFT JOIN perfiles p ON u.id_usuario = p.id_usuario
       WHERE u.id_usuario = $1`,
      [idUsuario]
    );

    return res.json({ ok: true, perfil: result.rows[0] || null });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    await query(
      'UPDATE sesiones SET revoked_at = NOW() WHERE token_hash = $1 AND revoked_at IS NULL',
      [req.tokenHash]
    );

    return res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}
