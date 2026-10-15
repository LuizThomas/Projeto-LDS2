import React, { useState } from 'react';
import { X, Plus, Bold, Italic, Underline, Strikethrough, Code, Image as ImageIcon } from 'lucide-react';
import { Evento, StatusEvento } from '../../types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (eventoData: Omit<Evento, 'id_evento' | 'created_at' | 'inscritos_count'>) => void;
  organizadorId: number;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  organizadorId,
}) => {
  const [nome, setNome] = useState('');
  const [local, setLocal] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState<StatusEvento>('PUBLICADO');
  const [modalidade, setModalidade] = useState<'Presencial' | 'Online'>('Presencial');
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !local.trim()) return;

    onCreate({
      id_organizador: organizadorId,
      titulo: nome,
      descricao: descricao || 'Descrição oficial do evento acadêmico no IFCE.',
      banner_url: bannerUrl,
      data_inicio: '2024-06-20 08:00:00',
      data_fim: '2024-06-22 18:00:00',
      inicio_inscricoes: '2024-05-01 00:00:00',
      fim_inscricoes: '2024-06-19 23:59:59',
      status,
      local,
      modalidade,
      data_formatada: data || '20 a 22 de Junho de 2024',
      horario_formatado: horario || '08:00h - 18:00h',
    });

    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBannerUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Green Styled Container - Replicating Criando Evento - Administrador.png & Organizador.png */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#86efac]/50 border-2 border-emerald-500 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-150 my-auto">
        {/* Close Button X */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-700 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Left Column: Imagem do Evento & Status buttons */}
          <div className="w-full md:w-64 shrink-0 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Imagem do Evento</h3>

              {/* Upload Box with + Icon */}
              <label className="w-full h-56 bg-slate-200/90 hover:bg-slate-200 border-2 border-dashed border-slate-400 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden group">
                {bannerUrl ? (
                  <img src={bannerUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-600">
                    <Plus className="w-12 h-12 stroke-[1.5] mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">Upload da imagem</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              {/* Status Selector */}
              <div className="pt-2">
                <p className="text-xs font-bold text-slate-800 text-center mb-2">
                  Status do Evento
                </p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setStatus('PUBLICADO')}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all shadow-xs cursor-pointer ${
                      status === 'PUBLICADO'
                        ? 'bg-[#15803d] text-white'
                        : 'bg-emerald-100/80 text-emerald-900 border border-emerald-300'
                    }`}
                  >
                    Ativo
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('RASCUNHO')}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all shadow-xs cursor-pointer ${
                      status === 'RASCUNHO'
                        ? 'bg-[#475569] text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    Rascunho
                  </button>
                </div>
              </div>
            </div>

            {/* OK Button at Bottom Left - Desktop */}
            <div className="pt-6 hidden md:block">
              <button
                type="submit"
                className="px-8 py-2.5 bg-white hover:bg-slate-100 border-2 border-slate-800 text-slate-900 font-extrabold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>

          {/* Right Column: Form Fields */}
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Criando Evento</h2>

            {/* Nome do Evento */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Nome do Evento
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Como se chamará..."
                className="w-full px-4 py-2.5 bg-white rounded-xl border border-slate-300 focus:border-emerald-600 text-sm text-slate-900 outline-none transition-all shadow-2xs"
                required
              />
            </div>

            {/* Local & Modalidade */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Local
                </label>
                <input
                  type="text"
                  value={local}
                  onChange={(e) => setLocal(e.target.value)}
                  placeholder="Onde acontecerá..."
                  className="w-full px-4 py-2.5 bg-white rounded-xl border border-slate-300 focus:border-emerald-600 text-sm text-slate-900 outline-none transition-all shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Modalidade
                </label>
                <select
                  value={modalidade}
                  onChange={(e) => setModalidade(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-white rounded-xl border border-slate-300 focus:border-emerald-600 text-sm text-slate-900 outline-none transition-all shadow-2xs"
                >
                  <option value="Presencial">Presencial</option>
                  <option value="Online">Online</option>
                </select>
              </div>
            </div>

            {/* Data & Horário side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Data
                </label>
                <input
                  type="text"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  placeholder="Quando acontecerá..."
                  className="w-full px-4 py-2.5 bg-white rounded-xl border border-slate-300 focus:border-emerald-600 text-sm text-slate-900 outline-none transition-all shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Horário
                </label>
                <input
                  type="text"
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  placeholder="Quando acontecerá..."
                  className="w-full px-4 py-2.5 bg-white rounded-xl border border-slate-300 focus:border-emerald-600 text-sm text-slate-900 outline-none transition-all shadow-2xs"
                  required
                />
              </div>
            </div>

            {/* Descrição do Evento with Rich Toolbar B, I, U, S, <> */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Descrição do Evento
              </label>
              <div className="bg-white rounded-xl border border-slate-300 shadow-2xs overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center gap-4 px-3 py-2 border-b border-slate-200 bg-slate-50/70 text-slate-700">
                  <button type="button" className="font-bold hover:text-emerald-700 cursor-pointer" title="Negrito">
                    B
                  </button>
                  <button type="button" className="italic hover:text-emerald-700 cursor-pointer" title="Itálico">
                    I
                  </button>
                  <button type="button" className="underline hover:text-emerald-700 cursor-pointer" title="Sublinhado">
                    U
                  </button>
                  <button type="button" className="line-through hover:text-emerald-700 cursor-pointer" title="Tachado">
                    S
                  </button>
                  <button type="button" className="font-mono text-xs hover:text-emerald-700 cursor-pointer" title="Código">
                    &lt;&gt;
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Detalhes da programação, submissão de trabalhos, palestrantes e certificados..."
                  className="w-full p-3.5 text-sm text-slate-800 outline-none resize-none"
                  required
                />
              </div>
            </div>

            {/* Mobile Submit Button at bottom */}
            <div className="pt-2 md:hidden">
              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-xl shadow-md transition-colors cursor-pointer min-h-[44px]"
              >
                Salvar e Criar Evento
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
