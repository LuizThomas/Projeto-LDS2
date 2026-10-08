/**
 * IFCE Iventus - Store Centralizado Integrado com a API e Banco db_eventos_ifce
 * Reatividade, persistência e sincronização de dados
 */

import { api } from './api.js';

const CURRENT_USER_KEY = 'ifce_iventus_current_user_v2';

class Store {
  constructor() {
    this.listeners = new Set();
    this.state = {
      events: [],
      registrations: [],
      certificates: [],
      attendees: [],
    };
    this.currentUser = null;
    this.init();
  }

  async init() {
    // Carrega usuário salvo localmente ou tenta validar token
    try {
      const storedUser = localStorage.getItem(CURRENT_USER_KEY);
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    } catch (e) {
      console.warn('Erro ao ler usuário local:', e);
    }

    // Se não tiver usuário logado, inicializa com Luiz Thomas (Participante) por padrão
    if (!this.currentUser) {
      this.currentUser = {
        id: 1,
        id_usuario: 1,
        name: 'Luiz Thomas Marte Moreira',
        nome: 'Luiz Thomas Marte Moreira',
        email: 'luiz.thomas@gmail.com',
        role: 'participante',
        perfil: 'PARTICIPANTE',
        matricula: '123456789101112',
        telefone: '(88) 99999-9999',
        curso: 'Informática S6',
        campus: 'Campus Cedro - IFCE',
        avatar: '/assets/images/avatar-lais.svg',
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(this.currentUser));
    }

    // Garante que haja um token JWT ativo para o usuário atual
    try {
      await api.ensureSessionToken(this.currentUser.id || this.currentUser.id_usuario || 1);
    } catch (e) {
      // continua com fallback do servidor
    }

    await this.refreshAllData();
  }

  async refreshAllData() {
    try {
      // 1. Carrega eventos da API
      const eventsData = await api.getEvents();
      if (eventsData && eventsData.events) {
        this.state.events = eventsData.events.map(e => this.formatEventFromApi(e));
      }

      // 2. Se houver usuário logado, carrega inscrições e certificados
      if (this.currentUser) {
        try {
          const regsData = await api.getMyRegistrations();
          if (regsData && regsData.registrations) {
            this.state.registrations = regsData.registrations;
          }
        } catch (e) {
          console.warn('Inscrições locais/fallback:', e);
        }

        try {
          const certsData = await api.getMyCertificates();
          if (certsData && certsData.certificates) {
            this.state.certificates = certsData.certificates;
          }
        } catch (e) {
          console.warn('Certificados locais/fallback:', e);
        }
      }

      this.notify();
    } catch (err) {
      console.error('Erro ao sincronizar store com API:', err);
    }
  }

  formatEventFromApi(e) {
    const dInicio = new Date(e.data_inicio);
    const dFim = new Date(e.data_fim);

    let datesLabel = dInicio.toLocaleDateString('pt-BR');
    if (dInicio.getMonth() === dFim.getMonth() && dInicio.getDate() !== dFim.getDate()) {
      datesLabel = `${dInicio.getDate()} a ${dFim.getDate()} de ${dInicio.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`;
    }

    return {
      id: e.id_evento,
      id_evento: e.id_evento,
      title: e.titulo,
      titulo: e.titulo,
      description: e.descricao || '',
      descricao: e.descricao || '',
      category: e.modalidade === 'Online' ? 'Inteligência Artificial' : 'Tecnologia',
      modalidade: e.modalidade || 'Presencial',
      local: e.local || 'Campus Cedro - IFCE',
      location: e.local || 'Campus Cedro - IFCE',
      horario: e.horario || '08:00h - 18:00h',
      timeLabel: e.horario || '08:00h - 18:00h',
      dateStart: e.data_inicio ? e.data_inicio.split('T')[0] : '',
      dateEnd: e.data_fim ? e.data_fim.split('T')[0] : '',
      data_inicio: e.data_inicio,
      data_fim: e.data_fim,
      inicio_inscricoes: e.inicio_inscricoes,
      fim_inscricoes: e.fim_inscricoes,
      datesLabel,
      workload: '20 horas',
      workloadHours: 20,
      totalSeats: e.totalSeats || 100,
      occupiedSeats: e.totalEnrolled || 0,
      status: (e.status || 'PUBLICADO').toLowerCase(),
      statusOriginal: e.status || 'PUBLICADO',
      organizerId: e.id_organizador,
      cover: e.banner_url || '/assets/images/event-comp.svg',
      banner_url: e.banner_url || '/assets/images/event-comp.svg',
    };
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state, this.currentUser));
  }

  // --- Gestão de Usuário ---
  getCurrentUser() {
    return this.currentUser;
  }

  setCurrentUser(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
    this.refreshAllData();
    this.notify();
  }

  async switchRole(role) {
    let email = 'luiz.thomas@gmail.com';
    let pass = 'alunoifce';
    if (role === 'professor') {
      email = 'saulo_bezerra@gmail.com';
      pass = 'professor123';
    } else if (role === 'administrador') {
      email = 'admin@ifce.edu.br';
      pass = 'admin123';
    }

    try {
      const res = await api.login(email, pass);
      const u = res?.user;
      const normalizedUser = {
        id: u?.id_usuario || (role === 'professor' ? 2 : role === 'administrador' ? 3 : 1),
        id_usuario: u?.id_usuario || (role === 'professor' ? 2 : role === 'administrador' ? 3 : 1),
        name: u?.nome || (role === 'professor' ? 'Saulo Bezerra' : role === 'administrador' ? 'Administrador IFCE' : 'Luiz Thomas Marte Moreira'),
        nome: u?.nome || (role === 'professor' ? 'Saulo Bezerra' : role === 'administrador' ? 'Administrador IFCE' : 'Luiz Thomas Marte Moreira'),
        email: u?.email || email,
        role: (u?.perfil || role).toLowerCase(),
        perfil: u?.perfil || (role === 'professor' ? 'PROFESSOR' : role === 'administrador' ? 'ADMINISTRADOR' : 'PARTICIPANTE'),
        matricula: u?.matricula || (role === 'professor' ? 'SIAPE 2849102' : role === 'administrador' ? 'SIAPE 1002003' : '123456789101112'),
        telefone: u?.telefone || '(88) 99999-9999',
        materias: u?.materias || (role === 'professor' ? 'LDS ARQM' : null),
        curso: role === 'professor' ? 'Professor / Coordenador LDS' : role === 'administrador' ? 'Diretoria de Extensão IFCE' : 'Informática S6',
        campus: 'Campus Cedro - IFCE',
        avatar: u?.foto_perfil || (role === 'professor' ? '/assets/images/avatar-prof.svg' : role === 'administrador' ? '/assets/images/avatar-admin.svg' : '/assets/images/avatar-lais.svg'),
      };
      this.setCurrentUser(normalizedUser);
      return normalizedUser;
    } catch (e) {
      console.warn('Erro ao alternar perfil via login:', e);
      throw e;
    }
  }

  // --- Métodos de Eventos ---
  getEvents() {
    return this.state.events;
  }

  getEventById(id) {
    const numId = Number(id);
    return this.state.events.find(e => e.id === numId || e.id_evento === numId);
  }

  async createEvent(eventData) {
    const res = await api.createEvent(eventData);
    await this.refreshAllData();
    return res.evento;
  }

  async updateEvent(id, eventData) {
    const res = await api.updateEvent(Number(id), eventData);
    await this.refreshAllData();
    return res.evento;
  }

  async updateEventStatus(id, status) {
    const res = await api.updateEventStatus(Number(id), status);
    await this.refreshAllData();
    return res.evento;
  }

  async deleteEvent(id) {
    await api.deleteEvent(Number(id));
    await this.refreshAllData();
  }

  // --- Inscrições ---
  getRegistrationsForUser() {
    return this.state.registrations;
  }

  isUserRegistered(eventId) {
    const numId = Number(eventId);
    return this.state.registrations.some(
      r => (r.id_evento === numId || r.eventId === numId) && r.status !== 'CANCELADA'
    );
  }

  async enrollEvent(eventId) {
    const res = await api.enroll(Number(eventId));
    await this.refreshAllData();
    return res;
  }

  async cancelEnrollment(regId) {
    const res = await api.cancelRegistration(Number(regId));
    await this.refreshAllData();
    return res;
  }

  // --- Frequência e Certificados ---
  async setAttendance(regId, presente) {
    const res = await api.setAttendance(Number(regId), presente);
    await this.refreshAllData();
    return res;
  }

  getCertificatesForUser() {
    return this.state.certificates;
  }

  async updateUserProfile(data) {
    const res = await api.updateProfile(data);
    if (res.user) {
      this.setCurrentUser({
        ...this.currentUser,
        ...data,
      });
    }
    return res;
  }
}

export const store = new Store();
