import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import authRouter from './src/api/auth.ts';
import eventsRouter from './src/api/events.ts';
import registrationsRouter, { attendanceRouter, certificatesRouter } from './src/api/registrations.ts';
import reportsRouter from './src/api/reports.ts';
import uploadRouter from './src/api/upload.ts';
import { db } from './src/db/database.ts';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Middlewares essenciais
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos de uploads locais e assets estáticos
const uploadsPath = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));
app.use('/assets', express.static(path.resolve(process.cwd(), 'assets')));
app.use('/css', express.static(path.resolve(process.cwd(), 'css')));
app.use('/js', express.static(path.resolve(process.cwd(), 'js')));

// Rotas da API REST do IFCE Iventus
app.use('/api/auth', authRouter);
app.use('/api/profile', authRouter);
app.use('/api/events', eventsRouter);
app.use('/api/registrations', registrationsRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/certificates', certificatesRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/upload', uploadRouter);

// Health check & status do banco de dados (MySQL / SQLite / Relational Storage)
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    system: 'IFCE Iventus - Plataforma de Gestão de Eventos Científicos',
    database: db.getMySQLStatus(),
  });
});

async function bootstrap() {
  if (!isProduction) {
    // Modo Desenvolvimento: Monta o middleware do Vite para HMR e suporte SPA
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Modo Produção: Serve o build gerado em dist/
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 IFCE Iventus iniciado com sucesso em http://0.0.0.0:${PORT}`);
    console.log(`📊 Banco de dados: db_eventos_ifce`);
  });
}

bootstrap().catch(err => {
  console.error('Falha crítica ao iniciar o servidor:', err);
  process.exit(1);
});
