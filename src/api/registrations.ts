import { Router, Response } from 'express';
import { db } from '../db/database.ts';
import { authMiddleware, AuthRequest } from './auth.ts';

export const registrationsRouter = Router();
export const attendanceRouter = Router();
export const certificatesRouter = Router();

// ============================================================================
// 1. Inscrições (Registrations)
// ============================================================================

// GET /api/registrations/my
// RF15 - O sistema deve permitir o acompanhamento de inscrições.
registrationsRouter.get('/my', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const regs = db.getRegistrationsByUser(user.id_usuario);

    const formatted = regs.map(r => {
      const activity = db.getActivityById(r.id_atividade);
      const event = activity ? db.getEventById(activity.id_evento) : undefined;
      const freq = db.getFrequencyByRegistration(r.id_inscricao);
      const cert = freq ? db.state.certificado.find(c => c.id_frequencia === freq.id_frequencia) : undefined;

      return {
        id_inscricao: r.id_inscricao,
        id_atividade: r.id_atividade,
        id_evento: event?.id_evento,
        titulo: event?.titulo || 'Evento Acadêmico',
        local: event?.local || 'Campus Cedro - IFCE',
        modalidade: event?.modalidade || 'Presencial',
        horario: event?.horario || '08:00h - 18:00h',
        data_inicio: event?.data_inicio,
        data_fim: event?.data_fim,
        fim_inscricoes: event?.fim_inscricoes,
        banner_url: event?.banner_url || '/assets/images/event-comp.svg',
        data_inscricao: r.data_inscricao,
        presente: freq?.presente || false,
        tem_certificado: !!cert,
        codigo_certificado: cert?.codigo_validacao,
      };
    });

    return res.json({ registrations: formatted });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro ao carregar inscrições.' });
  }
});

// GET /api/registrations/event/:id
// RF21 - O sistema deve permitir a visualização da lista de participantes inscritos.
registrationsRouter.get('/event/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const eventId = Number(req.params.id);
    const details = db.getEventDetailsWithStats(eventId);
    if (!details) {
      return res.status(404).json({ error: 'Evento não encontrado.' });
    }
    return res.json({ attendees: details.attendees, evento: details.evento });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro ao carregar lista de inscritos.' });
  }
});

// POST /api/registrations
// RF24 - O sistema deve permitir realizar inscrições em eventos.
// RN05 - Um participante não poderá se inscrever duas vezes ou mais no mesmo evento.
// RN07 - O período de inscrições deve ser encerrado antes da data de início do evento.
// RN08 - O número de participantes não pode ultrapassar o limite de vagas definido para o evento.
registrationsRouter.post('/', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { activityId, eventId } = req.body;

    let targetActivityId = activityId ? Number(activityId) : 0;

    if (!targetActivityId && eventId) {
      const activities = db.getActivitiesByEventId(Number(eventId));
      if (activities.length > 0) {
        targetActivityId = activities[0].id_atividade;
      }
    }

    if (!targetActivityId) {
      return res.status(400).json({ error: 'Atividade/Evento inválido para inscrição.' });
    }

    const reg = db.createRegistration(user.id_usuario, targetActivityId);
    return res.status(201).json({
      message: 'Inscrição confirmada com sucesso!',
      inscricao: reg,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Erro ao realizar inscrição.' });
  }
});

// POST /api/registrations/:id/cancel
// RF29 - O sistema deve permitir o cancelamento da inscrição.
// RN12 - Um participante poderá cancelar sua inscrição apenas antes do encerramento das inscrições.
registrationsRouter.post('/:id/cancel', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const regId = Number(req.params.id);

    db.cancelRegistration(regId, user.id_usuario);
    return res.json({ message: 'Inscrição cancelada com sucesso.' });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Não foi possível cancelar a inscrição.' });
  }
});

// ============================================================================
// 2. Frequência / Presença (Attendance)
// ============================================================================
function handleSetAttendance(req: AuthRequest, res: Response) {
  try {
    const user = req.user!;
    if (user.perfil !== 'PROFESSOR' && user.perfil !== 'ADMINISTRADOR') {
      return res.status(403).json({ error: 'Apenas professores e administradores podem registrar frequência.' });
    }

    const { registrationId, presente } = req.body;
    if (!registrationId) {
      return res.status(400).json({ error: 'Identificador da inscrição obrigatório.' });
    }

    const result = db.setAttendance(Number(registrationId), Boolean(presente));
    return res.json({
      message: 'Frequência atualizada com sucesso.',
      frequencia: result.frequencia,
      certificado: result.certificado,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Erro ao salvar frequência.' });
  }
}

attendanceRouter.post(['/', '/attendance'], authMiddleware, handleSetAttendance);
registrationsRouter.post('/attendance', authMiddleware, handleSetAttendance);

// ============================================================================
// 3. Certificados (Certificates)
// ============================================================================
function handleGetMyCertificates(req: AuthRequest, res: Response) {
  try {
    const user = req.user!;
    const certs = db.getCertificatesByUser(user.id_usuario);
    return res.json({ certificates: certs });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro ao consultar certificados.' });
  }
}

function handleVerifyCertificate(req: any, res: Response) {
  try {
    const { code } = req.params;
    const certDetails = db.findCertificateByCode(code);
    if (!certDetails) {
      return res.status(404).json({
        valido: false,
        error: 'Certificado não encontrado ou código de validação inválido.',
      });
    }

    return res.json({
      valido: true,
      certificado: certDetails.certificado,
      participante: certDetails.participante,
      evento: certDetails.evento?.titulo,
      data_emissao: certDetails.certificado.data_emissao,
      instituicao: 'Instituto Federal do Ceará - Campus Cedro',
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro ao validar certificado.' });
  }
}

certificatesRouter.get(['/my', '/certificates/my'], authMiddleware, handleGetMyCertificates);
certificatesRouter.get(['/verify/:code', '/certificates/verify/:code'], handleVerifyCertificate);

// Fallbacks em registrationsRouter caso alguma chamada use /api/registrations/certificates/my
registrationsRouter.get('/certificates/my', authMiddleware, handleGetMyCertificates);
registrationsRouter.get('/certificates/verify/:code', handleVerifyCertificate);

export default registrationsRouter;
