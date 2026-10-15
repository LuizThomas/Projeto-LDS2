import React, { useState } from 'react';
import {
  Search,
  User,
  ChevronDown,
  LogOut,
  Settings,
  ShieldCheck,
  GraduationCap,
  UserCheck,
  Check,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { Usuario, PerfilUsuario } from '../../types';

interface NavbarProps {
  currentUser: Usuario;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSwitchUser: (id_usuario: number) => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  allUsers: Usuario[];
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
  onToggleCollapseDesktop?: () => void;
  isCollapsedDesktop?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  searchTerm,
  onSearchChange,
  onSwitchUser,
  onOpenProfile,
  onLogout,
  allUsers,
  onToggleMobileMenu,
  isMobileMenuOpen = false,
  onToggleCollapseDesktop,
  isCollapsedDesktop = false,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Group demo users by role for fast switching
  const demoProfiles: { label: string; role: PerfilUsuario; user: Usuario; icon: any }[] = [
    {
      label: 'Participante',
      role: 'PARTICIPANTE',
      user: allUsers.find((u) => u.perfil === 'PARTICIPANTE') || currentUser,
      icon: UserCheck,
    },
    {
      label: 'Professor / Organizador',
      role: 'PROFESSOR',
      user: allUsers.find((u) => u.perfil === 'PROFESSOR') || currentUser,
      icon: GraduationCap,
    },
    {
      label: 'Administrador',
      role: 'ADMINISTRADOR',
      user: allUsers.find((u) => u.perfil === 'ADMINISTRADOR') || currentUser,
      icon: ShieldCheck,
    },
  ];

  const getRoleLabel = (perfil: PerfilUsuario) => {
    switch (perfil) {
      case 'ADMINISTRADOR':
        return 'Administrador';
      case 'PROFESSOR':
        return 'Professor / Org.';
      case 'PARTICIPANTE':
        return 'Participante';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 transition-all">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side: Mobile Menu Button + Desktop Collapse + Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Menu Hamburger Button (visible on screens < lg) */}
          {onToggleMobileMenu && (
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 -ml-1 text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={isMobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
              title="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 stroke-[2.2]" />
              ) : (
                <Menu className="w-6 h-6 stroke-[2.2]" />
              )}
            </button>
          )}

          {/* Desktop Sidebar Toggle Button (visible on screens >= lg) */}
          {onToggleCollapseDesktop && (
            <button
              type="button"
              onClick={onToggleCollapseDesktop}
              className="hidden lg:flex p-2 -ml-1 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title={isCollapsedDesktop ? 'Expandir barra lateral' : 'Recolher barra lateral'}
              aria-label={isCollapsedDesktop ? 'Expandir barra lateral' : 'Recolher barra lateral'}
            >
              {isCollapsedDesktop ? (
                <PanelLeft className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>
          )}

          {/* Brand Logo */}
          <Logo size="md" />
        </div>

        {/* Center Search Input - Desktop */}
        <div className="flex-1 max-w-xl mx-2 hidden md:block">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Pesquisar eventos acadêmicos..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-xl border border-transparent focus:border-emerald-500 focus:outline-none transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Right User Bar */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Mobile Search Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Buscar eventos"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Quick Role Switch Pills for easy testing on wide screens */}
          <div className="hidden xl:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
            <span className="text-slate-400 px-2 text-[11px] uppercase tracking-wider font-semibold">
              Simular Perfil:
            </span>
            {demoProfiles.map(({ label, user, role }) => {
              const isActive = currentUser.id_usuario === user.id_usuario;
              return (
                <button
                  key={role}
                  onClick={() => onSwitchUser(user.id_usuario)}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-200/70'
                  }`}
                  title={`Alternar para ${user.nome} (${label})`}
                >
                  {label.split(' ')[0]}
                  {isActive && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
              );
            })}
          </div>

          {/* User Card & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 sm:gap-2.5 p-1 sm:p-1.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 focus:outline-none cursor-pointer min-h-[44px]"
            >
              {/* Avatar Circle */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-200/90 text-slate-700 flex items-center justify-center border-2 border-emerald-500/20 overflow-hidden font-bold text-xs sm:text-sm shrink-0">
                {currentUser.foto_perfil ? (
                  <img
                    src={currentUser.foto_perfil}
                    alt={currentUser.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>
                    {currentUser.nome
                      .split(' ')
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </span>
                )}
              </div>

              {/* Name and Role - Desktop only */}
              <div className="text-left hidden lg:block">
                <p className="text-sm font-semibold text-slate-800 leading-tight truncate max-w-[140px]">
                  {currentUser.nome}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {getRoleLabel(currentUser.perfil)}
                </p>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* User Menu Dropdown */}
            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setDropdownOpen(false)}
              >
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs text-slate-400 font-medium">Logado como</p>
                  <p className="text-sm font-bold text-slate-800 truncate">{currentUser.nome}</p>
                  <p className="text-xs text-emerald-600 font-medium mt-0.5 truncate">
                    {currentUser.email}
                  </p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                    {getRoleLabel(currentUser.perfil)}
                  </span>
                </div>

                {/* Role switcher inside dropdown for mobile & tablet */}
                <div className="px-4 py-2 border-b border-slate-100 xl:hidden">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Alternar Papel:
                  </p>
                  <div className="space-y-1">
                    {demoProfiles.map(({ label, user, role, icon: Icon }) => {
                      const isActive = currentUser.id_usuario === user.id_usuario;
                      return (
                        <button
                          key={role}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSwitchUser(user.id_usuario);
                            setDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer min-h-[38px] ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{label}</span>
                          </div>
                          {isActive && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Items */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      onOpenProfile();
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium transition-colors cursor-pointer min-h-[40px]"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Meu Perfil & Configurações</span>
                  </button>

                  <button
                    onClick={() => {
                      onLogout();
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 font-medium transition-colors cursor-pointer min-h-[40px]"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Sair da conta</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Mobile Search Row */}
      {mobileSearchOpen && (
        <div className="pt-2.5 pb-1 md:hidden animate-in slide-in-from-top-2 duration-150">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Pesquisar eventos acadêmicos..."
              autoFocus
              className="w-full pl-9 pr-8 py-2.5 bg-slate-100 text-xs text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-emerald-500 focus:bg-white outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
