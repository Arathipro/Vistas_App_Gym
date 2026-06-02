require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

function crearTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
}

function textoMotivo(purpose) {
  if (purpose === 'register_user') return 'verificacion de registro';
  if (purpose === 'change_email') return 'cambio de correo electronico';
  if (purpose === 'reset_password') return 'recuperacion de contrasena';
  return 'verificacion de seguridad';
}

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'backend-correo-demo activo' });
});

app.post('/enviar-codigo', async (req, res) => {
  try {
    const { email, code, purpose } = req.body || {};

    if (!email || !code) {
      return res.status(400).json({ ok: false, error: 'Falta email o code.' });
    }
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      return res.status(500).json({ ok: false, error: 'Falta configurar MAIL_USER o MAIL_PASS.' });
    }

    const transporter = crearTransporter();
    const motivo = textoMotivo(purpose);

    await transporter.sendMail({
      from: `DPUAS Fitness Demo <${process.env.MAIL_USER}>`,
      to: email,
      subject: `Codigo de ${motivo}`,
      text: `Tu codigo de ${motivo} es: ${code}. Expira en unos minutos.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #222;">
          <h2>DPUAS Fitness</h2>
          <p>Tu codigo de <b>${motivo}</b> es:</p>
          <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; padding: 14px 18px; background: #f2f2f7; border-radius: 10px; display: inline-block;">
            ${code}
          </div>
          <p style="margin-top: 18px; color: #666;">Este correo fue enviado desde el backend local de demostracion.</p>
        </div>
      `,
    });

    console.log(`[EMAIL DEMO] Codigo enviado a ${email} | proposito=${purpose} | codigo=${code}`);
    return res.json({ ok: true, message: 'Codigo enviado.' });
  } catch (error) {
    console.error('[EMAIL DEMO] Error:', error.message);
    return res.status(500).json({ ok: false, error: 'No se pudo enviar el correo.' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`backend-correo-demo activo en puerto ${PORT}`);
  console.log('Usa la IPv4 de esta PC en src/config/emailDemo.js');
});
