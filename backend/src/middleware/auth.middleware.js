import { query } from '../config/db.js';
import { hashToken, verifySessionToken } from '../utils/token.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      return res.status(401).json({ ok: false, error: 'Token no enviado.' });
    }

    const payload = verifySessionToken(token);
    const tokenHash = hashToken(token);

    const sessionResult = await query(
      `SELECT s.*, u.activo
       FROM sesiones s
       JOIN usuarios u ON s.id_usuario = u.id_usuario
       WHERE s.token_hash = $1
         AND s.revoked_at IS NULL
         AND s.expires_at > NOW()`,
      [tokenHash]
    );

    if (sessionResult.rowCount === 0) {
      return res.status(401).json({ ok: false, error: 'Sesión inválida o expirada.' });
    }

    if (!sessionResult.rows[0].activo) {
      return res.status(403).json({ ok: false, error: 'Usuario inactivo.' });
    }

    req.user = payload;
    req.tokenHash = tokenHash;
    next();
  } catch (error) {
    return res.status(401).json({ ok: false, error: 'Token inválido.' });
  }
}
