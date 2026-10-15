import React, { useState, useEffect } from 'react';
import { X, Plus, Image as ImageIcon } from 'lucide-react';
import { Evento, StatusEvento } from '../../types';

interface EditEventModalProps {
  evento: Evento | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id_evento: number, updates: Partial<Evento>) => void;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({
  evento,
  isOpen,
  onClose,
  onSave,
}) => {
  const [nome, setNome] = useState('');
  const [local, setLocal] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState<StatusEvento>('PUBLICADO');
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  useEffect(() => {
    if (evento) {
      setNome(evento.titulo);
      setLocal(evento.local);
      setData(evento.data_formatada || evento.data_inicio);
      setHorario(evento.horario_formatado || '13:00h - 15:00h');
      setDescricao(evento.descricao);
      setStatus(evento.status);
      setBannerUrl(evento.banner_url || null);
    }
  }, [evento]);

  if (!isOpen || !evento) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(evento.id_evento, {
      titulo: nome,
      local,
      data_formatada: data,
      horario_formatado: horario,
      descricao,
      status,
      banner_url: bannerUrl,
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
      {/* Yellow/Amber Styled Container - Replicating Editando Evento - Administrador.png */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#fef08a]/60 border-2 border-amber-400 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-150 my-auto">
        {/* Close Button X */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-700 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Left Column: Imagem do Evento & Status buttons (Encerrar, Cancelar) */}
          <div className="w-full md:w-64 shrink-0 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Imagem do Evento</h3>

              {/* Upload Box */}
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

              {/* Status Action Buttons: Encerrar (orange) / Cancelar (red) */}
              <div className="pt-2">
                <p className="text-xs font-bold text-slate-800 text-center mb-2">
                  Status do Evento
                </p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setStatus('ENCERRADO')}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all shadow-xs cursor-pointer ${
                      status === 'ENCERRADO'
                        ? 'bg-[#ea580c] text-white ring-2 ring-amber-600'
                        : 'bg-[#ea580c] text-white hover:bg-[#c2410c]'
                    }`}
                  >
                    Encerrar
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('CANCELADO')}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all shadow-xs cursor-pointer ${
                      status === 'CANCELADO'
                        ? 'bg-[#dc2626] text-white ring-2 ring-red-700'
                        : 'bg-[#dc2626] text-white hover:bg-[#b91c1c]'
                    }`}
                  >
                    Cancelar
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
            <h2 className="text-2xl font-bold text-slate-900">Editando Evento</h2>

            {/* Nome do Evento */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Nome do Evento
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-2.5 bg-white rounded-xl border border-slate-300 focus:border-amber-600 text-sm text-slate-900 outline-none transition-all shadow-2xs font-medium"
                required
              />
            </div>

            {/* Local */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Local
              </label>
              <input
                type="text"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                className="w-full px-4 py-2.5 bg-white rounded-xl border border-slate-300 focus:border-amber-600 text-sm text-slate-900 outline-none transition-all shadow-2xs font-medium"
                required
              />
            </div>

            {/* Data & Horário */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Data
                </label>
                <input
                  type="text"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white rounded-xl border border-slate-300 focus:border-amber-600 text-sm text-slate-900 outline-none transition-all shadow-2xs font-medium"
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
                  className="w-full px-4 py-2.5 bg-white rounded-xl border border-slate-300 focus:border-amber-600 text-sm text-slate-900 outline-none transition-all shadow-2xs font-medium"
                  required
                />
              </div>
            </div>

            {/* Descrição do Evento */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Descrição do Evento
              </label>
              <div className="bg-white rounded-xl border border-slate-300 shadow-2xs overflow-hidden">
                <div className="flex items-center gap-4 px-3 py-2 border-b border-slate-200 bg-slate-50/70 text-slate-700">
                  <span className="font-bold">B</span>
                  <span className="italic">I</span>
                  <span className="underline">U</span>
                  <span className="line-through">S</span>
                  <span className="font-mono text-xs">&lt;&gt;</span>
                </div>
                <textarea
                  rows={6}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full p-3.5 text-sm text-slate-800 outline-none resize-none font-medium"
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
                Salvar Alterações
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
