import React, { useState } from 'react';
import { PerfilUsuario } from '../../types';
import { Logo } from '../common/Logo';
import { Clock, CheckCircle2, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

interface RegisterViewProps {
  onRegister: (nome: string, email: string, perfil: PerfilUsuario) => { success: boolean; message?: string };
  onGoToLogin: () => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onRegister, onGoToLogin }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [perfil, setPerfil] = useState<PerfilUsuario>('PARTICIPANTE');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Success state: Waiting for administrator confirmation
  const [submittedUser, setSubmittedUser] = useState<{
    nome: string;
    email: string;
    perfil: PerfilUsuario;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!termosAceitos) {
      setError('Você deve concordar com os Termos de Uso e Política de Privacidade.');
      return;
    }

    if (senha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      setError('A confirmação de senha não corresponde.');
      return;
    }

    const res = onRegister(nome.trim(), email.trim(), perfil);
    if (!res.success) {
      setError(res.message || 'Erro ao realizar cadastro.');
    } else {
      setSubmittedUser({
        nome: nome.trim(),
        email: email.trim(),
        perfil,
      });
    }
  };

  // Screen when registration was submitted and awaits administrator confirmation
  if (submittedUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-10 text-center animate-in fade-in zoom-in-95 duration-200">
          {/* Institutional Icon */}
          <div className="mx-auto w-16 h-16 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center mb-6">
            <Clock className="w-8 h-8 text-amber-600 animate-pulse" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-3 uppercase tracking-wider">
            Aguardando Homologação
          </span>

          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
            Cadastro Realizado com Sucesso!
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto mb-6">
            Sua solicitação de conta foi registrada no sistema do <strong>IFCE Iventus</strong>. 
            Por normas institucionais, novas contas precisam ser confirmadas por um <strong>Administrador</strong> antes de liberar o acesso.
          </p>

          {/* Registration Details Summary Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-left text-xs space-y-2.5 mb-6">
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Nome Completo:</span>
              <span className="font-bold text-slate-800">{submittedUser.nome}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">E-mail:</span>
              <span className="font-bold text-slate-800">{submittedUser.email}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Perfil Solicitado:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {submittedUser.perfil === 'PARTICIPANTE'
                  ? 'Participante'
                  : submittedUser.perfil === 'PROFESSOR'
                  ? 'Professor / Organizador'
                  : 'Administrador'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 font-medium">Status Atual:</span>
              <span className="font-bold text-amber-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block animate-ping" />
                Pendente de aprovação
              </span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-800 text-left mb-6">
            <p className="font-semibold mb-0.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              O que acontece agora?
            </p>
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              O Administrador do campus receberá seu pedido no painel de moderação. Assim que aprovado, você poderá fazer login imediatamente com seu e-mail e senha.
            </p>
          </div>

          <button
            type="button"
            onClick={onGoToLogin}
            className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Ir para a Tela de Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-10">
        <div className="flex items-center gap-3 mb-4">
          <Logo size="md" showText={false} />
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
              Criar sua conta
            </h2>
            <p className="text-xs text-slate-500">
              Cadastro oficial no Sistema IFCE Iventus
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome completo */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nome completo
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: João da Silva Santos"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm text-slate-800 outline-none transition-all shadow-2xs font-medium"
              required
            />
          </div>

          {/* E-mail */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              E-mail institucional ou pessoal
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@gmail.com ou aluno@ifce.edu.br"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm text-slate-800 outline-none transition-all shadow-2xs font-medium"
              required
            />
          </div>

          {/* Perfil */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Perfil de Acesso
            </label>
            <select
              value={perfil}
              onChange={(e) => setPerfil(e.target.value as PerfilUsuario)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm text-slate-800 outline-none transition-all shadow-2xs font-medium bg-white"
            >
              <option value="PARTICIPANTE">Participante / Aluno</option>
              <option value="PROFESSOR">Professor / Organizador</option>
              <option value="ADMINISTRADOR">Administrador</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              * Todos os cadastros passam por moderação prévia do Administrador antes da liberação do acesso.
            </p>
          </div>

          {/* Senha e Confirmar senha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Senha (mínimo 6 caracteres)
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm text-slate-800 outline-none transition-all shadow-2xs font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Confirmar senha
              </label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm text-slate-800 outline-none transition-all shadow-2xs font-medium"
                required
              />
            </div>
          </div>

          {/* Checkbox Termos de Uso */}
          <div className="flex items-start gap-2.5 pt-2">
            <input
              type="checkbox"
              id="termos"
              checked={termosAceitos}
              onChange={(e) => setTermosAceitos(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="termos" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
              Li e concordo com os{' '}
              <span className="text-emerald-700 font-bold hover:underline">Termos de Uso</span> e{' '}
              <span className="text-emerald-700 font-bold hover:underline">
                Política de Privacidade
              </span> do IFCE Iventus.
            </label>
          </div>

          {/* Botão Cadastrar */}
          <button
            type="submit"
            className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer mt-4"
          >
            Cadastrar Conta
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-600">
          Já possui uma conta?{' '}
          <button
            type="button"
            onClick={onGoToLogin}
            className="font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
};
