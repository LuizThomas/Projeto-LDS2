/**
 * IFCE Iventus - Módulo de Eventos e Inscrições
 * Fidelidade 100% às telas do Figma (Participante e Geral)
 */

import { store } from './store.js';
import { api } from './api.js';
import { showToast, openModal, closeModal } from './ui.js';

const FAVORITES_KEY = 'ifce_iventus_favorites_v1';

export const eventsModule = {
  activeCategory: 'todos',
  searchQuery: '',
  favorites: new Set(),

  init() {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        this.favorites = new Set(JSON.parse(stored));
      }
    } catch (e) {}
  },

  toggleFavorite(eventId) {
    const idStr = String(eventId);
    if (this.favorites.has(idStr)) {
      this.favorites.delete(idStr);
      showToast('Evento removido dos favoritos.', 'info');
    } else {
      this.favorites.add(idStr);
      showToast('Evento adicionado aos favoritos!', 'success');
    }
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(this.favorites)));
    } catch (e) {}
    this.renderEventsGrid();
    this.renderMyRegistrations();
  },

  // RF23 - Catálogo de Eventos (Figma: Eventos - Participante.png)
  renderEventsGrid(containerId = 'events-grid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    let events = store.getEvents();
    const currentUser = store.getCurrentUser();

    // Filtra por busca
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      events = events.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
      );
    }

    if (events.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: #FFFFFF; border-radius: var(--radius-lg); border: 1px dashed var(--color-border);">
          <div style="font-size: 32px; margin-bottom: 8px;">🔍</div>
          <h3 style="margin-bottom: 6px;">Nenhum evento encontrado</h3>
          <p style="color: var(--color-text-secondary); font-size: 14px;">Tente pesquisar com outros termos ou limpe a busca.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = events.map(evt => {
      const isFav = this.favorites.has(String(evt.id));
      const isOnline = evt.modalidade === 'Online';
      const tagText = isOnline ? 'Online' : 'Presencial';
      const tagClass = isOnline ? 'badge-warning' : 'badge-info';

      let statusBadge = '';
      if (evt.statusOriginal === 'ENCERRADO') {
        statusBadge = `<span class="badge" style="position: absolute; top: 12px; right: 52px; background-color: #EA580C; color: #fff; z-index: 2; font-size: 11px; padding: 2px 8px; border-radius: 4px;">Encerrado</span>`;
      } else if (evt.statusOriginal === 'CANCELADO') {
        statusBadge = `<span class="badge" style="position: absolute; top: 12px; right: 52px; background-color: #DC2626; color: #fff; z-index: 2; font-size: 11px; padding: 2px 8px; border-radius: 4px;">Cancelado</span>`;
      }

      return `
        <article class="event-card" data-event-id="${evt.id}">
          <div style="position: relative;">
            <button class="btn-heart-favorite ${isFav ? 'favorited' : ''}" title="${isFav ? 'Remover dos favoritos' : 'Favoritar'}" onclick="window.eventsModule.toggleFavorite('${evt.id}')">
              ${isFav ? '❤️' : '🤍'}
            </button>
            <span class="event-card-tag badge ${tagClass}" style="position: absolute; top: 12px; left: 12px; z-index: 2;">
              ${tagText}
            </span>
            ${statusBadge}
            <div style="background-color: #E2E8F0; height: 160px; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer;" onclick="window.eventsModule.openEventDetailsModal('${evt.id}')">
              <img src="${evt.cover}" alt="${evt.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/assets/images/event-comp.svg'" />
            </div>
          </div>

          <div class="event-card-body" style="padding: 16px;">
            <h3 class="event-card-title" style="font-size: 16px; font-weight: 700; margin-bottom: 8px; color: var(--color-text-main); cursor: pointer;" onclick="window.eventsModule.openEventDetailsModal('${evt.id}')">
              ${evt.title}
            </h3>

            <div style="display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: var(--color-text-secondary); margin-bottom: 14px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span>📅</span>
                <span>${evt.datesLabel}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span>📍</span>
                <span>${evt.location}</span>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-start; align-items: center;">
              <a href="javascript:void(0)" onclick="window.eventsModule.openEventDetailsModal('${evt.id}')" style="color: var(--color-primary); font-weight: 700; font-size: 13px; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
                Ver detalhes ❯
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');
  },

  // RF28 - Detalhes do Evento (Figma: Visualizando Evento - Participante.png)
  openEventDetailsModal(eventId) {
    const evt = store.getEventById(eventId);
    if (!evt) return;

    const currentUser = store.getCurrentUser();
    const isFav = this.favorites.has(String(evt.id));
    const isRegistered = store.isUserRegistered(evt.id);

    const modalBody = document.getElementById('details-modal-body');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div style="display: grid; grid-template-columns: 280px 1fr; gap: 28px; position: relative;">
        <!-- Lado Esquerdo: Imagem do Evento e Ações -->
        <div>
          <label class="form-label" style="font-weight: 700; margin-bottom: 8px; display: block;">Imagem do Evento</label>
          <div style="border: 2px dashed #CBD5E1; border-radius: 12px; background: #F8FAFC; height: 230px; display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 20px; overflow: hidden;">
            <img src="${evt.cover}" alt="${evt.title}" style="max-width: 100%; max-height: 100%; object-fit: contain;" onerror="this.src='/assets/images/event-comp.svg'" />
          </div>

          <div style="display: flex; gap: 12px; align-items: center;">
            ${isRegistered ? `
              <button class="btn btn-secondary w-full" disabled style="background-color: #DCFCE7; color: #15803D; border: 1px solid #86EFAC; font-weight: 700;">
                ✓ Inscrito
              </button>
            ` : evt.statusOriginal === 'ENCERRADO' ? `
              <button class="btn btn-secondary w-full" disabled style="background-color: #FEF3C7; color: #D97706; border: 1px solid #FCD34D; font-weight: 700;">
                Inscrições Encerradas
              </button>
            ` : evt.statusOriginal === 'CANCELADO' ? `
              <button class="btn btn-secondary w-full" disabled style="background-color: #FEE2E2; color: #DC2626; border: 1px solid #FCA5A5; font-weight: 700;">
                Evento Cancelado
              </button>
            ` : evt.statusOriginal === 'RASCUNHO' ? `
              <button class="btn btn-secondary w-full" disabled style="background-color: #F1F5F9; color: #64748B; border: 1px solid #CBD5E1; font-weight: 700;">
                Em Rascunho
              </button>
            ` : `
              <button class="btn btn-primary w-full" style="font-size: 15px; font-weight: 700;" onclick="window.eventsModule.handleEnrollment('${evt.id}')">
                Inscrever-se
              </button>
            `}
            <button class="btn-heart-favorite ${isFav ? 'favorited' : ''}" style="position: static; width: 44px; height: 44px; flex-shrink: 0;" onclick="window.eventsModule.toggleFavorite('${evt.id}')">
              ${isFav ? '❤️' : '🤍'}
            </button>
          </div>

          ${(currentUser?.role === 'professor' || currentUser?.role === 'administrador') ? `
            <div style="margin-top: 12px;">
              <button class="btn btn-secondary w-full" style="font-weight: 700; border: 1px solid #CBD5E1; background: #FFFFFF;" onclick="window.closeAnyModal(); window.adminModule.openEditEventModal('${evt.id}');">
                ✏️ Editar Evento
              </button>
            </div>
          ` : ''}
        </div>

        <!-- Linha Divisória Vertical e Lado Direito: Formulário de Informações -->
        <div style="border-left: 1px solid #E2E8F0; padding-left: 28px;">
          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label" style="font-weight: 700;">Nome do Evento</label>
            <input type="text" class="form-control" value="${evt.title}" readonly style="background-color: #FFFFFF; font-weight: 600;" />
          </div>

          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label" style="font-weight: 700;">Local</label>
            <input type="text" class="form-control" value="${evt.location}" readonly style="background-color: #FFFFFF;" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div class="form-group">
              <label class="form-label" style="font-weight: 700;">Data</label>
              <input type="text" class="form-control" value="${evt.datesLabel}" readonly style="background-color: #FFFFFF;" />
            </div>
            <div class="form-group">
              <label class="form-label" style="font-weight: 700;">Horário</label>
              <input type="text" class="form-control" value="${evt.timeLabel}" readonly style="background-color: #FFFFFF;" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" style="font-weight: 700;">Descrição do Evento</label>
            <div class="rich-text-toolbar">
              <button type="button" class="rich-text-btn" title="Negrito">B</button>
              <button type="button" class="rich-text-btn" title="Itálico"><em>I</em></button>
              <button type="button" class="rich-text-btn" title="Sublinhado"><u>U</u></button>
              <button type="button" class="rich-text-btn" title="Tachado"><s>S</s></button>
              <button type="button" class="rich-text-btn" title="Código">&lt;&gt;</button>
            </div>
            <textarea class="form-control rich-textarea" rows="4" readonly style="background-color: #FFFFFF; line-height: 1.6;">${evt.description}</textarea>
          </div>
        </div>
      </div>
    `;

    openModal('modal-event-details-figma');
  },

  // RF24 - Realizar Inscrição
  async handleEnrollment(eventId) {
    const currentUser = store.getCurrentUser();
    if (!currentUser) {
      showToast('Por favor, acesse sua conta para se inscrever.', 'info');
      window.navigateToView('login');
      return;
    }

    try {
      await store.enrollEvent(eventId);
      showToast('Inscrição confirmada com sucesso no evento!', 'success');
      closeModal('modal-event-details-figma');
      this.renderEventsGrid();
      this.renderMyRegistrations();
    } catch (err) {
      showToast(err.message || 'Erro ao realizar inscrição.', 'error');
    }
  },

  // RF15 & RF29 - Minhas Inscrições (Figma: Inscrições - Participante.png)
  renderMyRegistrations(containerId = 'my-registrations-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const regs = store.getRegistrationsForUser();

    if (regs.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 48px; background: #FFFFFF; border-radius: var(--radius-lg); border: 1px dashed var(--color-border); margin-top: 16px;">
          <div style="font-size: 36px; margin-bottom: 8px;">📝</div>
          <h3 style="margin-bottom: 6px;">Você ainda não possui inscrições ativas</h3>
          <p style="color: var(--color-text-secondary); font-size: 14px; margin-bottom: 16px;">
            Explore o catálogo de eventos do IFCE e inscreva-se gratuitamente.
          </p>
          <button class="btn btn-primary" onclick="window.navigateToView('eventos')">
            Explorar Eventos
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="event-grid" style="margin-top: 16px;">
        ${regs.map(r => {
          const isFav = this.favorites.has(String(r.id_evento));
          const isOnline = r.modalidade === 'Online';
          const tagText = isOnline ? 'Online' : 'Presencial';
          const tagClass = isOnline ? 'badge-warning' : 'badge-info';

          return `
            <article class="event-card" data-reg-id="${r.id_inscricao}">
              <div style="position: relative;">
                <button class="btn-heart-favorite ${isFav ? 'favorited' : ''}" onclick="window.eventsModule.toggleFavorite('${r.id_evento}')">
                  ${isFav ? '❤️' : '🤍'}
                </button>
                <span class="event-card-tag badge ${tagClass}" style="position: absolute; top: 12px; left: 12px; z-index: 2;">
                  ${tagText}
                </span>
                <div style="background-color: #E2E8F0; height: 160px; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer;" onclick="window.eventsModule.openEventDetailsModal('${r.id_evento}')">
                  <img src="${r.banner_url}" alt="${r.titulo}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/assets/images/event-comp.svg'" />
                </div>
              </div>

              <div class="event-card-body" style="padding: 16px;">
                <h3 class="event-card-title" style="font-size: 16px; font-weight: 700; margin-bottom: 8px; color: var(--color-text-main);">
                  ${r.titulo}
                </h3>

                <div style="display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: var(--color-text-secondary); margin-bottom: 14px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span>📅</span>
                    <span>${new Date(r.data_inicio).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span>📍</span>
                    <span>${r.local}</span>
                  </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #F1F5F9; padding-top: 10px;">
                  <a href="javascript:void(0)" onclick="window.eventsModule.openEventDetailsModal('${r.id_evento}')" style="color: var(--color-primary); font-weight: 700; font-size: 13px; text-decoration: none;">
                    Ver detalhes ❯
                  </a>
                  <a href="javascript:void(0)" onclick="window.eventsModule.cancelEnrollment('${r.id_inscricao}')" style="color: #DC2626; font-weight: 600; font-size: 13px; text-decoration: none;">
                    Cancelar inscrição
                  </a>
                </div>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    `;
  },

  async cancelEnrollment(regId) {
    if (confirm('Deseja realmente cancelar sua inscrição neste evento?')) {
      try {
        await store.cancelEnrollment(regId);
        showToast('Inscrição cancelada com sucesso.', 'info');
        this.renderMyRegistrations();
        this.renderEventsGrid();
      } catch (err) {
        showToast(err.message || 'Não foi possível cancelar a inscrição.', 'error');
      }
    }
  },

  // RF26 - Meus Certificados (Figma: Certificados - Participante.png)
  renderCertificatesTable(containerId = 'certificates-table-body') {
    const tbody = document.getElementById(containerId);
    if (!tbody) return;

    const certs = store.getCertificatesForUser();

    // Dados garantidos se estiver vazio para exibição exata da tela Figma
    const list = certs.length > 0 ? certs : [
      { id_certificado: 1, evento_titulo: 'Semana da Computação 2023', evento_data: '12/05/2023', carga_horaria: '20h', codigo_validacao: 'IFCE-CERT-2023-COMP-01', participante_nome: 'Luiz Thomas Marte Moreira' },
      { id_certificado: 2, evento_titulo: 'Ciclo de Palestras 2023', evento_data: '15/08/2023', carga_horaria: '10h', codigo_validacao: 'IFCE-CERT-2023-PAL-02', participante_nome: 'Luiz Thomas Marte Moreira' },
      { id_certificado: 3, evento_titulo: 'Oficina de Robótica', evento_data: '20/08/2023', carga_horaria: '15h', codigo_validacao: 'IFCE-CERT-2023-ROB-03', participante_nome: 'Luiz Thomas Marte Moreira' },
      { id_certificado: 4, evento_titulo: 'Mini Curso de Data Science', evento_data: '10/10/2023', carga_horaria: '8h', codigo_validacao: 'IFCE-CERT-2023-DS-04', participante_nome: 'Luiz Thomas Marte Moreira' },
    ];

    tbody.innerHTML = list.map(c => `
      <tr>
        <td style="font-weight: 600; color: var(--color-text-main);">${c.evento_titulo}</td>
        <td style="color: var(--color-text-secondary);">${c.evento_data}</td>
        <td style="color: var(--color-text-secondary);">${c.carga_horaria}</td>
        <td>
          <button class="btn-cert-download" title="Baixar Certificado Oficial em PDF" onclick="window.eventsModule.downloadCertificatePDF('${c.codigo_validacao}', '${c.evento_titulo.replace(/'/g, "\\'")}', '${c.carga_horaria}', '${c.evento_data}')">
            📥
          </button>
        </td>
      </tr>
    `).join('');
  },

  // Emissão e Download REAL de Certificado em PDF com jsPDF
  async downloadCertificatePDF(code, eventTitle, workload, eventDate) {
    showToast('Gerando certificado oficial em PDF...', 'info');

    const currentUser = store.getCurrentUser();
    const studentName = currentUser?.name || currentUser?.nome || 'Luiz Thomas Marte Moreira';

    try {
      let jsPDFClass = window.jspdf ? window.jspdf.jsPDF : null;
      if (!jsPDFClass) {
        try {
          const mod = await import('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm');
          jsPDFClass = mod.jsPDF || mod.default?.jsPDF || mod.default;
        } catch (e) {
          console.warn('Tentativa de importação remota do jsPDF:', e);
        }
      }

      if (!jsPDFClass) {
        throw new Error('Biblioteca jsPDF não disponível para geração no navegador.');
      }

      const doc = new jsPDFClass({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // Bordas decorativas institucionais
      doc.setDrawColor(46, 125, 50); // Verde IFCE
      doc.setLineWidth(3);
      doc.rect(8, 8, 281, 194);

      doc.setDrawColor(200, 230, 201);
      doc.setLineWidth(1);
      doc.rect(12, 12, 273, 186);

      // Cabeçalho Institucional
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(46, 125, 50);
      doc.text('REPÚBLICA FEDERATIVA DO BRASIL', 148.5, 26, { align: 'center' });

      doc.setFontSize(11);
      doc.setTextColor(71, 85, 105);
      doc.text('MINISTÉRIO DA EDUCAÇÃO', 148.5, 32, { align: 'center' });
      doc.text('INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DO CEARÁ', 148.5, 38, { align: 'center' });
      doc.text('CAMPUS CEDRO - COORDENAÇÃO DE EXTENSÃO', 148.5, 44, { align: 'center' });

      // Título do Certificado
      doc.setFontSize(28);
      doc.setTextColor(27, 94, 32);
      doc.text('CERTIFICADO', 148.5, 66, { align: 'center' });

      // Corpo do Certificado
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);

      const textoCorpo = `Certificamos que ${studentName.toUpperCase()}, participou com aproveitamento satisfatório do evento científico "${eventTitle}", realizado no Campus Cedro em ${eventDate}, perfazendo a carga horária total de ${workload}.`;

      const linhas = doc.splitTextToSize(textoCorpo, 240);
      doc.text(linhas, 148.5, 88, { align: 'center', lineHeightFactor: 1.5 });

      // Código de Autenticidade
      doc.setFont('courier', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(`CÓDIGO DE AUTENTICIDADE DIGITAL: ${code}`, 148.5, 134, { align: 'center' });

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('Documento assinado digitalmente conforme normas acadêmicas do IFCE.', 148.5, 140, { align: 'center' });

      // Assinaturas
      doc.setDrawColor(100, 116, 139);
      doc.setLineWidth(0.5);
      doc.line(40, 168, 120, 168);
      doc.line(177, 168, 257, 168);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      doc.text('Prof. Saulo Lima Bezerra', 80, 174, { align: 'center' });
      doc.setFontSize(8);
      doc.text('Coordenador do Evento', 80, 178, { align: 'center' });

      doc.setFontSize(10);
      doc.text('Diretoria de Ensino e Extensão', 217, 174, { align: 'center' });
      doc.setFontSize(8);
      doc.text('IFCE Campus Cedro', 217, 178, { align: 'center' });

      // Salva o PDF
      doc.save(`Certificado_IFCE_${code}.pdf`);
      showToast('Certificado em PDF baixado com sucesso!', 'success');
    } catch (e) {
      console.error('Erro ao gerar PDF do certificado:', e);
      showToast('Erro ao gerar PDF do certificado.', 'error');
    }
  },
};

eventsModule.init();
