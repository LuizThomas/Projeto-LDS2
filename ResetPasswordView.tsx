import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface ResetPasswordViewProps {
  onGoToLogin: () => void;
}

export const ResetPasswordView: React.FC<ResetPasswordViewProps> = ({ onGoToLogin }) => {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }
    if (novaSenha.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      onGoToLogin();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Card matching Nova Senha - Todos.png */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
          Criação da nova senha
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
            {error}
          </div>
        )}

        {success ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 mb-6">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Senha redefinida com sucesso! Redirecionando...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nova senha
              </label>
              <input
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm text-slate-800 outline-none transition-all shadow-2xs font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Confirmar nova senha
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

            <button
              type="submit"
              className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer mt-2"
            >
              Pronto
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onGoToLogin}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer hover:underline"
          >
            Voltar para o login
          </button>
        </div>
      </div>
    </div>
  );
};
