import React, { useState, useEffect } from 'react';
import { store } from './services/store';
import { Usuario, Evento, Atividade, Inscricao, Certificado, PerfilUsuario } from './types';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { CatalogView } from './components/views/CatalogView';
import { MyRegistrationsView } from './components/views/MyRegistrationsView';
import { MyCertificatesView } from './components/views/MyCertificatesView';
import { ProfileView } from './components/views/ProfileView';
import { ProfessorEventsView } from './components/views/ProfessorEventsView';
import { AttendanceView } from './components/views/AttendanceView';
import { AdminUsersView } from './components/views/AdminUsersView';
import { AdminInscriptionsView } from './components/views/AdminInscriptionsView';
import { AdminCertificatesView } from './components/views/AdminCertificatesView';
import { CertificateValidatorView } from './components/views/CertificateValidatorView';
import { CreateEventModal } from './components/modals/CreateEventModal';
import { EditEventModal } from './components/modals/EditEventModal';
import { EventDetailsModal } from './components/modals/EventDetailsModal';
import { LoginView } from './components/auth/LoginView';
import { RegisterView } from './components/auth/RegisterView';
import { ForgotPasswordView } from './components/auth/ForgotPasswordView';
import { ResetPasswordView } from './components/auth/ResetPasswordView';
import { Check, AlertCircle, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Authentication & Screen Flow
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot_password' | 'reset_password'>('login');

  // Reactive Store States
  const [currentUser, setCurrentUser] = useState<Usuario>(store.getCurrentUser());
  const [allUsers, setAllUsers] = useState<Usuario[]>(store.getUsuarios());
  const [eventos, setEventos] = useState<Evento[]>(store.getEventos());
  const [atividades, setAtividades] = useState<Atividade[]>(store.getAtividades());
  const [inscricoes, setInscricoes] = useState<Inscricao[]>(store.getInscricoes());
  const [certificados, setCertificados] = useState<Certificado[]>(store.getCertificados());
  const [favoritos, setFavoritos] = useState<number[]>(store.getFavoritos());
  const [solicitacoesInscricao, setSolicitacoesInscricao] = useState(store.getSolicitacoesInscricao());
  const [solicitacoesCertificado, setSolicitacoesCertificado] = useState(store.getSolicitacoesCertificado());

  // UI State
  const [activeTab, setActiveTab] = useState<ActiveTab>('eventos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalEvento, setEditModalEvento] = useState<Evento | null>(null);
  const [detailsModalEvento, setDetailsModalEvento] = useState<Evento | null>(null);

  // Global Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync with Store changes
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCurrentUser(store.getCurrentUser());
      setAllUsers(store.getUsuarios());
      setEventos(store.getEventos());
      setAtividades(store.getAtividades());
      setInscricoes(store.getInscricoes());
      setCertificados(store.getCertificados());
      setFavoritos(store.getFavoritos());
      setSolicitacoesInscricao(store.getSolicitacoesInscricao());
      setSolicitacoesCertificado(store.getSolicitacoesCertificado());
    });
    return unsubscribe;
  }, []);

  // Update default tab when role switches
  const handleSwitchUser = (id_usuario: number) => {
    store.switchUser(id_usuario);
    const updated = store.getCurrentUser();
    setCurrentUser(updated);

    if (updated.perfil === 'PARTICIPANTE') {
      setActiveTab('eventos');
    } else if (updated.perfil === 'PROFESSOR') {
      setActiveTab('meus_eventos');
    } else if (updated.perfil === 'ADMINISTRADOR') {
      setActiveTab('meus_eventos');
    }

    showToast(`Perfil alterado para ${updated.nome} (${updated.perfil})`);
  };

  // Auth actions
  const handleLogin = (email: string) => {
    const res = store.login(email);
    if (res.success) {
      setIsAuthenticated(true);
      const user = store.getCurrentUser();
      if (user.perfil === 'PARTICIPANTE') setActiveTab('eventos');
      else setActiveTab('meus_eventos');
      return { success: true };
    }
    return res;
  };

  const handleRegister = (nome: string, email: string, perfil: PerfilUsuario) => {
    const res = store.register(nome, email, perfil);
    if (res.success) {
      setAllUsers(store.getUsuarios());
      confetti({ particleCount: 50, spread: 60 });
    }
    return res;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthView('login');
  };

  // Filtered Events by search term
  const displayedEventos = searchTerm.trim()
    ? eventos.filter(
        (e) =>
          e.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.local.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : eventos;

  // Participant Inscription Check
  const participantInscriptions = inscricoes.filter(
    (i) => i.id_usuario === currentUser.id_usuario && i.status === 'CONFIRMADA'
  );
  const participantSubscribedEventIds = participantInscriptions
    .map((i) => i.evento_id)
    .filter((id): id is number => typeof id === 'number');

  // Inscribe
  const handleInscrever = (id_evento: number) => {
    const res = store.inscrever(id_evento, currentUser.id_usuario);
    if (res.success) {
      showToast(res.message, 'success');
      confetti({ particleCount: 50, spread: 60 });
    } else {
      showToast(res.message, 'error');
    }
  };

  // Cancel Inscription
  const handleCancelarInscricao = (id_inscricao: number) => {
    store.cancelarInscricao(id_inscricao);
    showToast('Inscrição cancelada com sucesso.');
    if (detailsModalEvento) {
      setDetailsModalEvento(null);
    }
  };

  // If not authenticated, render the respective auth view
  if (!isAuthenticated) {
    if (authView === 'register') {
      return (
        <RegisterView
          onRegister={handleRegister}
          onGoToLogin={() => setAuthView('login')}
        />
      );
    }
    if (authView === 'forgot_password') {
      return (
        <ForgotPasswordView
          onGoToLogin={() => setAuthView('login')}
          onGoToResetPassword={() => setAuthView('reset_password')}
        />
      );
    }
    if (authView === 'reset_password') {
      return (
        <ResetPasswordView onGoToLogin={() => setAuthView('login')} />
      );
    }

    return (
      <LoginView
        onLogin={handleLogin}
        onGoToRegister={() => setAuthView('register')}
        onGoToForgotPassword={() => setAuthView('forgot_password')}
        onQuickDemoLogin={(email) => {
          handleLogin(email);
        }}
      />
    );
  }

  // Count pending moderation badges
  const pendingUsersCount = allUsers.filter((u) => u.status_conta === 'PENDENTE').length;
  const pendingInscriptionsCount = solicitacoesInscricao.filter((s) => s.status_moderacao === 'PENDENTE').length;
  const pendingCertificatesCount = solicitacoesCertificado.filter((s) => s.status_moderacao === 'PENDENTE').length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-3 duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2.5 border ${
              toast.type === 'success'
                ? 'bg-emerald-800 text-white border-emerald-700'
                : 'bg-red-700 text-white border-red-600'
            }`}
          >
            {toast.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-300 stroke-[3]" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Top Header Navbar */}
      <Navbar
        currentUser={currentUser}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSwitchUser={handleSwitchUser}
        onOpenProfile={() => setActiveTab('configuracoes')}
        onLogout={handleLogout}
        allUsers={allUsers}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleCollapseDesktop={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isCollapsedDesktop={isSidebarCollapsed}
      />

      {/* Body: Sidebar + Main Content Layout */}
      <div className="flex-1 flex overflow-x-hidden relative">
        {/* Sidebar Navigation (collapsible drawer on mobile, static or collapsible on desktop) */}
        <Sidebar
          userRole={currentUser.perfil}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingUsersCount={pendingUsersCount}
          pendingInscriptionsCount={pendingInscriptionsCount}
          pendingCertificatesCount={pendingCertificatesCount}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          isCollapsedDesktop={isSidebarCollapsed}
          onToggleCollapseDesktop={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main Content Area: Responsive padding and min-w-0 prevents mobile overflow */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto max-w-7xl mx-auto w-full min-w-0">
          {/* TAB: EVENTOS (Catálogo do Participante) */}
          {activeTab === 'eventos' && (
            <CatalogView
              eventos={displayedEventos}
              favoritos={favoritos}
              onToggleFavorito={(id) => store.toggleFavorito(id)}
              onOpenDetails={(evento) => setDetailsModalEvento(evento)}
              onQuickInscrever={handleInscrever}
              inscricoesIds={participantSubscribedEventIds}
            />
          )}

          {/* TAB: MINHAS INSCRIÇÕES (Participante) */}
          {activeTab === 'minhas_inscricoes' && (
            <MyRegistrationsView
              inscricoes={participantInscriptions}
              eventos={eventos}
              favoritos={favoritos}
              onToggleFavorito={(id) => store.toggleFavorito(id)}
              onOpenDetails={(evento) => setDetailsModalEvento(evento)}
              onCancelarInscricao={handleCancelarInscricao}
            />
          )}

          {/* TAB: CERTIFICADOS (Participante) */}
          {activeTab === 'certificados' && (
            <MyCertificatesView
              certificados={certificados.filter(
                (c) => c.participante_nome === currentUser.nome || c.id_certificado <= 4
              )}
            />
          )}

          {/* TAB: MEUS EVENTOS (Professor & Admin) */}
          {activeTab === 'meus_eventos' && (
            <ProfessorEventsView
              eventos={displayedEventos}
              onOpenCreateModal={() => setCreateModalOpen(true)}
              onOpenEditModal={(evento) => setEditModalEvento(evento)}
              onOpenDetailsModal={(evento) => setDetailsModalEvento(evento)}
            />
          )}

          {/* TAB: INSCRIÇÕES & FREQUÊNCIA (Professor) */}
          {activeTab === 'inscritos_frequencia' && (
            <AttendanceView
              inscricoes={inscricoes}
              eventos={eventos}
              onTogglePresenca={(id) => store.togglePresenca(id)}
              isPresente={(id) => store.isPresente(id)}
              onEmitirCertificado={(nome, mat, evt) => {
                store.emitirCertificado(nome, mat, evt);
              }}
            />
          )}

          {/* TAB: MODERAÇÃO DE USUÁRIOS (Administrador) */}
          {activeTab === 'moderacao_usuarios' && (
            <AdminUsersView
              usuarios={allUsers}
              onModerar={(id, decisao) => {
                store.moderarUsuario(id, decisao);
                setAllUsers(store.getUsuarios());
                showToast(
                  decisao === 'APROVAR'
                    ? 'Usuário aprovado com sucesso!'
                    : 'Cadastro recusado com sucesso.'
                );
              }}
            />
          )}

          {/* TAB: MODERAÇÃO DE INSCRIÇÕES (Administrador) */}
          {activeTab === 'moderacao_inscricoes' && (
            <AdminInscriptionsView
              solicitacoes={solicitacoesInscricao}
              onModerar={(id, decisao) => store.moderarInscricao(id, decisao)}
            />
          )}

          {/* TAB: MODERAÇÃO DE CERTIFICADOS (Administrador) */}
          {activeTab === 'moderacao_certificados' && (
            <AdminCertificatesView
              solicitacoes={solicitacoesCertificado}
              onModerar={(id, decisao) => store.moderarCertificado(id, decisao)}
            />
          )}

          {/* TAB: CONFIGURAÇÕES / MEU PERFIL */}
          {activeTab === 'configuracoes' && (
            <div className="space-y-8">
              <ProfileView
                currentUser={currentUser}
                onUpdateProfile={(updates) => {
                  store.updateProfile(currentUser.id_usuario, updates);
                  showToast('Perfil atualizado com sucesso!');
                }}
              />

              {/* Development & Testing Reset Section */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-4xl shadow-xs">
                <h4 className="text-sm font-bold text-slate-800 mb-1">
                  Ambiente de Testes do IFCE Iventus
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  Restaure os dados originais (usuários, eventos pré-cadastrados, turmas e certificados) para os valores padrão da demonstração.
                </p>
                <button
                  onClick={() => {
                    store.resetToDefaults();
                    showToast('Base de demonstração restaurada!');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar dados padrão</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: VALIDADOR PÚBLICO DE CERTIFICADOS */}
          {activeTab === 'validar_certificado' && (
            <CertificateValidatorView
              onValidate={(cod) => store.validarCertificado(cod)}
              certificados={certificados}
            />
          )}
        </main>
      </div>

      {/* Modal: Criando Evento */}
      <CreateEventModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={(novo) => {
          store.createEvento(novo);
          showToast('Evento criado com sucesso!');
          confetti({ particleCount: 50, spread: 60 });
        }}
        organizadorId={currentUser.id_usuario}
      />

      {/* Modal: Editando Evento */}
      <EditEventModal
        evento={editModalEvento}
        isOpen={Boolean(editModalEvento)}
        onClose={() => setEditModalEvento(null)}
        onSave={(id, updates) => {
          store.updateEvento(id, updates);
          showToast('Alterações salvas no evento!');
        }}
      />

      {/* Modal: Visualizando Detalhes do Evento */}
      <EventDetailsModal
        evento={detailsModalEvento}
        isOpen={Boolean(detailsModalEvento)}
        onClose={() => setDetailsModalEvento(null)}
        userRole={currentUser.perfil}
        isInscrito={
          detailsModalEvento
            ? participantSubscribedEventIds.includes(detailsModalEvento.id_evento)
            : false
        }
        isFavorito={
          detailsModalEvento ? favoritos.includes(detailsModalEvento.id_evento) : false
        }
        onToggleFavorito={(id) => store.toggleFavorito(id)}
        onInscrever={(id) => {
          handleInscrever(id);
          setDetailsModalEvento(null);
        }}
        onCancelarInscricao={() => {
          if (detailsModalEvento) {
            const insc = participantInscriptions.find(
              (i) => i.evento_id === detailsModalEvento.id_evento
            );
            if (insc) handleCancelarInscricao(insc.id_inscricao);
          }
        }}
        atividades={atividades}
      />

      {/* Mobile Bottom Navigation Bar: One-touch quick navigation */}
      <MobileBottomNav
        userRole={currentUser.perfil}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        pendingUsersCount={pendingUsersCount}
        pendingInscriptionsCount={pendingInscriptionsCount}
        pendingCertificatesCount={pendingCertificatesCount}
        onOpenCreateModal={() => setCreateModalOpen(true)}
      />
    </div>
  );
}
