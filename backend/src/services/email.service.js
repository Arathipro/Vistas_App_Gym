import nodemailer from 'nodemailer';

function isEmailConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.MAIL_FROM
  );
}

function buildPurposeText(tipo) {
  switch (tipo) {
    case 'registro':
      return {
        subject: 'Código de verificación - DPUAS Fitness',
        title: 'Verifica tu cuenta',
        description: 'Usa este código para completar tu registro en DPUAS Fitness.',
      };
    case 'reset_password':
      return {
        subject: 'Código para recuperar contraseña - DPUAS Fitness',
        title: 'Recupera tu contraseña',
        description: 'Usa este código para cambiar la contraseña de tu cuenta.',
      };
    case 'cambio_email':
      return {
        subject: 'Código para cambiar correo - DPUAS Fitness',
        title: 'Confirma el cambio de correo',
        description: 'Usa este código para confirmar que eres el titular de la cuenta.',
      };
    default:
      return {
        subject: 'Código de verificación - DPUAS Fitness',
        title: 'Código de verificación',
        description: 'Usa este código para continuar en DPUAS Fitness.',
      };
  }
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE ?? 'true') === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendVerificationEmail({ to, code, tipo }) {
  if (!isEmailConfigured()) {
    console.log('Correo no configurado. Código generado solo en consola:', { to, code, tipo });
    return { ok: false, skipped: true, reason: 'SMTP_NOT_CONFIGURED' };
  }

  const purpose = buildPurposeText(tipo);
  const transporter = createTransporter();

  const text = `${purpose.title}\n\n${purpose.description}\n\nCódigo: ${code}\n\nEste código expira pronto. Si no solicitaste esta acción, ignora este correo.`;

  const html = `
    <div style="font-family: Arial, sans-serif; background: #f6f7fb; padding: 24px;">
      <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 14px; padding: 28px; border: 1px solid #e5e7eb;">
        <h2 style="margin: 0 0 12px; color: #1f2937;">${purpose.title}</h2>
        <p style="color: #4b5563; font-size: 15px; line-height: 1.5;">${purpose.description}</p>
        <div style="font-size: 32px; letter-spacing: 8px; font-weight: 800; color: #7c6fcd; text-align: center; padding: 18px; background: #f3f1ff; border-radius: 12px; margin: 24px 0;">
          ${code}
        </div>
        <p style="color: #6b7280; font-size: 13px; line-height: 1.5;">Este código expira pronto. Si no solicitaste esta acción, ignora este correo.</p>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 22px;">DPUAS Fitness</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: purpose.subject,
    text,
    html,
  });

  return { ok: true };
}
