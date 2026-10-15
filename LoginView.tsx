import React, { useState } from 'react';
import { Eye, EyeOff, User, GraduationCap, ShieldCheck, Clock, AlertTriangle, AlertCircle } from 'lucide-react';
import { Logo } from '../common/Logo';

interface LoginViewProps {
  onLogin: (email: string) => { success: boolean; message?: string } | boolean;
  onGoToRegister: () => void;
  onGoToForgotPassword: () => void;
  onQuickDemoLogin: (email: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLogin,
  onGoToRegister,
  onGoToForgotPassword,
  onQuickDemoLogin,
}) => {
  const [email, setEmail] = useState('luiz.thomas@gmail.com');
  const [senha, setSenha] = useState('alunoifce');
  const [showPassword, setShowPassword] = useState(false);
  const [errorInfo, setErrorInfo] = useState<{ message: string; isPending?: boolean } | null>(null);

  const handleLoginSubmit = (targetEmail: string) => {
    setErrorInfo(null);
    const res = onLogin(targetEmail);
    if (typeof res === 'object') {
      if (!res.success) {
        const isPending = res.message?.toLowerCase().includes('pendente');
        setErrorInfo({
          message: res.message || 'Credenciais inválidas.',
          isPending,
        });
      }
    } else if (!res) {
      setErrorInfo({
        message: 'Credenciais inválidas. Verifique seu e-mail ou utilize um dos logins rápidos.',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLoginSubmit(email);
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    handleLoginSubmit(demoEmail);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-12">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Brand Banner with ONLY the IV emblem - no "iv iventus" duplication */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-6 lg:pl-10">
          {/* Authentic and clean IV emblem */}
          <div className="p-3 bg-white rounded-3xl border border-slate-200/80 shadow-sm inline-flex items-center justify-center">
            <Logo size="xl" showText={false} />
          </div>

          <div className="space-y-2 max-w-md">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-[#15803d] tracking-tight">
              IFCE Iventus
            </h1>
            <p className="text-base text-slate-600 font-medium leading-relaxed">
              Plataforma de gestão dos eventos científicos do IFCE
            </p>
          </div>

          {/* Institutional Compliance Notice */}
          <div className="pt-4 border-t border-slate-200/80 text-xs text-slate-500 max-w-sm">
            <p className="font-semibold text-slate-700">Instituto Federal de Educação, Ciência e Tecnologia do Ceará</p>
            <p className="mt-1">Automação de inscrições, moderação administrativa de cadastros e emissão de certificados digitais autenticados.</p>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Entrar na sua conta
            </h2>

            {/* Error / Pending Feedback Banner */}
            {errorInfo && (
              <div
                className={`mb-5 p-3.5 rounded-xl text-xs font-medium border flex items-start gap-2.5 ${
                  errorInfo.isPending
                    ? 'bg-amber-50 text-amber-900 border-amber-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}
              >
                {errorInfo.isPending ? (
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <div className="leading-relaxed">
                  <p className="font-bold mb-0.5">
                    {errorInfo.isPending ? 'Cadastro em Moderação' : 'Atenção'}
                  </p>
                  <p>{errorInfo.message}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* E-mail */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorInfo(null);
                  }}
                  placeholder="exemplo@ifce.edu.br"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm text-slate-800 outline-none transition-all shadow-2xs font-medium"
                  required
                />
              </div>

              {/* Senha */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={senha}
                    onChange={(e) => {
                      setSenha(e.target.value);
                      setErrorInfo(null);
                    }}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm text-slate-800 outline-none transition-all shadow-2xs font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Esqueceu sua senha link */}
              <div className="text-right pt-0.5">
                <button
                  type="button"
                  onClick={onGoToForgotPassword}
                  className="text-xs text-slate-500 hover:text-emerald-700 font-medium cursor-pointer"
                >
                  Esqueceu sua senha?
                </button>
              </div>

              {/* Entrar Button */}
              <button
                type="submit"
                className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer mt-2"
              >
                Entrar
              </button>
            </form>

            {/* Bottom Links */}
            <div className="mt-6 text-center space-y-2 text-xs">
              <p className="text-slate-600 font-medium">
                Não tem uma conta?{' '}
                <button
                  onClick={onGoToRegister}
                  className="font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  Cadastre-se
                </button>
              </p>

              <p className="text-slate-500">
                Esqueceu sua senha?{' '}
                <button
                  onClick={onGoToForgotPassword}
                  className="font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  Recuperar senha
                </button>
              </p>
            </div>

            {/* Quick Demo Access Bar */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
                Perfis para Demonstração:
              </p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('luiz.thomas@gmail.com')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-center text-[11px] font-semibold text-slate-700 hover:text-emerald-800 transition-all cursor-pointer"
                  title="Luiz Thomas (Participante Ativo)"
                >
                  <User className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                  <span>Participante</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('saulo_bezerra@gmail.com')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-center text-[11px] font-semibold text-slate-700 hover:text-emerald-800 transition-all cursor-pointer"
                  title="Saulo Bezerra (Professor Ativo)"
                >
                  <GraduationCap className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                  <span>Professor</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('lucas.nogueira@ifce.edu.br')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-center text-[11px] font-semibold text-slate-700 hover:text-emerald-800 transition-all cursor-pointer"
                  title="Lucas Nogueira (Administrador)"
                >
                  <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                  <span>Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('mariana.feitosa@gmail.com')}
                  className="p-2 rounded-xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200 text-center text-[11px] font-semibold text-amber-900 transition-all cursor-pointer"
                  title="Mariana Feitosa (Cadastro Pendente de Moderação)"
                >
                  <Clock className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                  <span>Testar Pendente</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
