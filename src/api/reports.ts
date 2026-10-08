import { Router, Response } from 'express';
import { db } from '../db/database.ts';
import { authMiddleware, AuthRequest } from './auth.ts';

const router = Router();

// GET /api/reports/participants/:eventId/csv
// RF21 - Disponibilizar opção para baixar a lista em PDF ou Excel
router.get('/participants/:eventId/csv', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const eventId = Number(req.params.eventId);
    const details = db.getEventDetailsWithStats(eventId);
    if (!details) {
      return res.status(404).json({ error: 'Evento não encontrado.' });
    }

    const rows = [
      ['ID', 'Nome do Aluno', 'E-mail', 'Matrícula', 'Turma', 'Presença', 'Certificado Emitido'],
    ];

    details.attendees.forEach(a => {
      rows.push([
        String(a.id_usuario),
        `"${a.nome.replace(/"/g, '""')}"`,
        `"${a.email}"`,
        `"${a.matricula || ''}"`,
        `"${a.turma}"`,
        a.presente ? 'Confirmada' : 'Ausente',
        a.tem_certificado ? `Sim (${a.codigo_certificado || ''})` : 'Não',
      ]);
    });

    const csvContent = '\uFEFF' + rows.map(r => r.join(';')).join('\r\n');
    const filename = `inscritos_evento_${eventId}_ifce.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(csvContent);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro ao gerar relatório CSV.' });
  }
});

// GET /api/admin/overview
// RF09 - O sistema deve gerar relatórios administrativos
router.get('/admin/overview', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    if (user.perfil !== 'ADMINISTRADOR') {
      return res.status(403).json({ error: 'Apenas administradores podem acessar a visão geral administrativa.' });
    }

    const allUsers = db.getAllUsers();
    const allEvents = db.getAllEvents();
    const allRegistrations = db.state.inscricao.filter(r => r.status === 'CONFIRMADA');
    const allCertificates = db.state.certificado;

    return res.json({
      totalUsers: allUsers.length,
      totalEvents: allEvents.length,
      totalRegistrations: allRegistrations.length,
      totalCertificates: allCertificates.length,
      eventsByStatus: {
        publicados: allEvents.filter(e => e.status === 'PUBLICADO').length,
        encerrados: allEvents.filter(e => e.status === 'ENCERRADO').length,
        cancelados: allEvents.filter(e => e.status === 'CANCELADO').length,
        rascunhos: allEvents.filter(e => e.status === 'RASCUNHO').length,
      },
      usersByRole: {
        participantes: allUsers.filter(u => u.perfil === 'PARTICIPANTE').length,
        professores: allUsers.filter(u => u.perfil === 'PROFESSOR').length,
        administradores: allUsers.filter(u => u.perfil === 'ADMINISTRADOR').length,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro ao carregar estatísticas.' });
  }
});

export default router;
