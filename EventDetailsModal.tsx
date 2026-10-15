import React from 'react';
import { X, Heart, Image as ImageIcon, Calendar, Clock, MapPin, Users, Award, Check } from 'lucide-react';
import { Evento, Atividade, PerfilUsuario } from '../../types';

interface EventDetailsModalProps {
  evento: Evento | null;
  isOpen: boolean;
  onClose: () => void;
  userRole: PerfilUsuario;
  isInscrito: boolean;
  isFavorito: boolean;
  onToggleFavorito: (id_evento: number) => void;
  onInscrever: (id_evento: number) => void;
  onCancelarInscricao: () => void;
  atividades: Atividade[];
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  evento,
  isOpen,
  onClose,
  userRole,
  isInscrito,
  isFavorito,
  onToggleFavorito,
  onInscrever,
  onCancelarInscricao,
  atividades,
}) => {
  if (!isOpen || !evento) return null;

  const eventAtividades = atividades.filter((a) => a.id_evento === evento.id_evento);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Modal Container - Matches Visualizando Evento - Participante.png */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white border border-slate-300 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-150 my-auto">
        {/* Close Button X */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Left Column: Imagem do Evento & Actions */}
          <div className="w-full md:w-64 shrink-0 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Imagem do Evento</h3>

              {/* Upload or Image Frame */}
              <div className="w-full h-56 bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 overflow-hidden">
                {evento.banner_url ? (
                  <img src={evento.banner_url} alt={evento.titulo} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <ImageIcon className="w-12 h-12 stroke-[1.2] mb-2" />
                    <span className="text-xs font-semibold text-slate-500">Upload da imagem</span>
                  </div>
                )}
              </div>

              {/* Event Metadata Card */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Organizador:</span>
                  <span className="font-semibold text-slate-800">{evento.organizador_nome || 'IFCE Docente'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Modalidade:</span>
                  <span className="font-semibold text-emerald-700">{evento.modalidade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Inscritos:</span>
                  <span className="font-semibold text-slate-800">{evento.inscritos_count || 0} vagas ocupadas</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions for Participant - Matching Mockup (Desktop) */}
            {userRole === 'PARTICIPANTE' && (
              <div className="pt-6 hidden md:flex items-center gap-3">
                {isInscrito ? (
                  <button
                    onClick={onCancelarInscricao}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Cancelar inscrição
                  </button>
                ) : (
                  <button
                    onClick={() => onInscrever(evento.id_evento)}
                    disabled={evento.status !== 'PUBLICADO'}
                    className={`flex-1 py-2.5 font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer ${
                      evento.status === 'PUBLICADO'
                        ? 'bg-[#16a34a] hover:bg-[#15803d] text-white'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Inscrever-se
                  </button>
                )}

                {/* Heart Button */}
                <button
                  onClick={() => onToggleFavorito(evento.id_evento)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isFavorito
                      ? 'border-red-300 bg-red-50 text-red-600'
                      : 'border-slate-300 text-slate-400 hover:text-red-500'
                  }`}
                  title="Favoritar evento"
                >
                  <Heart className={`w-5 h-5 ${isFavorito ? 'fill-current' : ''}`} />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Detalhes do Evento */}
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Detalhes do Evento</h2>

            {/* Nome do Evento */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nome do Evento
              </label>
              <div className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900">
                {evento.titulo}
              </div>
            </div>

            {/* Local */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Local
              </label>
              <div className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-300 text-sm font-medium text-slate-900">
                {evento.local}
              </div>
            </div>

            {/* Data & Horário */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Data
                </label>
                <div className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-300 text-sm font-medium text-slate-900">
                  {evento.data_formatada || evento.data_inicio}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Horário
                </label>
                <div className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-300 text-sm font-medium text-slate-900">
                  {evento.horario_formatado || '13:00h - 15:00h'}
                </div>
              </div>
            </div>

            {/* Descrição do Evento */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Descrição do Evento
              </label>
              <div className="bg-slate-50 rounded-xl border border-slate-300 overflow-hidden">
                <div className="flex items-center gap-4 px-3 py-2 border-b border-slate-200 bg-slate-100/70 text-slate-600">
                  <span className="font-bold">B</span>
                  <span className="italic">I</span>
                  <span className="underline">U</span>
                  <span className="line-through">S</span>
                  <span className="font-mono text-xs">&lt;&gt;</span>
                </div>
                <div className="p-3.5 text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line min-h-[120px]">
                  {evento.descricao}
                </div>
              </div>
            </div>

            {/* Sub-atividades vinculadas */}
            {eventAtividades.length > 0 && (
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Atividades Científicas e Minicursos Vinculados:
                </label>
                <div className="space-y-2">
                  {eventAtividades.map((atv) => (
                    <div
                      key={atv.id_atividade}
                      className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-slate-900">{atv.titulo}</p>
                        <p className="text-slate-500 mt-0.5">
                          Tipo: {atv.tipo} • Carga horária: {atv.carga_horaria || 20}h • Limite: {atv.limite_vagas} vagas
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-white text-emerald-800 font-bold border border-emerald-300">
                        {atv.tipo}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions for Participant (Mobile) */}
            {userRole === 'PARTICIPANTE' && (
              <div className="pt-4 md:hidden flex items-center gap-3">
                {isInscrito ? (
                  <button
                    onClick={onCancelarInscricao}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer min-h-[44px]"
                  >
                    Cancelar inscrição
                  </button>
                ) : (
                  <button
                    onClick={() => onInscrever(evento.id_evento)}
                    disabled={evento.status !== 'PUBLICADO'}
                    className={`flex-1 py-3 font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer min-h-[44px] ${
                      evento.status === 'PUBLICADO'
                        ? 'bg-[#16a34a] hover:bg-[#15803d] text-white'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Inscrever-se
                  </button>
                )}

                {/* Heart Button */}
                <button
                  onClick={() => onToggleFavorito(evento.id_evento)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center ${
                    isFavorito
                      ? 'border-red-300 bg-red-50 text-red-600'
                      : 'border-slate-300 text-slate-400 hover:text-red-500'
                  }`}
                  title="Favoritar evento"
                  aria-label={isFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <Heart className={`w-5 h-5 ${isFavorito ? 'fill-current' : ''}`} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
