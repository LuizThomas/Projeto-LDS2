import React, { useState } from 'react';
import { User, Check, AlertCircle, Camera } from 'lucide-react';
import { Usuario } from '../../types';

interface ProfileViewProps {
  currentUser: Usuario;
  onUpdateProfile: (updates: Partial<Usuario>) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ currentUser, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState<'dados_pessoais' | 'alterar_senha'>('dados_pessoais');

  // Form states
  const [nome, setNome] = useState(currentUser.nome);
  const [email, setEmail] = useState(currentUser.email);
  const [matricula, setMatricula] = useState(currentUser.matricula || '');
  const [telefone, setTelefone] = useState(currentUser.telefone || '(88) 99999-9999');
  const [materias, setMaterias] = useState(currentUser.materias || 'LDS ARQM');

  // Password tab states
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');

  // Status feedback
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) {
      setFeedback({ type: 'error', message: 'Por favor, preencha todos os campos obrigatórios.' });
      return;
    }

    onUpdateProfile({
      nome,
      email,
      matricula: matricula || null,
      telefone,
      materias: currentUser.perfil === 'PROFESSOR' ? materias : null,
    });

    setFeedback({ type: 'success', message: 'Dados pessoais atualizados com sucesso no IFCE Iventus!' });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senhaAtual || !novaSenha || !confirmarNovaSenha) {
      setFeedback({ type: 'error', message: 'Preencha todos os campos de senha.' });
      return;
    }

    if (novaSenha !== confirmarNovaSenha) {
      setFeedback({ type: 'error', message: 'A confirmação de senha não confere.' });
      return;
    }

    if (novaSenha.length < 6) {
      setFeedback({ type: 'error', message: 'A nova senha deve ter no mínimo 6 caracteres.' });
      return;
    }

    setFeedback({ type: 'success', message: 'Senha alterada com sucesso!' });
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmarNovaSenha('');
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Meu perfil</h1>
        <p className="text-xs text-slate-500 mt-1">
          Gerencie seus dados institucionais, matrícula e segurança de acesso.
        </p>
      </div>

      {/* Main Card - Exact replica of mockup */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 px-4 sm:px-6 pt-4 gap-4 sm:gap-8 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('dados_pessoais');
              setFeedback(null);
            }}
            className={`pb-3.5 text-xs sm:text-sm font-semibold transition-all relative shrink-0 cursor-pointer ${
              activeTab === 'dados_pessoais'
                ? 'text-emerald-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Dados pessoais
            {activeTab === 'dados_pessoais' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('alterar_senha');
              setFeedback(null);
            }}
            className={`pb-3.5 text-xs sm:text-sm font-semibold transition-all relative shrink-0 cursor-pointer ${
              activeTab === 'alterar_senha'
                ? 'text-emerald-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Alterar senha
            {activeTab === 'alterar_senha' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mx-4 sm:mx-6 mt-4 sm:mt-6 p-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Tab 1: Dados pessoais */}
        {activeTab === 'dados_pessoais' && (
          <form onSubmit={handleSaveProfile} className="p-4 sm:p-8">
            <div className="flex flex-col md:flex-row gap-10">
              {/* Left Column: Avatar & Alterar foto link */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-32 h-32 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 relative overflow-hidden group">
                  {currentUser.foto_perfil ? (
                    <img
                      src={currentUser.foto_perfil}
                      alt={currentUser.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 stroke-[1.2]" />
                  )}
                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-[11px] font-semibold">
                    <Camera className="w-5 h-5 mb-1" />
                    <span>Alterar</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            onUpdateProfile({ foto_perfil: reader.result as string });
                            setFeedback({ type: 'success', message: 'Foto de perfil atualizada!' });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                <label className="text-xs font-bold text-emerald-700 hover:text-emerald-800 mt-3 cursor-pointer">
                  Alterar foto
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          onUpdateProfile({ foto_perfil: reader.result as string });
                          setFeedback({ type: 'success', message: 'Foto de perfil atualizada!' });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Right Column: Fields matching mockups */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm text-slate-800 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm text-slate-800 outline-none transition-all"
                    required
                  />
                </div>

                {/* Participant specific field */}
                {currentUser.perfil === 'PARTICIPANTE' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Matrícula (Caso for estudante da instituição)
                    </label>
                    <input
                      type="text"
                      value={matricula}
                      onChange={(e) => setMatricula(e.target.value)}
                      placeholder="Ex: 123456789101112"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm text-slate-800 outline-none transition-all"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(88) 99999-9999"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm text-slate-800 outline-none transition-all"
                  />
                </div>

                {/* Professor specific field */}
                {currentUser.perfil === 'PROFESSOR' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Responsável por Matérias
                    </label>
                    <input
                      type="text"
                      value={materias}
                      onChange={(e) => setMaterias(e.target.value)}
                      placeholder="Ex: LDS ARQM"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm text-slate-800 outline-none transition-all"
                    />
                  </div>
                )}

                {/* Submit button aligned to right matching mockup */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer min-h-[42px]"
                  >
                    Salvar alterações
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Alterar senha matching "Alterar Senha - Participante.png" */}
        {activeTab === 'alterar_senha' && (
          <form onSubmit={handleSavePassword} className="p-4 sm:p-8 max-w-xl mx-auto space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Senha atual
              </label>
              <input
                type="password"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                placeholder="alunoifce"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm text-slate-800 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nova senha
              </label>
              <input
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="novoalunoifce"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm text-slate-800 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Confirmar nova senha
              </label>
              <input
                type="password"
                value={confirmarNovaSenha}
                onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                placeholder="novoalunoifce"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm text-slate-800 outline-none transition-all"
                required
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer min-h-[42px]"
              >
                Salvar alterações
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
