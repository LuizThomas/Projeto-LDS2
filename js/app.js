/**
 * IFCE Iventus - Controlador Principal da Aplicação
 * Roteamento SPA e gerenciamento de layout fiel ao Figma
 */

import { store } from './store.js';
import { auth } from './auth.js';
import { eventsModule } from './events.js';
import { adminModule } from './admin.js';
import { profileModule } from './profile.js';
import {
  openModal,
  closeModal,
  closeAnyModal,
  showToast,
  toggleProfileDropdown,
  closeProfileDropdown,
  toggleMobileSidebar,
  closeMobileSidebar,
} from './ui.js';

class App {
  constructor() {
    this.currentView = 'eventos';
  }

  init() {
    console.log('🏛️ IFCE Iventus iniciado com sucesso.');

    // Assina atualizações do store
    store.subscribe((_state, currentUser) => {
      this.updateHeaderAndSidebar(currentUser);
      this.renderCurrentView();
    });

    this.bindGlobalListeners();
    this.updateHeaderAndSidebar(store.getCurrentUser());
    this.navigateToView('eventos');
  }

  navigateToView(viewName) {
    this.currentView = viewName;
    closeMobileSidebar();
    closeProfileDropdown();

    // Se estiver em telas de autenticação
    const isAuth = ['login', 'cadastro', 'recuperar-senha', 'nova-senha'].includes(viewName);
    const dashboardLayout = document.getElementById('dashboard-layout');
    const authLayout = document.getElementById('auth-layout');

    if (dashboardLayout && authLayout) {
      if (isAuth) {
        dashboardLayout.classList.add('hidden');
        authLayout.classList.remove('hidden');

        document.querySelectorAll('.auth-card-screen').forEach(card => card.classList.add('hidden'));
        const activeAuthCard = document.getElementById(`auth-${viewName}`);
        if (activeAuthCard) activeAuthCard.classList.remove('hidden');
        return;
      } else {
        dashboardLayout.classList.remove('hidden');
        authLayout.classList.add('hidden');
      }
    }

    // Atualiza links da sidebar
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.view === viewName);
    });

    // Alterna seções de conteúdo
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.toggle('hidden', sec.id !== `view-${viewName}`);
    });

    this.renderCurrentView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderCurrentView() {
    switch (this.currentView) {
      case 'eventos':
        eventsModule.renderEventsGrid('events-grid');
        break;
      case 'meus-eventos':
        adminModule.renderMyEventsTable('my-events-table-body');
        break;
      case 'minhas-inscricoes':
        eventsModule.renderMyRegistrations('my-registrations-container');
        break;
      case 'gerenciar-inscricoes':
        adminModule.renderAttendanceManagement('attendance-table-body-comp');
        break;
      case 'certificados':
        eventsModule.renderCertificatesTable('certificates-table-body');
        break;
      case 'perfil':
        profileModule.renderProfile();
        break;
    }
  }

  updateHeaderAndSidebar(currentUser) {
    if (!currentUser) return;

    const role = currentUser.role || 'participante';

    // Header Pill
    const headerAvatar = document.getElementById('header-user-avatar');
    const headerName = document.getElementById('header-user-name');
    const headerRole = document.getElementById('header-user-role-label');
    const btnCreate = document.getElementById('header-btn-create-event');

    const avatarUrl = currentUser.avatar || (role === 'professor' ? '/assets/images/avatar-prof.svg' : '/assets/images/avatar-lais.svg');

    if (headerAvatar) headerAvatar.src = avatarUrl;
    if (headerName) headerName.textContent = currentUser.name;
    if (headerRole) {
      headerRole.textContent = role === 'professor' ? 'Professor / Organizador' : role === 'administrador' ? 'Administrador' : 'Participante';
    }

    // Botão Criar Evento no Topo
    if (btnCreate) {
      btnCreate.classList.toggle('hidden', role !== 'professor' && role !== 'administrador');
    }

    // Sidebar
    const navContainer = document.getElementById('sidebar-dynamic-nav');
    if (!navContainer) return;

    if (role === 'professor') {
      navContainer.innerHTML = `
        <a class="nav-item ${this.currentView === 'meus-eventos' ? 'active' : ''}" data-view="meus-eventos">
          <span class="nav-item-icon">📅</span>
          <span>Meus Eventos</span>
        </a>
        <a class="nav-item ${this.currentView === 'gerenciar-inscricoes' ? 'active' : ''}" data-view="gerenciar-inscricoes">
          <span class="nav-item-icon">✉️</span>
          <span>Inscrições</span>
        </a>
        <a class="nav-item ${this.currentView === 'perfil' ? 'active' : ''}" data-view="perfil">
          <span class="nav-item-icon">⚙️</span>
          <span>Configurações</span>
        </a>
      `;
    } else if (role === 'administrador') {
      navContainer.innerHTML = `
        <a class="nav-item ${this.currentView === 'eventos' ? 'active' : ''}" data-view="eventos">
          <span class="nav-item-icon">📅</span>
          <span>Todos os Eventos</span>
        </a>
        <a class="nav-item ${this.currentView === 'gerenciar-inscricoes' ? 'active' : ''}" data-view="gerenciar-inscricoes">
          <span class="nav-item-icon">✉️</span>
          <span>Inscrições</span>
        </a>
        <a class="nav-item ${this.currentView === 'certificados' ? 'active' : ''}" data-view="certificados">
          <span class="nav-item-icon">🎗️</span>
          <span>Certificados</span>
        </a>
        <a class="nav-item ${this.currentView === 'perfil' ? 'active' : ''}" data-view="perfil">
          <span class="nav-item-icon">⚙️</span>
          <span>Configurações</span>
        </a>
      `;
    } else {
      // Participante (Figma: Eventos - Participante.png)
      navContainer.innerHTML = `
        <a class="nav-item ${this.currentView === 'eventos' ? 'active' : ''}" data-view="eventos">
          <span class="nav-item-icon">📅</span>
          <span>Eventos</span>
        </a>
        <a class="nav-item ${this.currentView === 'minhas-inscricoes' ? 'active' : ''}" data-view="minhas-inscricoes">
          <span class="nav-item-icon">🎟️</span>
          <span>Minhas Inscrições</span>
        </a>
        <a class="nav-item ${this.currentView === 'certificados' ? 'active' : ''}" data-view="certificados">
          <span class="nav-item-icon">🎗️</span>
          <span>Certificados</span>
        </a>
        <a class="nav-item ${this.currentView === 'perfil' ? 'active' : ''}" data-view="perfil">
          <span class="nav-item-icon">⚙️</span>
          <span>Configurações</span>
        </a>
      `;
    }

    // Associa eventos de clique nos links da sidebar
    navContainer.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', () => {
        this.navigateToView(link.dataset.view);
      });
    });
  }

  bindGlobalListeners() {
    // Menu Mobile
    const mobileBtn = document.getElementById('mobile-menu-toggle');
    if (mobileBtn) mobileBtn.addEventListener('click', toggleMobileSidebar);

    const backdrop = document.getElementById('sidebar-backdrop');
    if (backdrop) backdrop.addEventListener('click', closeMobileSidebar);

    // Dropdown de perfil
    const userProfileBtn = document.getElementById('user-profile-button');
    if (userProfileBtn) {
      userProfileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleProfileDropdown();
      });
    }

    document.addEventListener('click', () => {
      closeProfileDropdown();
    });

    // Busca com debounce
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      let timeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          eventsModule.searchQuery = e.target.value;
          if (this.currentView !== 'eventos') {
            this.navigateToView('eventos');
          } else {
            eventsModule.renderEventsGrid('events-grid');
          }
        }, 200);
      });
    }

    // Abas de Meus Eventos
    document.querySelectorAll('.my-events-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.my-events-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        adminModule.activeTab = btn.dataset.tab;
        adminModule.renderMyEventsTable('my-events-table-body');
      });
    });

    // Abas de Perfil (Dados Pessoais vs Alterar Senha)
    document.querySelectorAll('.profile-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.profile-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        const personalSec = document.getElementById('tab-content-personal');
        const passwordSec = document.getElementById('tab-content-password');
        if (personalSec && passwordSec) {
          personalSec.classList.toggle('hidden', tab !== 'personal');
          passwordSec.classList.toggle('hidden', tab !== 'password');
        }
      });
    });

    // Botão Criar Evento no Header
    const btnCreate = document.getElementById('header-btn-create-event');
    if (btnCreate) {
      btnCreate.addEventListener('click', () => {
        adminModule.openCreateEventModal();
      });
    }

    // Formulários de Perfil e Senha
    const formProfile = document.getElementById('form-personal-data');
    if (formProfile) {
      formProfile.addEventListener('submit', (e) => profileModule.handleProfileSubmit(e));
    }

    const formPassword = document.getElementById('form-change-password');
    if (formPassword) {
      formPassword.addEventListener('submit', (e) => profileModule.handlePasswordSubmit(e));
    }

    // Formulário de Login (RF02)
    const formLogin = document.getElementById('form-auth-login');
    if (formLogin) {
      formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const ident = formLogin.querySelector('[name="identifier"]').value;
        const pass = formLogin.querySelector('[name="password"]').value;
        try {
          await auth.login(ident, pass);
          this.navigateToView('eventos');
        } catch (err) {
          showToast(err.message, 'error');
        }
      });
    }

    // Formulário de Cadastro (RF01)
    const formRegister = document.getElementById('form-auth-register');
    if (formRegister) {
      formRegister.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
          await auth.register({
            name: formRegister.querySelector('[name="name"]').value.trim(),
            email: formRegister.querySelector('[name="email"]').value.trim(),
            matricula: formRegister.querySelector('[name="matricula"]')?.value.trim() || '',
            role: formRegister.querySelector('[name="role"]').value,
            password: formRegister.querySelector('[name="password"]').value,
            confirmPassword: formRegister.querySelector('[name="confirmPassword"]').value,
          });
          this.navigateToView('eventos');
        } catch (err) {
          showToast(err.message, 'error');
        }
      });
    }

    // Formulário de Recuperação (RF03)
    const formRecover = document.getElementById('form-auth-recover');
    if (formRecover) {
      formRecover.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
          await auth.recoverPassword(formRecover.querySelector('[name="email"]').value);
          this.navigateToView('nova-senha');
        } catch (err) {
          showToast(err.message, 'error');
        }
      });
    }

    // Formulário de Nova Senha
    const formReset = document.getElementById('form-auth-reset');
    if (formReset) {
      formReset.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
          await auth.resetPassword(
            formReset.querySelector('[name="new_password"]').value,
            formReset.querySelector('[name="confirm_password"]').value
          );
          this.navigateToView('login');
        } catch (err) {
          showToast(err.message, 'error');
        }
      });
    }
  }
}

const app = new App();
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});

// Exportações Globais
window.app = app;
window.navigateToView = (view) => app.navigateToView(view);
window.switchProfile = async (role) => {
  try {
    const roleName = role === 'professor' ? 'Professor / Organizador' : role === 'administrador' ? 'Administrador' : 'Participante';
    showToast(`Alternando para perfil: ${roleName}...`, 'info', 1500);
    const user = await store.switchRole(role);
    closeProfileDropdown();
    if (role === 'professor') {
      app.navigateToView('meus-eventos');
    } else {
      app.navigateToView('eventos');
    }
    showToast(`Conectado como ${user.name} (${roleName})!`, 'success');
  } catch (err) {
    showToast('Erro ao alternar perfil: ' + (err.message || err), 'error');
  }
};
window.eventsModule = eventsModule;
window.adminModule = adminModule;
window.profileModule = profileModule;
window.auth = auth;
window.store = store;
