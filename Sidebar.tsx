import React, { useEffect } from 'react';
import {
  Calendar,
  Ticket,
  Award,
  Settings,
  ShieldCheck,
  FileCheck2,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { PerfilUsuario } from '../../types';
import { Logo } from '../common/Logo';

export type ActiveTab =
  | 'eventos'
  | 'minhas_inscricoes'
  | 'certificados'
  | 'meus_eventos'
  | 'inscritos_frequencia'
  | 'moderacao_usuarios'
  | 'moderacao_inscricoes'
  | 'moderacao_certificados'
  | 'configuracoes'
  | 'validar_certificado';

interface SidebarProps {
  userRole: PerfilUsuario;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  pendingInscriptionsCount?: number;
  pendingCertificatesCount?: number;
  pendingUsersCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  isCollapsedDesktop?: boolean;
  onToggleCollapseDesktop?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  userRole,
  activeTab,
  onSelectTab,
  pendingInscriptionsCount = 0,
  pendingCertificatesCount = 0,
  pendingUsersCount = 0,
  isOpenMobile = false,
  onCloseMobile,
  isCollapsedDesktop = false,
  onToggleCollapseDesktop,
}) => {
  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpenMobile && onCloseMobile) {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpenMobile, onCloseMobile]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpenMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpenMobile]);

  // Navigation structure adapted strictly by user role
  const getNavItems = () => {
    switch (userRole) {
      case 'PARTICIPANTE':
        return [
          {
            id: 'eventos' as ActiveTab,
            label: 'Eventos',
            icon: Calendar,
          },
          {
            id: 'minhas_inscricoes' as ActiveTab,
            label: 'Minhas Inscrições',
            icon: Ticket,
          },
          {
            id: 'certificados' as ActiveTab,
            label: 'Certificados',
            icon: Award,
          },
          {
            id: 'configuracoes' as ActiveTab,
            label: 'Configurações',
            icon: Settings,
          },
        ];

      case 'PROFESSOR':
        return [
          {
            id: 'meus_eventos' as ActiveTab,
            label: 'Meus Eventos',
            icon: Calendar,
          },
          {
            id: 'inscritos_frequencia' as ActiveTab,
            label: 'Inscrições',
            icon: Users,
          },
          {
            id: 'configuracoes' as ActiveTab,
            label: 'Configurações',
            icon: Settings,
          },
        ];

      case 'ADMINISTRADOR':
        return [
          {
            id: 'meus_eventos' as ActiveTab,
            label: 'Eventos',
            icon: Calendar,
          },
          {
            id: 'moderacao_usuarios' as ActiveTab,
            label: 'Usuários',
            icon: Users,
            badge: pendingUsersCount,
          },
          {
            id: 'moderacao_inscricoes' as ActiveTab,
            label: 'Inscrições',
            icon: Ticket,
            badge: pendingInscriptionsCount,
          },
          {
            id: 'moderacao_certificados' as ActiveTab,
            label: 'Certificados',
            icon: Award,
            badge: pendingCertificatesCount,
          },
          {
            id: 'configuracoes' as ActiveTab,
            label: 'Configurações',
            icon: Settings,
          },
        ];
    }
  };

  const navItems = getNavItems();

  const handleItemClick = (tab: ActiveTab) => {
    onSelectTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop (Overlay) */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container: Off-canvas drawer on screens < lg, static or collapsible on screens >= lg */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white p-4 flex flex-col justify-between shadow-2xl transition-all duration-300 ease-in-out lg:static lg:z-auto lg:shadow-none lg:border-r lg:border-slate-200/80 lg:min-h-[calc(100vh-65px)] ${
          isCollapsedDesktop ? 'lg:w-20' : 'lg:w-64'
        } ${
          isOpenMobile
            ? 'translate-x-0 w-72 max-w-[85vw]'
            : '-translate-x-full lg:translate-x-0 w-72 max-w-[85vw]'
        }`}
      >
        <div>
          {/* Mobile Drawer Header with Close Button */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 lg:hidden">
            <Logo size="sm" />
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Fechar menu lateral"
            >
              <X className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>

          {/* Desktop Collapse Toggle in Sidebar Header */}
          {onToggleCollapseDesktop && (
            <div className="hidden lg:flex items-center justify-end pb-3 mb-2 border-b border-slate-100">
              <button
                type="button"
                onClick={onToggleCollapseDesktop}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title={isCollapsedDesktop ? 'Expandir barra lateral' : 'Recolher barra lateral'}
                aria-label={isCollapsedDesktop ? 'Expandir barra lateral' : 'Recolher barra lateral'}
              >
                {isCollapsedDesktop ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </button>
            </div>
          )}

          {/* Main Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  title={isCollapsedDesktop ? item.label : undefined}
                  className={`w-full flex items-center ${
                    isCollapsedDesktop ? 'lg:justify-center' : 'justify-between'
                  } px-3.5 py-3 lg:py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer min-h-[44px] ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 transition-colors shrink-0 ${
                        isActive ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    />
                    {!isCollapsedDesktop && <span>{item.label}</span>}
                  </div>
                  {!isCollapsedDesktop && item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {isCollapsedDesktop && item.badge !== undefined && item.badge > 0 && (
                    <span className="hidden lg:block absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Global Academic Tools */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            {!isCollapsedDesktop && (
              <p className="px-3 text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2">
                Serviços & Conformidade
              </p>
            )}
            <div className="space-y-1">
              <button
                onClick={() => handleItemClick('validar_certificado')}
                title="Validar Certificado Digital"
                className={`w-full flex items-center ${
                  isCollapsedDesktop ? 'lg:justify-center' : 'gap-3'
                } px-3.5 py-3 lg:py-2 rounded-xl text-xs font-medium transition-all cursor-pointer min-h-[44px] ${
                  activeTab === 'validar_certificado'
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <FileCheck2
                  className={`w-4 h-4 shrink-0 ${
                    activeTab === 'validar_certificado' ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                />
                {!isCollapsedDesktop && <span>Validar Certificado Digital</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Institutional Footer Badge */}
        {!isCollapsedDesktop ? (
          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100/80 text-xs text-emerald-900 mt-6">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold text-[11px] tracking-wide text-emerald-950 uppercase">
                IFCE Campus Cedro
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              Padrão oficial de autenticidade científica e acadêmica.
            </p>
          </div>
        ) : (
          <div className="hidden lg:flex justify-center p-2 text-emerald-700" title="IFCE Campus Cedro">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
        )}
      </aside>
    </>
  );
};
