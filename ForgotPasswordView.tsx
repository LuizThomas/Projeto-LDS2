import React, { useState } from 'react';
import { Mail, Check } from 'lucide-react';

interface ForgotPasswordViewProps {
  onGoToLogin: () => void;
  onGoToResetPassword: () => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({
  onGoToLogin,
  onGoToResetPassword,
}) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSent(true);
      setTimeout(() => {
        onGoToResetPassword();
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Card matching Recuperar Senha - Todos.png */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-10 text-center">
        {/* Mail Icon Circle */}
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6 text-slate-600">
          <Mail className="w-8 h-8 stroke-[1.5]" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Recuperar senha
        </h2>

        <p className="text-xs text-slate-500 mb-6 max-w-xs mx-auto leading-relaxed">
          Digite seu e-mail para receber um link de recuperação de senha.
        </p>

        {sent ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 mb-6">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Link enviado! Redirecionando para definir nova senha...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm text-slate-800 outline-none transition-all shadow-2xs font-medium"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer mt-2"
            >
              Enviar link de recuperação
            </button>
          </form>
        )}

        <div className="mt-6">
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
