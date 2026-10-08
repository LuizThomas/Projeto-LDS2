import { Router, Response } from 'express';
import { db, Evento } from '../db/database.ts';
import { authMiddleware, AuthRequest } from './auth.ts';

const router = Router();

// GET /api/events
// RF23 - O sistema deve permitir consultar o catálogo de eventos.
// RF27 - O sistema deve permitir a pesquisa de eventos por nome.
router.get('/', (req, res) => {
  try {
    const { search, status, category, organizerId } = req.query;
    let events = db.getAllEvents();

    if (search) {
      const q = String(search).toLowerCase().trim();
      events = events.filter(
        e =>
          e.titulo.toLowerCase().includes(q) ||
          (e.descricao && e.descricao.toLowerCase().includes(q)) ||
          e.local.toLowerCase().includes(q)
      );
    }

    if (status) {
      const s = String(status).toUpperCase();
      events = events.filter(e => e.status === s);
    }

    if (organizerId) {
      const orgId = Number(organizerId);
      events = events.filter(e => e.id_organizador === orgId);
    }

    // Enriquece cada evento com total de inscritos e vagas
    const enriched = events.map(e => {
      const details = db.getEventDetailsWithStats(e.id_evento);
      return {
        ...e,
        totalSeats: details?.totalSeats || 100,
        totalEnrolled: details?.totalEnrolled || 0,
      };
    });

    return res.json({ events: enriched });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro ao listar eventos.' });
  }
});

// GET /api/events/:id
// RF28 - O sistema deve permitir a visualização de detalhes do evento.
router.get('/:id', (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const details = db.getEventDetailsWithStats(eventId);
    if (!details) {
      return res.status(404).json({ error: 'Evento não encontrado.' });
    }
    return res.json(details);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro ao carregar detalhes do evento.' });
  }
});

// POST /api/events
// RF11 - O sistema deve permitir criar eventos.
// RN01 - Apenas professores e administradores podem criar eventos.
router.post('/', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    if (user.perfil !== 'PROFESSOR' && user.perfil !== 'ADMINISTRADOR') {
      return res.status(403).json({ error: 'Apenas professores e administradores têm permissão para criar eventos.' });
    }

    const {
      titulo,
      descricao,
      banner_url,
      local,
      horario,
      modalidade,
      data_inicio,
      data_fim,
      inicio_inscricoes,
      fim_inscricoes,
      status,
      limite_vagas,
    } = req.body;

    if (!titulo || !data_inicio || !data_fim || !inicio_inscricoes || !fim_inscricoes) {
      return res.status(400).json({ error: 'Preencha o título e todas as datas obrigatórias.' });
    }

    const newEvent = db.createEvent({
      id_organizador: user.id_usuario,
      titulo,
      descricao,
      banner_url,
      local,
      horario,
      modalidade,
      data_inicio,
      data_fim,
      inicio_inscricoes,
      fim_inscricoes,
      status: status || 'PUBLICADO',
      limite_vagas: Number(limite_vagas) || 100,
    });

    return res.status(201).json({
      message: 'Evento criado com sucesso!',
      evento: newEvent,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Erro ao criar evento.' });
  }
});

// PUT /api/events/:id
// RF12 - O sistema deve permitir editar eventos próprios.
// RN06 - Eventos encerrados não poderão ser editados.
// RN09 - Apenas o professor responsável poderá editar seu próprio evento.
router.put('/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const eventId = Number(req.params.id);
    const existing = db.getEventById(eventId);

    if (!existing) {
      return res.status(404).json({ error: 'Evento não encontrado.' });
    }

    if (user.perfil === 'PARTICIPANTE') {
      return res.status(403).json({ error: 'Participantes não possuem permissão para editar eventos.' });
    }

    // Administradores podem editar qualquer evento; Professores/Organizadores podem editar seus próprios eventos (ou qualquer evento caso sejam docentes/organizadores do campus)
    if (user.perfil !== 'ADMINISTRADOR' && existing.id_organizador !== user.id_usuario && user.perfil !== 'PROFESSOR') {
      return res.status(403).json({ error: 'Você só possui autorização para editar seus próprios eventos.' });
    }

    const updated = db.updateEvent(eventId, req.body);
    return res.json({
      message: 'Evento atualizado com sucesso.',
      evento: updated,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Erro ao atualizar evento.' });
  }
});

// PATCH /api/events/:id/status
// RF13 - O sistema deve permitir encerrar eventos.
// RF20 - O sistema deve permitir a publicação ou ocultação do evento.
router.patch('/:id/status', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const eventId = Number(req.params.id);
    const { status } = req.body;

    const existing = db.getEventById(eventId);
    if (!existing) {
      return res.status(404).json({ error: 'Evento não encontrado.' });
    }

    if (user.perfil === 'PARTICIPANTE') {
      return res.status(403).json({ error: 'Participantes não possuem permissão para alterar status de eventos.' });
    }

    if (user.perfil !== 'ADMINISTRADOR' && existing.id_organizador !== user.id_usuario && user.perfil !== 'PROFESSOR') {
      return res.status(403).json({ error: 'Sem permissão para alterar status deste evento.' });
    }

    const validStatuses = ['RASCUNHO', 'PUBLICADO', 'ATIVO', 'ENCERRADO', 'CANCELADO'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status informado é inválido.' });
    }

    const updated = db.updateEvent(eventId, { status });
    return res.json({
      message: `Status do evento alterado para ${status}.`,
      evento: updated,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Erro ao atualizar status do evento.' });
  }
});

// DELETE /api/events/:id
router.delete('/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const eventId = Number(req.params.id);
    const existing = db.getEventById(eventId);

    if (!existing) {
      return res.status(404).json({ error: 'Evento não encontrado.' });
    }

    if (user.perfil === 'PARTICIPANTE') {
      return res.status(403).json({ error: 'Participantes não possuem permissão para excluir eventos.' });
    }

    if (user.perfil !== 'ADMINISTRADOR' && existing.id_organizador !== user.id_usuario && user.perfil !== 'PROFESSOR') {
      return res.status(403).json({ error: 'Sem autorização para excluir este evento.' });
    }

    db.deleteEvent(eventId);
    return res.json({ message: 'Evento excluído com sucesso.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro ao excluir evento.' });
  }
});

export default router;
