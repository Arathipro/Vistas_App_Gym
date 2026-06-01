import { EMAIL_DEMO_API_URL, EMAIL_DEMO_ENABLED } from '../../../config/emailDemo';

export async function enviarCodigoEmailDemo({ email, code, purpose }) {
  if (!EMAIL_DEMO_ENABLED) return { ok: false, skipped: true };

  const apiUrl = String(EMAIL_DEMO_API_URL || '').trim();
  if (!apiUrl || apiUrl.includes('TU_IP_LOCAL')) {
    return { ok: false, skipped: true, error: 'Configura EMAIL_DEMO_API_URL con la URL local de tu PC.' };
  }

  try {
    const res = await fetch(`${apiUrl}/enviar-codigo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, purpose }),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok && data.ok !== false, status: res.status, data };
  } catch (error) {
    return { ok: false, error: error?.message || 'No se pudo conectar con backend-correo-demo.' };
  }
}
