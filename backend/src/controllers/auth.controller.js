import { query } from '../config/db.js';
import { sendVerificationEmail } from '../services/email.service.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signSessionToken, hashToken } from '../utils/token.js';
import log from '../utils/logger.js';

function generarCodigo() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function addMinutes(minutes) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

function shouldExposeDevCode(payload = {}) {
  return process.env.NODE_ENV !== 'production' && payload.email_sent !== true;
}

function withDevCode(payload, code) {
  if (!shouldExposeDevCode(payload)) return payload;
  return { ...payload, dev_code: code };
}

function sanitizeUser(row) {
  if (!row) return null;
  return {
    id: row.id_usuario,
    id_usuario: row.id_usuario,
    nombre: row.nombre,
    email: row.email,
    rol: row.nombre_rol || row.rol,
    created_at: row.created_at,
  };
}

async function insertVerificationCode({ idUsuario = null, emailDestino, codigo, tipo, payload = null, expiraAt }) {
  await query(
    `INSERT INTO codigos_verificacion (id_usuario, email_destino, codigo, tipo, payload, expira_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [idUsuario, emailDestino, codigo, tipo, payload ? JSON.stringify(payload) : null, expiraAt]
  );
}

async function findValidCode({ email, code, tipo, idUsuario = null }) {
  const params = [email.trim().toLowerCase(), code, tipo];
  const idFilter = idUsuario ? 'AND id_usuario = $4' : '';
  if (idUsuario) params.push(idUsuario);

  const result = await query(
    `SELECT *,
            expira_at <= (NOW() AT TIME ZONE 'UTC') AS expirado
     FROM codigos_verificacion
     WHERE lower(email_destino) = lower($1)
       AND codigo = $2
       AND tipo = $3
       AND usado = false
       ${idFilter}
     ORDER BY created_at DESC
     LIMIT 1`,
    params
  );

  if (result.rowCount === 0) return { ok: false, error: 'Código incorrecto.' };

  const codeRow = result.rows[0];
  if (codeRow.expirado) {
    log.warn('Código expirado rechazado', {
      email: email.trim().toLowerCase(),
      tipo,
      expira_at: codeRow.expira_at,
    });
    return { ok: false, error: 'Código expirado.' };
  }

  return { ok: true, codeRow };
}

async function sendCodeSafely({ to, code, tipo }) {
  try {
    const result = await sendVerificationEmail({ to, code, tipo });
    return result;
  } catch (error) {
    log.error('Error enviando correo', error);
    return { ok: false, error: error.message };
  }
}

export async function requestRegisterCode(req, res, next) {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ ok: false, error: 'Nombre, correo y contraseña son obligatorios.' });
    }

    const emailLower = email.trim().toLowerCase();
    log.info('RF01 - Solicitud de registro', { nombre: nombre.trim(), email: emailLower });

    const exists = await query('SELECT id_usuario FROM usuarios WHERE lower(email) = lower($1)', [emailLower]);

    if (exists.rowCount > 0) {
      log.warn('Registro rechazado: correo ya existente', { email: emailLower });
      return res.status(409).json({ ok: false, error: 'Este correo ya está registrado.' });
    }

    const code = generarCodigo();
    const passwordHash = await hashPassword(password);
    const expiresAt = addMinutes(15);

    await insertVerificationCode({
      emailDestino: emailLower,
      codigo: code,
      tipo: 'registro',
      payload: { nombre: nombre.trim(), email: emailLower, password_hash: passwordHash },
      expiraAt: expiresAt,
    });

    const emailResult = await sendCodeSafely({ to: emailLower, code, tipo: 'registro' });
    log.success('Código de registro generado y enviado', {
      email: emailLower,
      tipo: 'registro',
      email_sent: emailResult.ok,
      expira_at: expiresAt,
    });

    return res.json(withDevCode({ ok: true, message: 'Código de verificación generado.', email_sent: emailResult.ok }, code));
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
    log.info('RF01 - Confirmación de registro', { email: emailLower });

    const verification = await findValidCode({ email: emailLower, code, tipo: 'registro' });

    if (!verification.ok) {
      log.warn('Confirmación de registro rechazada', { email: emailLower, motivo: verification.error });
      return res.status(400).json({ ok: false, error: verification.error });
    }

    const codeRow = verification.codeRow;
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

    log.success('Usuario creado en PostgreSQL', log.safeUser(userResult.rows[0]));
    return res.status(201).json({ ok: true, user: userResult.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ ok: false, error: 'Este correo ya está registrado.' });
    }
    next(error);
  }
}

export async function requestPasswordResetCode(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ ok: false, error: 'Correo obligatorio.' });
    }

    const emailLower = email.trim().toLowerCase();
    log.info('RF05 - Solicitud de recuperación de contraseña', { email: emailLower });

    const userResult = await query(
      `SELECT id_usuario, email FROM usuarios
       WHERE lower(email) = lower($1)
         AND activo = true`,
      [emailLower]
    );

    if (userResult.rowCount === 0) {
      log.warn('Recuperación solicitada para correo no registrado', { email: emailLower });
      return res.json({ ok: true, message: 'Si el correo está registrado, recibirás un código.' });
    }

    const user = userResult.rows[0];
    const code = generarCodigo();
    const expiresAt = addMinutes(10);

    await insertVerificationCode({
      idUsuario: user.id_usuario,
      emailDestino: emailLower,
      codigo: code,
      tipo: 'reset_password',
      expiraAt: expiresAt,
    });

    const emailResult = await sendCodeSafely({ to: emailLower, code, tipo: 'reset_password' });
    log.success('Código de recuperación generado y enviado', {
      id_usuario: user.id_usuario,
      email: emailLower,
      tipo: 'reset_password',
      email_sent: emailResult.ok,
      expira_at: expiresAt,
    });

    return res.json(withDevCode({ ok: true, message: 'Código de recuperación generado.', email_sent: emailResult.ok }, code));
  } catch (error) {
    next(error);
  }
}

export async function confirmPasswordReset(req, res, next) {
  try {
    const { email, code, password } = req.body;
    if (!email || !code || !password) {
      return res.status(400).json({ ok: false, error: 'Correo, código y nueva contraseña son obligatorios.' });
    }

    const emailLower = email.trim().toLowerCase();
    log.info('RF05 - Confirmación de nueva contraseña', { email: emailLower });

    const userResult = await query(
      `SELECT id_usuario FROM usuarios
       WHERE lower(email) = lower($1)
         AND activo = true`,
      [emailLower]
    );

    if (userResult.rowCount === 0) {
      log.warn('Cambio de contraseña rechazado: usuario no encontrado', { email: emailLower });
      return res.status(400).json({ ok: false, error: 'Código incorrecto.' });
    }

    const user = userResult.rows[0];
    const verification = await findValidCode({
      email: emailLower,
      code,
      tipo: 'reset_password',
      idUsuario: user.id_usuario,
    });

    if (!verification.ok) {
      log.warn('Cambio de contraseña rechazado', { email: emailLower, motivo: verification.error });
      return res.status(400).json({ ok: false, error: verification.error });
    }

    const passwordHash = await hashPassword(password);

    await query(
      `UPDATE usuarios
       SET password_hash = $1,
           updated_at = NOW()
       WHERE id_usuario = $2`,
      [passwordHash, user.id_usuario]
    );

    await query('UPDATE codigos_verificacion SET usado = true WHERE id_codigo = $1', [verification.codeRow.id_codigo]);
    await query('UPDATE sesiones SET revoked_at = NOW() WHERE id_usuario = $1 AND revoked_at IS NULL', [user.id_usuario]);

    log.success('Contraseña actualizada y sesiones previas revocadas', {
      id_usuario: user.id_usuario,
      email: emailLower,
    });

    return res.json({ ok: true, message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    next(error);
  }
}

export async function requestEmailChangeCode(req, res, next) {
  try {
    const idUsuario = req.user.id_usuario;

    const userResult = await query('SELECT id_usuario, email FROM usuarios WHERE id_usuario = $1 AND activo = true', [idUsuario]);
    if (userResult.rowCount === 0) {
      return res.status(404).json({ ok: false, error: 'Usuario no encontrado.' });
    }

    const user = userResult.rows[0];
    log.info('RF07 - Solicitud de cambio de correo', { id_usuario: idUsuario, email_actual: user.email });

    const code = generarCodigo();
    const expiresAt = addMinutes(15);

    await insertVerificationCode({
      idUsuario,
      emailDestino: user.email,
      codigo: code,
      tipo: 'cambio_email',
      expiraAt: expiresAt,
    });

    const emailResult = await sendCodeSafely({ to: user.email, code, tipo: 'cambio_email' });
    log.success('Código de cambio de correo generado y enviado', {
      id_usuario: idUsuario,
      email: user.email,
      tipo: 'cambio_email',
      email_sent: emailResult.ok,
      expira_at: expiresAt,
    });

    return res.json(withDevCode({ ok: true, message: 'Código de cambio de correo generado.', email_sent: emailResult.ok }, code));
  } catch (error) {
    next(error);
  }
}

export async function confirmEmailChange(req, res, next) {
  try {
    const idUsuario = req.user.id_usuario;
    const { code, newEmail } = req.body;

    if (!code || !newEmail) {
      return res.status(400).json({ ok: false, error: 'Código y nuevo correo son obligatorios.' });
    }

    const userResult = await query('SELECT id_usuario, email FROM usuarios WHERE id_usuario = $1 AND activo = true', [idUsuario]);
    if (userResult.rowCount === 0) {
      return res.status(404).json({ ok: false, error: 'Usuario no encontrado.' });
    }

    const user = userResult.rows[0];
    const emailLower = newEmail.trim().toLowerCase();
    log.info('RF08 - Confirmación de cambio de correo', {
      id_usuario: idUsuario,
      email_actual: user.email,
      email_nuevo: emailLower,
    });

    if (emailLower === user.email.toLowerCase()) {
      return res.status(400).json({ ok: false, error: 'El nuevo correo no puede ser igual al actual.' });
    }

    const exists = await query(
      'SELECT id_usuario FROM usuarios WHERE lower(email) = lower($1) AND id_usuario <> $2',
      [emailLower, idUsuario]
    );

    if (exists.rowCount > 0) {
      log.warn('Cambio de correo rechazado: correo ya registrado', { email_nuevo: emailLower });
      return res.status(409).json({ ok: false, error: 'Ese correo ya está registrado en otra cuenta.' });
    }

    const verification = await findValidCode({
      email: user.email,
      code,
      tipo: 'cambio_email',
      idUsuario,
    });

    if (!verification.ok) {
      log.warn('Cambio de correo rechazado', { id_usuario: idUsuario, motivo: verification.error });
      return res.status(400).json({ ok: false, error: verification.error });
    }

    await query(
      `UPDATE usuarios
       SET email = $1,
           updated_at = NOW()
       WHERE id_usuario = $2`,
      [emailLower, idUsuario]
    );

    await query('UPDATE codigos_verificacion SET usado = true WHERE id_codigo = $1', [verification.codeRow.id_codigo]);
    await query('UPDATE sesiones SET revoked_at = NOW() WHERE id_usuario = $1 AND revoked_at IS NULL', [idUsuario]);

    log.success('Correo actualizado y sesiones previas revocadas', {
      id_usuario: idUsuario,
      email_anterior: user.email,
      email_nuevo: emailLower,
    });

    return res.json({ ok: true, message: 'Correo actualizado correctamente.' });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ ok: false, error: 'Ese correo ya está registrado en otra cuenta.' });
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
    log.info('RF03 - Intento de inicio de sesión', { email: emailLower });

    const userResult = await query(
      `SELECT u.*, r.nombre_rol
       FROM usuarios u
       JOIN roles r ON u.id_rol = r.id_rol
       WHERE lower(u.email) = lower($1)
         AND u.activo = true`,
      [emailLower]
    );

    if (userResult.rowCount === 0) {
      log.warn('Login rechazado: usuario no encontrado o inactivo', { email: emailLower });
      return res.status(401).json({ ok: false, error: 'Credenciales incorrectas.' });
    }

    const user = userResult.rows[0];

    if (user.nombre_rol !== 'usuario_app') {
      log.warn('Login rechazado: rol no permitido en app móvil', { email: emailLower, rol: user.nombre_rol });
      return res.status(403).json({ ok: false, error: 'Rol no permitido en app móvil.' });
    }

    const validPassword = await comparePassword(password, user.password_hash);
    if (!validPassword) {
      log.warn('Login rechazado: contraseña incorrecta', { email: emailLower });
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

    log.success('Login correcto y sesión creada', {
      id_usuario: user.id_usuario,
      email: user.email,
      rol: user.nombre_rol,
      expires_at: expiresAt,
    });

    return res.json({ ok: true, token, user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function saveProfile(req, res, next) {
  try {
    const idUsuario = req.user.id_usuario;
    const { nombre, edad, peso, altura, genero, objetivo, nivel, diasSemana } = req.body;

    log.info('RF02/RF04 - Guardar perfil de usuario', {
      id_usuario: idUsuario,
      nombre,
      edad,
      peso,
      altura,
      genero,
      objetivo,
      nivel,
      diasSemana,
    });

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

    log.success('Perfil guardado en PostgreSQL', result.rows[0]);
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

    if (result.rowCount === 0) {
      return res.status(404).json({ ok: false, error: 'Perfil no encontrado.' });
    }

    return res.json({ ok: true, perfil: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    await query('UPDATE sesiones SET revoked_at = NOW() WHERE token_hash = $1 AND revoked_at IS NULL', [req.tokenHash]);
    return res.json({ ok: true, message: 'Sesión cerrada correctamente.' });
  } catch (error) {
    next(error);
  }
}