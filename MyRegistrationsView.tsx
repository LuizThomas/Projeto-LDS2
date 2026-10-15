import React from 'react';
import { Calendar, MapPin, Heart, ChevronRight, Image as ImageIcon, TicketX } from 'lucide-react';
import { Inscricao, Evento } from '../../types';

interface MyRegistrationsViewProps {
  inscricoes: Inscricao[];
  eventos: Evento[];
  favoritos: number[];
  onToggleFavorito: (id_evento: number) => void;
  onOpenDetails: (evento: Evento) => void;
  onCancelarInscricao: (id_inscricao: number) => void;
}

export const MyRegistrationsView: React.FC<MyRegistrationsViewProps> = ({
  inscricoes,
  eventos,
  favoritos,
  onToggleFavorito,
  onOpenDetails,
  onCancelarInscricao,
}) => {
  // Only active confirmed subscriptions
  const activeInscricoes = inscricoes.filter((i) => i.status === 'CONFIRMADA');

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Minhas Inscrições</h1>
        <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
          Acompanhe suas participações confirmadas nos eventos do IFCE e gerencie sua agenda acadêmica.
        </p>
      </div>

      {activeInscricoes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center">
          <TicketX className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm sm:text-base font-semibold text-slate-700">Nenhuma inscrição ativa</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Você ainda não se inscreveu em nenhuma atividade científica. Navegue pelo catálogo para garantir sua vaga!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {activeInscricoes.map((inscricao, index) => {
            const evento =
              eventos.find((e) => e.id_evento === inscricao.evento_id) ||
              eventos.find((e) => e.titulo === inscricao.evento_titulo);

            const isFav = evento ? favoritos.includes(evento.id_evento) : false;

            return (
              <div
                key={`reg-${inscricao.id_inscricao}-${index}`}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 transition-all shadow-xs hover:shadow-md flex flex-col overflow-hidden"
              >
                {/* Banner Header with Badge & Heart */}
                <div className="relative h-40 sm:h-44 bg-slate-100 flex items-center justify-center border-b border-slate-100">
                  {evento?.banner_url ? (
                    <img
                      src={evento.banner_url}
                      alt={inscricao.evento_titulo}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-slate-300 flex items-center justify-center text-slate-300">
                      <ImageIcon className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.5]" />
                    </div>
                  )}

                  {/* Modality Badge */}
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-semibold shadow-xs ${
                      inscricao.evento_modalidade === 'Online'
                        ? 'bg-amber-100/95 text-amber-800'
                        : 'bg-blue-100/95 text-blue-800'
                    }`}
                  >
                    {inscricao.evento_modalidade || 'Presencial'}
                  </span>

                  {/* Heart button */}
                  {evento && (
                    <button
                      onClick={() => onToggleFavorito(evento.id_evento)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 shadow-xs border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all cursor-pointer min-h-[32px] min-w-[32px]"
                      aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFav ? 'text-red-500 fill-red-500' : 'text-slate-400'
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                  <div className="space-y-2.5 sm:space-y-3">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2">
                      {inscricao.evento_titulo}
                    </h2>

                    <div className="space-y-1 sm:space-y-1.5 text-xs text-slate-600 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{inscricao.evento_data || '16 a 18 de Maio de 2024'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{inscricao.evento_local || 'Campus Cedro - IFCE'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Links & Cancel Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {evento && (
                      <button
                        onClick={() => onOpenDetails(evento)}
                        className="text-emerald-700 hover:text-emerald-800 text-xs font-bold flex items-center gap-1 group/btn cursor-pointer py-1"
                      >
                        <span>Ver detalhes</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    )}

                    <button
                      onClick={() => onCancelarInscricao(inscricao.id_inscricao)}
                      className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline transition-colors py-1 cursor-pointer min-h-[32px] flex items-center"
                    >
                      Cancelar inscrição
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
