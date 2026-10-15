import React, { useState } from 'react';
import { Usuario, PerfilUsuario, StatusConta } from '../../types';
import {
  Users,
  Clock,
  Check,
  X,
  ShieldCheck,
  GraduationCap,
  User,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

interface AdminUsersViewProps {
  usuarios: Usuario[];
  onModerar: (id_usuario: number, decisao: 'APROVAR' | 'RECUSAR') => void;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({ usuarios, onModerar }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'TODOS' | 'PENDENTE' | 'ATIVO' | 'RECUSADO'>('PENDENTE');
  const [roleFilter, setRoleFilter] = useState<string>('TODOS');
  const [feedback, setFeedback] = useState<{ id: number; message: string; type: 'success' | 'danger' } | null>(null);

  const handleAction = (id: number, decisao: 'APROVAR' | 'RECUSAR', nome: string) => {
    onModerar(id, decisao);
    setFeedback({
      id,
      message: decisao === 'APROVAR' ? `Usuário "${nome}" foi aprovado com sucesso!` : `Cadastro de "${nome}" foi recusado.`,
      type: decisao === 'APROVAR' ? 'success' : 'danger',
    });
    setTimeout(() => setFeedback(null), 3000);
  };

  // Counts
  const pendingCount = usuarios.filter((u) => u.status_conta === 'PENDENTE').length;
  const activeCount = usuarios.filter((u) => u.status_conta === 'ATIVO' || !u.status_conta).length;
  const rejectedCount = usuarios.filter((u) => u.status_conta === 'RECUSADO').length;
  const totalCount = usuarios.length;

  // Filtered users
  const filteredUsers = usuarios.filter((u) => {
    const currentStatus = u.status_conta || 'ATIVO';

    // Status filter
    if (statusFilter !== 'TODOS' && currentStatus !== statusFilter) {
      return false;
    }

    // Role filter
    if (roleFilter !== 'TODOS' && u.perfil !== roleFilter) {
      return false;
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = u.nome.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchMatricula = u.matricula ? u.matricula.toLowerCase().includes(q) : false;
      return matchName || matchEmail || matchMatricula;
    }

    return true;
  });

  const getRoleBadge = (perfil: PerfilUsuario) => {
    switch (perfil) {
      case 'ADMINISTRADOR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            Administrador
          </span>
        );
      case 'PROFESSOR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            Professor / Org.
          </span>
        );
      case 'PARTICIPANTE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            Participante
          </span>
        );
    }
  };

  const getStatusBadge = (status?: StatusConta) => {
    const st = status || 'ATIVO';
    switch (st) {
      case 'PENDENTE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pendente
          </span>
        );
      case 'ATIVO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            Ativo
          </span>
        );
      case 'RECUSADO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
            Recusado
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Aprovação e Gestão de Usuários
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
            Moderação institucional de novos cadastros e governança de acessos no IFCE Iventus.
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold self-start sm:self-auto">
            <Clock className="w-4 h-4 text-amber-600 animate-spin shrink-0" style={{ animationDuration: '4s' }} />
            <span>{pendingCount} aguardando aprovação</span>
          </div>
        )}
      </div>

      {/* KPI Stats Cards - 2x2 on mobile, 4 columns on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Pending Card */}
        <div
          onClick={() => setStatusFilter('PENDENTE')}
          className={`p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'PENDENTE'
              ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-300 shadow-xs'
              : 'bg-white border-slate-200/90 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pendentes
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-700 mt-1 sm:mt-2">{pendingCount}</p>
          <p className="text-[10px] sm:text-[11px] text-amber-800/80 mt-0.5 truncate">Aguardando moderação</p>
        </div>

        {/* Active Card */}
        <div
          onClick={() => setStatusFilter('ATIVO')}
          className={`p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'ATIVO'
              ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-300 shadow-xs'
              : 'bg-white border-slate-200/90 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ativos
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-1 sm:mt-2">{activeCount}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">Contas homologadas</p>
        </div>

        {/* Rejected Card */}
        <div
          onClick={() => setStatusFilter('RECUSADO')}
          className={`p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'RECUSADO'
              ? 'bg-red-50/70 border-red-300 ring-2 ring-red-300 shadow-xs'
              : 'bg-white border-slate-200/90 hover:border-red-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Recusados
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-700">
              <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-red-700 mt-1 sm:mt-2">{rejectedCount}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">Cadastros negados</p>
        </div>

        {/* Total Users Card */}
        <div
          onClick={() => setStatusFilter('TODOS')}
          className={`p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'TODOS'
              ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-400 shadow-xs'
              : 'bg-white border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-800 mt-1 sm:mt-2">{totalCount}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">Base completa</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-2.5 justify-between items-stretch md:items-center">
          {/* Status Tabs with smooth scroll */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto -mx-1 px-1">
            <button
              onClick={() => setStatusFilter('PENDENTE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 min-h-[34px] ${
                statusFilter === 'PENDENTE'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Pendentes</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 bg-white/25 rounded-full text-[10px]">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setStatusFilter('TODOS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap min-h-[34px] ${
                statusFilter === 'TODOS'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({totalCount})
            </button>

            <button
              onClick={() => setStatusFilter('ATIVO')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap min-h-[34px] ${
                statusFilter === 'ATIVO'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ativos ({activeCount})
            </button>

            <button
              onClick={() => setStatusFilter('RECUSADO')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap min-h-[34px] ${
                statusFilter === 'RECUSADO'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Recusados ({rejectedCount})
            </button>
          </div>

          {/* Search + Role Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar usuário..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-600 text-slate-800 placeholder-slate-400"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-emerald-600 font-medium text-slate-700 cursor-pointer min-h-[36px]"
            >
              <option value="TODOS">Todos os perfis</option>
              <option value="PARTICIPANTE">Participantes</option>
              <option value="PROFESSOR">Professores</option>
              <option value="ADMINISTRADOR">Administradores</option>
            </select>
          </div>
        </div>
      </div>

      {/* Temporary feedback banner */}
      {feedback && (
        <div
          className={`p-3 rounded-xl text-xs font-bold border flex items-center justify-between transition-all animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        </div>
      )}

      {/* Users List Container */}
      <div className="space-y-3">
        {/* Mobile View: Responsive Cards for screens < sm */}
        <div className="sm:hidden space-y-3">
          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400">
              <Users className="w-8 h-8 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
              <p className="font-semibold text-slate-600 text-xs">Nenhum usuário encontrado</p>
            </div>
          ) : (
            filteredUsers.map((user) => {
              const status = user.status_conta || 'ATIVO';
              const initials = user.nome
                .split(' ')
                .map((n) => n[0])
                .filter(Boolean)
                .slice(0, 2)
                .join('')
                .toUpperCase();

              return (
                <div
                  key={`m-user-${user.id_usuario}`}
                  className={`bg-white rounded-2xl border p-3.5 space-y-3 shadow-xs ${
                    status === 'PENDENTE' ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-linear-to-br from-emerald-600 to-teal-800 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-sm truncate">{user.nome}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    {getStatusBadge(user.status_conta)}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <div>{getRoleBadge(user.perfil)}</div>
                    <span className="text-slate-400 text-[11px]">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  {/* Actions for Mobile */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                    {status === 'PENDENTE' ? (
                      <div className="grid grid-cols-2 gap-2 w-full">
                        <button
                          type="button"
                          onClick={() => handleAction(user.id_usuario, 'APROVAR', user.nome)}
                          className="w-full py-2 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[42px]"
                        >
                          <Check className="w-4 h-4 stroke-[2.5]" />
                          <span>Aprovar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction(user.id_usuario, 'RECUSAR', user.nome)}
                          className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[42px]"
                        >
                          <X className="w-4 h-4 stroke-[2.5]" />
                          <span>Recusar</span>
                        </button>
                      </div>
                    ) : status === 'RECUSADO' ? (
                      <button
                        type="button"
                        onClick={() => handleAction(user.id_usuario, 'APROVAR', user.nome)}
                        className="w-full justify-center py-2 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer min-h-[40px]"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reavaliar / Aprovar</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAction(user.id_usuario, 'RECUSAR', user.nome)}
                        className="py-1.5 px-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl text-xs font-medium transition-all cursor-pointer min-h-[36px]"
                      >
                        Suspender acesso
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View: Table for screens >= sm */}
        <div className="hidden sm:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-xs font-semibold text-slate-500">
                <tr>
                  <th className="px-6 py-4">Usuário</th>
                  <th className="px-6 py-4">Perfil Solicitado</th>
                  <th className="px-6 py-4">Cadastro</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-xs text-slate-400">
                      Nenhum usuário encontrado para os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const status = user.status_conta || 'ATIVO';
                    const initials = user.nome
                      .split(' ')
                      .map((n) => n[0])
                      .filter(Boolean)
                      .slice(0, 2)
                      .join('')
                      .toUpperCase();

                    return (
                      <tr
                        key={`dt-user-${user.id_usuario}`}
                        className={`hover:bg-slate-50/60 transition-colors ${
                          status === 'PENDENTE' ? 'bg-amber-50/25' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-linear-to-br from-emerald-600 to-teal-800 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                              {initials}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{user.nome}</p>
                              <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">{getRoleBadge(user.perfil)}</td>

                        <td className="px-6 py-4 text-xs font-medium text-slate-500">
                          {new Date(user.created_at).toLocaleDateString('pt-BR')}
                        </td>

                        <td className="px-6 py-4 text-center">{getStatusBadge(user.status_conta)}</td>

                        <td className="px-6 py-4 text-center">
                          {status === 'PENDENTE' ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleAction(user.id_usuario, 'APROVAR', user.nome)}
                                className="px-3 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 transition-all cursor-pointer"
                                title="Aprovar cadastro"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Aprovar</span>
                              </button>
                              <button
                                onClick={() => handleAction(user.id_usuario, 'RECUSAR', user.nome)}
                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                                title="Recusar cadastro"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Recusar</span>
                              </button>
                            </div>
                          ) : status === 'RECUSADO' ? (
                            <button
                              onClick={() => handleAction(user.id_usuario, 'APROVAR', user.nome)}
                              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                            >
                              Reverter e aprovar
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAction(user.id_usuario, 'RECUSAR', user.nome)}
                              className="text-xs text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              Suspender
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
