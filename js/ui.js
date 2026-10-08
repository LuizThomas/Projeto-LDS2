/**
 * IFCE Iventus - Utilitários de Interface do Usuário (UI)
 * Modais, Toasts, Dropdowns, Menu Mobile e Visualizadores
 */

import { store } from './store.js';

export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    // Se não houver outros modais abertos, restaura o scroll
    if (!document.querySelector('.modal-overlay.open')) {
      document.body.style.overflow = '';
    }
  }
}

export function closeAnyModal() {
  document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  document.body.style.overflow = '';
}

// Fecha modal com a tecla ESC ou clicando fora do card
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAnyModal();
    closeProfileDropdown();
    closeMobileSidebar();
  }
});

document.addEventListener('click', (e) => {
  if (e.target.classList && e.target.classList.contains('modal-overlay')) {
    closeAnyModal();
  }
});

// --------------------------------------------------------------------------
// Toasts
// --------------------------------------------------------------------------
export function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';

  toast.innerHTML = `
    <span style="font-size: 16px;">${icon}</span>
    <span style="flex: 1; color: var(--color-text-main); font-weight: 500;">${message}</span>
    <button style="color: var(--color-text-muted); padding: 4px;" aria-label="Fechar">&times;</button>
  `;

  toast.querySelector('button').addEventListener('click', () => {
    toast.remove();
  });

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 250ms ease';
      setTimeout(() => toast.remove(), 250);
    }
  }, duration);
}

// --------------------------------------------------------------------------
// Dropdown de Perfil
// --------------------------------------------------------------------------
export function toggleProfileDropdown() {
  const menu = document.getElementById('profile-dropdown-menu');
  if (menu) {
    menu.classList.toggle('open');
  }
}

export function closeProfileDropdown() {
  const menu = document.getElementById('profile-dropdown-menu');
  if (menu) {
    menu.classList.remove('open');
  }
}

// --------------------------------------------------------------------------
// Menu Mobile (Sidebar Drawer)
// --------------------------------------------------------------------------
export function toggleMobileSidebar() {
  const sidebar = document.querySelector('.app-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (sidebar) {
    sidebar.classList.toggle('open');
  }
  if (backdrop) {
    backdrop.classList.toggle('visible');
  }
}

export function closeMobileSidebar() {
  const sidebar = document.querySelector('.app-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (sidebar) {
    sidebar.classList.remove('open');
  }
  if (backdrop) {
    backdrop.classList.remove('visible');
  }
}

// --------------------------------------------------------------------------
// Visualizador de Certificado Acadêmico Oficial IFCE
// --------------------------------------------------------------------------
export function showCertificateViewer(eventId, recipientId) {
  const certs = store.getAllCertificates();
  let cert = certs.find(c => c.eventId === eventId && c.recipientId === recipientId);

  // Se ainda não existir registro no array, gera dinamicamente para pré-visualização
  if (!cert) {
    const event = store.getEventById(eventId) || {
      title: 'Semana da Computação 2024',
      workload: '40 horas'
    };
    const user = store.state.users.find(u => u.id === recipientId) || store.getCurrentUser();

    cert = {
      eventTitle: event.title,
      recipientName: user ? user.name : 'Lais Holanda',
      recipientMatricula: user ? user.matricula : '2022104508',
      workload: event.workload,
      issueDate: new Date().toLocaleDateString('pt-BR'),
      validationCode: `IFCE-CERT-2024-${Math.floor(1000 + Math.random() * 9000)}-X`,
      signedBy: 'Prof. Roberto Alves / Coordenação Geral IFCE'
    };
  }

  const modalBody = document.getElementById('certificate-modal-body');
  if (modalBody) {
    modalBody.innerHTML = `
      <div class="certificate-frame">
        <img src="/assets/images/certificate-seal.svg" alt="Selo Oficial IFCE" class="certificate-header-seal" />
        <div class="certificate-institution">
          Instituto Federal de Educação, Ciência e Tecnologia do Ceará
        </div>
        <div style="font-size: 11px; color: #64748B; letter-spacing: 0.5px; margin-top: 2px;">
          PRÓ-REITORIA DE EXTENSÃO • DIRETORIA DE RELAÇÕES COMUNITÁRIAS
        </div>

        <h1 class="certificate-main-title">CERTIFICADO</h1>

        <p class="certificate-text-body">
          Certificamos que <strong class="certificate-recipient-name">${cert.recipientName}</strong>,
          matrícula nº <strong>${cert.recipientMatricula}</strong>, participou com êxito do evento acadêmico
          <strong>"${cert.eventTitle}"</strong>, promovido pelo Instituto Federal do Ceará,
          cumprindo carga horária total de <strong>${cert.workload}</strong> de atividades formativas.
        </p>

        <div style="font-size: 13px; color: #475569; margin: 16px 0;">
          Fortaleza - CE, emitido em ${cert.issueDate}.
        </div>

        <div class="certificate-signatures">
          <div class="signature-line">
            <div style="font-family: 'Brush Script MT', cursive, sans-serif; font-size: 20px; color: #1B5E20; height: 28px;">
              Prof. Roberto Alves
            </div>
            <strong>Coordenador Geral do Evento</strong><br>
            IFCE - Campus Fortaleza
          </div>

          <div class="signature-line">
            <div style="font-family: 'Brush Script MT', cursive, sans-serif; font-size: 20px; color: #1B5E20; height: 28px;">
              Carlos Menezes
            </div>
            <strong>Pró-Reitor de Extensão</strong><br>
            Reitoria IFCE
          </div>
        </div>

        <div class="certificate-validation-code">
          Código de Autenticidade Digital: <strong>${cert.validationCode}</strong><br>
          Valide a veracidade deste documento em: ifce.edu.br/autenticidade
        </div>
      </div>
    `;
  }

  const modalFooter = document.getElementById('certificate-modal-footer');
  if (modalFooter) {
    modalFooter.innerHTML = `
      <button class="btn btn-secondary" onclick="window.closeAnyModal()">Fechar</button>
      <button class="btn btn-primary" onclick="window.mockDownloadCertificate('${cert.validationCode}')">
        📥 Baixar Certificado em PDF
      </button>
    `;
  }

  openModal('modal-certificate-viewer');
}

// --------------------------------------------------------------------------
// Modal de Comprovante de Inscrição com QR Code
// --------------------------------------------------------------------------
export function showTicketModal(eventId) {
  const currentUser = store.getCurrentUser();
  const evt = store.getEventById(eventId);
  if (!evt || !currentUser) return;

  const reg = store.getRegistrationsForUser(currentUser.id).find(r => r.eventId === eventId) || {
    ticketCode: `IFCE-${evt.id.toUpperCase()}-78901`,
    registrationDate: new Date().toLocaleDateString('pt-BR')
  };

  const modalBody = document.getElementById('ticket-modal-body');
  if (modalBody) {
    modalBody.innerHTML = `
      <div class="ticket-container">
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 8px;">
          <img src="/assets/images/logo-icon.svg" width="32" height="32" alt="Logo IFCE" />
          <strong style="font-size: 16px; color: var(--color-primary);">IFCE Iventus</strong>
        </div>
        <div style="font-size: 12px; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.5px;">
          Comprovante Oficial de Inscrição
        </div>

        <h3 style="font-size: 18px; margin: 12px 0 6px;">${evt.title}</h3>
        <p style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 12px;">
          📍 ${evt.location}<br>
          📅 ${evt.datesLabel} • 🕒 ${evt.timeLabel}
        </p>

        <!-- SVG Simulado de QR Code de Alta Resolução -->
        <svg class="ticket-qrcode-svg" viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#FFFFFF"/>
          <!-- Top Left Finder Pattern -->
          <rect x="10" y="10" width="24" height="24" fill="#1B5E20" rx="3"/>
          <rect x="14" y="14" width="16" height="16" fill="#FFFFFF" rx="2"/>
          <rect x="18" y="18" width="8" height="8" fill="#1B5E20" rx="1"/>

          <!-- Top Right Finder Pattern -->
          <rect x="66" y="10" width="24" height="24" fill="#1B5E20" rx="3"/>
          <rect x="70" y="14" width="16" height="16" fill="#FFFFFF" rx="2"/>
          <rect x="74" y="18" width="8" height="8" fill="#1B5E20" rx="1"/>

          <!-- Bottom Left Finder Pattern -->
          <rect x="10" y="66" width="24" height="24" fill="#1B5E20" rx="3"/>
          <rect x="14" y="70" width="16" height="16" fill="#FFFFFF" rx="2"/>
          <rect x="18" y="74" width="8" height="8" fill="#1B5E20" rx="1"/>

          <!-- Data Dots / Matrix simulation -->
          <rect x="40" y="12" width="6" height="6" fill="#1B5E20"/>
          <rect x="52" y="12" width="6" height="6" fill="#1B5E20"/>
          <rect x="44" y="24" width="6" height="6" fill="#1B5E20"/>
          <rect x="54" y="28" width="6" height="6" fill="#1B5E20"/>
          <rect x="12" y="44" width="6" height="6" fill="#1B5E20"/>
          <rect x="24" y="48" width="6" height="6" fill="#1B5E20"/>
          <rect x="38" y="40" width="8" height="8" fill="#E53935" rx="2"/>
          <rect x="52" y="44" width="6" height="6" fill="#1B5E20"/>
          <rect x="68" y="44" width="6" height="6" fill="#1B5E20"/>
          <rect x="80" y="48" width="6" height="6" fill="#1B5E20"/>
          <rect x="40" y="60" width="6" height="6" fill="#1B5E20"/>
          <rect x="54" y="66" width="6" height="6" fill="#1B5E20"/>
          <rect x="66" y="74" width="6" height="6" fill="#1B5E20"/>
          <rect x="78" y="80" width="6" height="6" fill="#1B5E20"/>
          <rect x="44" y="80" width="6" height="6" fill="#1B5E20"/>
        </svg>

        <div class="ticket-code">${reg.ticketCode}</div>

        <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 12px; border-top: 1px solid var(--color-border); padding-top: 12px;">
          Participante: <strong>${currentUser.name}</strong><br>
          Matrícula: <strong>${currentUser.matricula}</strong>
        </div>
      </div>
    `;
  }

  openModal('modal-ticket-viewer');
}

export function mockDownloadCertificate(validationCode) {
  showToast('Iniciando download do certificado oficial em PDF...', 'info');
  setTimeout(() => {
    showToast(`Certificado ${validationCode} baixado com sucesso!`, 'success');
  }, 1200);
}

// Exporta para window para acesso pelos handlers inline do HTML
window.closeAnyModal = closeAnyModal;
window.showCertificateViewer = showCertificateViewer;
window.showTicketModal = showTicketModal;
window.mockDownloadCertificate = mockDownloadCertificate;
