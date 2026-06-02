import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { testDBConnection } from './config/db.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    message: 'DPUAS Fitness API funcionando',
    version: '1.0.0',
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, status: 'online' });
});

app.use('/api/auth', authRoutes);

app.use((err, _req, res, _next) => {
  console.error('Error backend:', err);
  res.status(err.status || 500).json({
    ok: false,
    error: err.message || 'Error interno del servidor',
  });
});

async function startServer() {
  try {
    await testDBConnection();
    app.listen(PORT, () => {
      console.log(`API DPUAS escuchando en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar el backend:', error.message);
    process.exit(1);
  }
}

startServer();
