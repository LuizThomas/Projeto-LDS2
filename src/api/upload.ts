import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do Multer para armazenamento no disco
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.png';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'upload-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg|gif/;
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    if (allowed.test(ext) || allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de arquivo inválido. Permitidos: JPG, PNG, WEBP, SVG, GIF.'));
    }
  },
});

// POST /api/upload
// Recebe multipart/form-data com o campo 'file' ou 'image'
router.post('/', upload.single('file') as any, (req: Request, res: Response) => {
  try {
    if (!req.file) {
      // Se não veio multipart, verifica se veio base64 no body
      if (req.body && req.body.base64) {
        return res.json({
          url: req.body.base64,
          filename: 'base64-image',
          size: req.body.base64.length,
        });
      }
      return res.status(400).json({ error: 'Nenhum arquivo de imagem foi enviado.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    return res.json({
      message: 'Upload realizado com sucesso!',
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro durante o upload da imagem.' });
  }
});

export default router;
