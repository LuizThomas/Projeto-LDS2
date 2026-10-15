import React from 'react';
import {
  Calendar,
  Ticket,
  Award,
  Users,
  Menu,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';
import { PerfilUsuario } from '../../types';
import { ActiveTab } from './Sidebar';

interface MobileBottomNavProps {
  userRole: PerfilUsuario;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenMobileMenu: () => void;
  pendingUsersCount?: number;
  pendingInscriptionsCount?: number;
  pendingCertificatesCount?: number;
  onOpenCreateModal?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  userRole,
  activeTab,
  onSelectTab,
  onOpenMobileMenu,
  pendingUsersCount = 0,
  pendingInscriptionsCount = 0,
  pendingCertificatesCount = 0,
  onOpenCreateModal,
}) => {
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
            label: 'Inscrições',
            icon: Ticket,
          },
          {
            id: 'certificados' as ActiveTab,
            label: 'Certificados',
            icon: Award,
          },
        ];

      case 'PROFESSOR':
        return [
          {
            id: 'meus_eventos' as ActiveTab,
            label: 'Eventos',
            icon: Calendar,
          },
          {
            id: 'inscritos_frequencia' as ActiveTab,
            label: 'Inscrições',
            icon: Users,
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
        ];
    }
  };

  const navItems = getNavItems();
  const totalModerationBadge = pendingUsersCount + pendingInscriptionsCount + pendingCertificatesCount;

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1 safe-area-pb"
      aria-label="Navegação móvel"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer min-h-[48px] relative ${
                isActive
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-emerald-700' : 'text-slate-400'
                  }`}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 min-w-[16px] h-4 text-[10px] font-extrabold bg-amber-500 text-white rounded-full flex items-center justify-center ring-2 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-[70px]">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-0.5" />
              )}
            </button>
          );
        })}

        {/* Professor quick create event button on mobile */}
        {userRole === 'PROFESSOR' && onOpenCreateModal && (
          <button
            onClick={onOpenCreateModal}
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-emerald-700 hover:text-emerald-800 font-bold cursor-pointer min-h-[48px]"
          >
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-[70px]">
              + Evento
            </span>
          </button>
        )}

        {/* Mobile Menu Drawer Toggle Button */}
        <button
          onClick={onOpenMobileMenu}
          className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-slate-500 hover:text-slate-800 font-medium transition-all cursor-pointer min-h-[48px] relative"
          aria-label="Abrir menu completo"
        >
          <div className="relative">
            <Menu className="w-5 h-5 text-slate-500" />
            {userRole === 'PARTICIPANTE' && totalModerationBadge > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
            )}
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-[70px]">
            Menu
          </span>
        </button>
      </div>
    </nav>
  );
};
