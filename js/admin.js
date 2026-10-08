/**
 * IFCE Iventus - Módulo do Organizador / Professor e Administrador
 * Fidelidade 100% às telas do Figma (Organizador.png 1, 2, 3, 4, 5)
 */

import { store } from './store.js';
import { api } from './api.js';
import { showToast, openModal, closeModal } from './ui.js';

export const adminModule = {
  activeTab: 'publicados', // 'publicados' | 'ativos' | 'encerrados' | 'cancelados' | 'rascunhos'
  selectedEventForAttendance: 1,
  attendanceSearch: '',
  selectedBannerUrl: '/assets/images/event-comp.svg',
  newEventStatus: 'PUBLICADO',
  editEventStatus: 'PUBLICADO',

  // ------------------------------------------------------------------------
  // Tela 1: Meus Eventos (Figma Organizador Tela 1)
  // ------------------------------------------------------------------------
  renderMyEventsTable(containerId = 'my-events-table-body') {
    const tbody = document.getElementById(containerId);
    if (!tbody) return;

    let events = store.getEvents();

    // Filtro por abas do Figma
    if (this.activeTab === 'ativos') {
      events = events.filter(e => e.statusOriginal === 'PUBLICADO' || e.statusOriginal === 'ATIVO');
    } else if (this.activeTab === 'encerrados') {
      events = events.filter(e => e.statusOriginal === 'ENCERRADO');
    } else if (this.activeTab === 'cancelados') {
      events = events.filter(e => e.statusOriginal === 'CANCELADO');
    } else if (this.activeTab === 'rascunhos') {
      events = events.filter(e => e.statusOriginal === 'RASCUNHO');
    } else if (this.activeTab === 'publicados') {
      // Exibe publicados
      events = events.filter(e => e.statusOriginal !== 'RASCUNHO');
    }

    if (events.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 36px; color: var(--color-text-muted);">
            Nenhum evento encontrado nesta categoria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = events.map(evt => {
      let statusBadge = '<span class="status-pill-outline status-pill-ativo">Ativo</span>';
      if (evt.statusOriginal === 'ENCERRADO') {
        statusBadge = '<span class="status-pill-outline status-pill-encerrado">Encerrado</span>';
      } else if (evt.statusOriginal === 'CANCELADO') {
        statusBadge = '<span class="status-pill-outline status-pill-cancelado">Cancelado</span>';
      } else if (evt.statusOriginal === 'RASCUNHO') {
        statusBadge = '<span class="status-pill-outline status-pill-rascunho">Rascunho</span>';
      }

      const enrolledStr = String(evt.occupiedSeats).padStart(2, '0');

      return `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 54px; height: 38px; border-radius: 6px; background-color: #E2E8F0; overflow: hidden; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <img src="${evt.cover}" alt="${evt.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/assets/images/event-comp.svg'" />
              </div>
              <div>
                <div style="font-weight: 700; color: #0F172A; font-size: 14px;">${evt.title}</div>
                <div style="font-size: 12px; color: #64748B;">${evt.datesLabel}</div>
              </div>
            </div>
          </td>
          <td style="color: #475569; font-size: 13px;">${evt.datesLabel}</td>
          <td>${statusBadge}</td>
          <td style="font-weight: 600; color: #0F172A; font-size: 14px;">${enrolledStr}</td>
          <td>
            <div style="display: flex; gap: 10px; align-items: center;">
              <button class="btn btn-icon-only" title="Visualizar Detalhes" onclick="window.eventsModule.openEventDetailsModal('${evt.id}')" style="background: transparent; border: none; font-size: 18px; cursor: pointer;">
                👁️
              </button>
              <button class="btn btn-icon-only" title="Editar Evento" onclick="window.adminModule.openEditEventModal('${evt.id}')" style="background: transparent; border: none; font-size: 18px; cursor: pointer;">
                ✏️
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  // ------------------------------------------------------------------------
  // Tela 2: Modal Criando Evento (Figma Organizador Tela 2 - Fundo Verde)
  // ------------------------------------------------------------------------
  openCreateEventModal() {
    const form = document.getElementById('form-create-event-figma');
    if (form) form.reset();

    this.selectedBannerUrl = '/assets/images/event-comp.svg';
    this.newEventStatus = 'PUBLICADO';

    const preview = document.getElementById('create-modal-preview-img');
    if (preview) preview.src = this.selectedBannerUrl;

    this.updateCreateStatusButtons('Ativo');
    openModal('modal-create-event-figma');
  },

  updateCreateStatusButtons(selected) {
    const btnAtivo = document.getElementById('create-status-btn-ativo');
    const btnRascunho = document.getElementById('create-status-btn-rascunho');

    if (btnAtivo && btnRascunho) {
      if (selected === 'Ativo') {
        btnAtivo.style.backgroundColor = '#16A34A';
        btnAtivo.style.color = '#FFFFFF';
        btnRascunho.style.backgroundColor = '#475569';
        btnRascunho.style.color = '#FFFFFF';
        this.newEventStatus = 'PUBLICADO';
      } else {
        btnAtivo.style.backgroundColor = '#22C55E';
        btnAtivo.style.color = '#FFFFFF';
        btnRascunho.style.backgroundColor = '#0F172A';
        btnRascunho.style.color = '#FFFFFF';
        this.newEventStatus = 'RASCUNHO';
      }
    }
  },

  async handleBannerUpload(file, previewImgId) {
    if (!file) return;
    try {
      showToast('Enviando imagem do banner...', 'info');
      const res = await api.uploadFile(file);
      this.selectedBannerUrl = res.url;

      const preview = document.getElementById(previewImgId);
      if (preview) {
        preview.src = res.url;
        preview.style.display = 'block';
      }
      showToast('Banner carregado com sucesso!', 'success');
    } catch (err) {
      showToast(err.message || 'Erro ao carregar banner.', 'error');
    }
  },

  async handleCreateEventSubmit() {
    const form = document.getElementById('form-create-event-figma');
    if (!form) return;

    const title = form.querySelector('[name="title"]').value.trim();
    const location = form.querySelector('[name="location"]').value.trim();
    const dateInput = form.querySelector('[name="date"]').value.trim();
    const timeInput = form.querySelector('[name="time"]').value.trim();
    const description = form.querySelector('[name="description"]').value.trim();

    if (!title || !location) {
      showToast('Por favor, informe o nome e o local do evento.', 'error');
      return;
    }

    // Datas padrão do evento para cumprir a constraint MySQL
    const now = new Date();
    const dataInicio = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const dataFim = new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000).toISOString();
    const inicioInsc = now.toISOString();
    const fimInsc = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString();

    try {
      await store.createEvent({
        titulo: title,
        descricao: description || 'Evento científico promovido pelo IFCE Campus Cedro.',
        banner_url: this.selectedBannerUrl,
        local: location,
        horario: timeInput || '08:00h - 18:00h',
        modalidade: location.toLowerCase().includes('online') ? 'Online' : 'Presencial',
        data_inicio: dataInicio,
        data_fim: dataFim,
        inicio_inscricoes: inicioInsc,
        fim_inscricoes: fimInsc,
        status: this.newEventStatus,
        limite_vagas: 100,
      });

      showToast('Evento criado com sucesso no banco de dados!', 'success');
      closeModal('modal-create-event-figma');
      this.renderMyEventsTable();
      window.eventsModule.renderEventsGrid();
    } catch (err) {
      showToast(err.message || 'Erro ao criar evento.', 'error');
    }
  },

  // ------------------------------------------------------------------------
  // Tela 3: Modal Editando Evento (Figma Organizador Tela 3 - Fundo Amarelo)
  // ------------------------------------------------------------------------
  openEditEventModal(eventId) {
    const evt = store.getEventById(eventId);
    if (!evt) return;

    const form = document.getElementById('form-edit-event-figma');
    if (!form) return;

    form.querySelector('[name="id"]').value = evt.id;
    form.querySelector('[name="title"]').value = evt.title;
    form.querySelector('[name="location"]').value = evt.location;
    form.querySelector('[name="date"]').value = evt.datesLabel;
    form.querySelector('[name="time"]').value = evt.timeLabel;
    form.querySelector('[name="description"]').value = evt.description;

    this.selectedBannerUrl = evt.cover;
    this.editEventStatus = evt.statusOriginal || 'PUBLICADO';

    const preview = document.getElementById('edit-modal-preview-img');
    if (preview) preview.src = evt.cover;

    this.highlightEditStatusButtons(this.editEventStatus);
    openModal('modal-edit-event-figma');
  },

  highlightEditStatusButtons(status) {
    const map = {
      'PUBLICADO': 'edit-status-btn-publicado',
      'ATIVO': 'edit-status-btn-publicado',
      'ENCERRADO': 'edit-status-btn-encerrado',
      'CANCELADO': 'edit-status-btn-cancelado',
      'RASCUNHO': 'edit-status-btn-rascunho',
    };
    ['edit-status-btn-publicado', 'edit-status-btn-encerrado', 'edit-status-btn-cancelado', 'edit-status-btn-rascunho'].forEach(btnId => {
      const el = document.getElementById(btnId);
      if (el) {
        if (el.id === map[status]) {
          el.style.outline = '3px solid #0F172A';
          el.style.boxShadow = '0 0 0 2px #FFFFFF inset';
          el.style.opacity = '1';
        } else {
          el.style.outline = 'none';
          el.style.boxShadow = 'none';
          el.style.opacity = '0.7';
        }
      }
    });
  },

  async handleEditEventSubmit() {
    const form = document.getElementById('form-edit-event-figma');
    if (!form) return;

    const id = form.querySelector('[name="id"]').value;
    const title = form.querySelector('[name="title"]').value.trim();
    const location = form.querySelector('[name="location"]').value.trim();
    const description = form.querySelector('[name="description"]').value.trim();

    try {
      await store.updateEvent(id, {
        titulo: title,
        local: location,
        descricao: description,
        banner_url: this.selectedBannerUrl,
        status: this.editEventStatus,
      });

      showToast('Evento atualizado com sucesso no banco de dados!', 'success');
      closeModal('modal-edit-event-figma');
      this.renderMyEventsTable();
      window.eventsModule.renderEventsGrid();
    } catch (err) {
      showToast(err.message || 'Erro ao salvar alterações do evento.', 'error');
    }
  },

  async handleSetEventStatus(status) {
    const form = document.getElementById('form-edit-event-figma');
    if (!form) return;
    const id = form.querySelector('[name="id"]').value;

    try {
      this.editEventStatus = status;
      this.highlightEditStatusButtons(status);
      await store.updateEventStatus(id, status);
      showToast(`Status do evento alterado para ${status}!`, 'info');
      closeModal('modal-edit-event-figma');
      this.renderMyEventsTable();
      window.eventsModule.renderEventsGrid();
    } catch (err) {
      showToast(err.message || 'Falha ao alterar status.', 'error');
    }
  },

  // ------------------------------------------------------------------------
  // Tela 4: Gestão de Inscrições & Frequência (Figma Organizador Tela 4)
  // ------------------------------------------------------------------------
  async renderAttendanceManagement(containerId = 'attendance-table-body-comp') {
    const tbody = document.getElementById(containerId);
    if (!tbody) return;

    try {
      const res = await api.getEventRegistrations(1); // Semana da Computação 2024
      const attendees = res.attendees || [];

      let filtered = attendees;
      if (this.attendanceSearch.trim()) {
        const q = this.attendanceSearch.toLowerCase().trim();
        filtered = attendees.filter(a =>
          a.nome.toLowerCase().includes(q) ||
          a.turma.toLowerCase().includes(q) ||
          (a.matricula && a.matricula.toLowerCase().includes(q))
        );
      }

      tbody.innerHTML = filtered.map(a => `
        <tr>
          <td style="font-weight: 700; color: #0F172A; font-size: 14px;">${a.nome}</td>
          <td style="color: #64748B; font-size: 13px;">${a.turma}</td>
          <td>
            <div class="presence-checkbox-wrap" onclick="window.adminModule.togglePresence(${a.id_inscricao}, ${!a.presente})">
              <div class="presence-checkbox-box ${a.presente ? 'checked' : ''}">
                ${a.presente ? '✓' : ''}
              </div>
            </div>
          </td>
          <td>
            ${a.tem_certificado ? `
              <button class="btn btn-icon-only" title="Baixar Certificado Oficial do Aluno" onclick="window.eventsModule.downloadCertificatePDF('${a.codigo_certificado}', 'Semana da Computação 2024', '20h', '16 a 18 de Maio de 2024')" style="background: transparent; border: none; font-size: 20px; cursor: pointer;">
                📜
              </button>
            ` : `
              <span style="color: #94A3B8; font-size: 18px;">—</span>
            `}
          </td>
        </tr>
      `).join('');
    } catch (err) {
      console.warn('Erro ao carregar lista de presença:', err);
    }
  },

  async togglePresence(regId, newStatus) {
    try {
      await store.setAttendance(regId, newStatus);
      showToast(
        newStatus ? 'Presença confirmada! Certificado acadêmico emitido.' : 'Presença desmarcada.',
        'success'
      );
      this.renderAttendanceManagement();
    } catch (err) {
      showToast(err.message || 'Erro ao registrar frequência.', 'error');
    }
  },

  // Exportar lista em PDF ou Excel (CSV)
  exportAttendeesExcel() {
    window.location.href = api.getExportCSVUrl(1);
    showToast('Planilha de inscritos exportada com sucesso!', 'success');
  },
};
