import React, { useState } from 'react';
import { Calendar, MapPin, Heart, ChevronRight, Image as ImageIcon, Sparkles, Filter } from 'lucide-react';
import { Evento } from '../../types';

interface CatalogViewProps {
  eventos: Evento[];
  favoritos: number[];
  onToggleFavorito: (id_evento: number) => void;
  onOpenDetails: (evento: Evento) => void;
  onQuickInscrever: (id_evento: number) => void;
  inscricoesIds: number[]; // ids de eventos já inscritos
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  eventos,
  favoritos,
  onToggleFavorito,
  onOpenDetails,
  onQuickInscrever,
  inscricoesIds,
}) => {
  const [filterModalidade, setFilterModalidade] = useState<'TODOS' | 'Presencial' | 'Online' | 'FAVORITOS'>('TODOS');

  const filteredEventos = eventos.filter((e) => {
    // Only show published or active events in public catalog
    if (e.status === 'RASCUNHO') return false;

    if (filterModalidade === 'Presencial') return e.modalidade === 'Presencial';
    if (filterModalidade === 'Online') return e.modalidade === 'Online';
    if (filterModalidade === 'FAVORITOS') return favoritos.includes(e.id_evento);
    return true;
  });

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Eventos</h1>
          <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
            Explore e participe de congressos, workshops e simpósios científicos do IFCE.
          </p>
        </div>

        {/* Filter Pills with horizontal scroll on mobile */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold overflow-x-auto max-w-full shrink-0 -mx-1 px-1">
          <button
            onClick={() => setFilterModalidade('TODOS')}
            className={`px-3 py-1.5 rounded-lg transition-all shrink-0 whitespace-nowrap cursor-pointer min-h-[36px] flex items-center justify-center ${
              filterModalidade === 'TODOS'
                ? 'bg-white text-emerald-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos ({eventos.filter((e) => e.status !== 'RASCUNHO').length})
          </button>
          <button
            onClick={() => setFilterModalidade('Presencial')}
            className={`px-3 py-1.5 rounded-lg transition-all shrink-0 whitespace-nowrap cursor-pointer min-h-[36px] flex items-center justify-center ${
              filterModalidade === 'Presencial'
                ? 'bg-white text-emerald-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Presencial
          </button>
          <button
            onClick={() => setFilterModalidade('Online')}
            className={`px-3 py-1.5 rounded-lg transition-all shrink-0 whitespace-nowrap cursor-pointer min-h-[36px] flex items-center justify-center ${
              filterModalidade === 'Online'
                ? 'bg-white text-emerald-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Online
          </button>
          <button
            onClick={() => setFilterModalidade('FAVORITOS')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer min-h-[36px] ${
              filterModalidade === 'FAVORITOS'
                ? 'bg-white text-rose-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Favoritos ({favoritos.length})</span>
          </button>
        </div>
      </div>

      {/* Grid of Event Cards */}
      {filteredEventos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center">
          <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm sm:text-base font-semibold text-slate-700">Nenhum evento encontrado</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Não há eventos disponíveis para o filtro selecionado no momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredEventos.map((evento, index) => {
            const isFav = favoritos.includes(evento.id_evento);
            const isInscrito = inscricoesIds.includes(evento.id_evento);

            return (
              <div
                key={`cat-${evento.id_evento}-${index}`}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 transition-all hover:shadow-md flex flex-col overflow-hidden group"
              >
                {/* Image Placeholder & Badges */}
                <div className="relative h-40 sm:h-44 bg-slate-100 flex items-center justify-center border-b border-slate-100 overflow-hidden">
                  {evento.banner_url ? (
                    <img
                      src={evento.banner_url}
                      alt={evento.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-300">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-slate-300 flex items-center justify-center">
                        <ImageIcon className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.5]" />
                      </div>
                    </div>
                  )}

                  {/* Modality Badge (Presencial: Light Blue / Online: Light Amber) */}
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-semibold shadow-xs ${
                      evento.modalidade === 'Presencial'
                        ? 'bg-blue-100/95 text-blue-800'
                        : 'bg-amber-100/95 text-amber-800'
                    }`}
                  >
                    {evento.modalidade}
                  </span>

                  {/* Favorite Heart Button */}
                  <button
                    onClick={() => onToggleFavorito(evento.id_evento)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs shadow-xs border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:scale-110 transition-all cursor-pointer min-h-[32px] min-w-[32px]"
                    title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isFav ? 'text-red-500 fill-red-500' : 'text-slate-400'
                      }`}
                    />
                  </button>

                  {/* Status Overlay if canceled/closed */}
                  {evento.status === 'CANCELADO' && (
                    <span className="absolute bottom-2 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase shadow-xs">
                      Cancelado
                    </span>
                  )}
                  {evento.status === 'ENCERRADO' && (
                    <span className="absolute bottom-2 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-600 text-white uppercase shadow-xs">
                      Encerrado
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5 sm:space-y-3">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {evento.titulo}
                    </h2>

                    <div className="space-y-1 sm:space-y-1.5 text-xs text-slate-600 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{evento.data_formatada || evento.data_inicio}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{evento.local}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3.5 mt-3 sm:pt-4 sm:mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onOpenDetails(evento)}
                      className="text-emerald-700 hover:text-emerald-800 text-xs font-bold flex items-center gap-1 group/btn cursor-pointer py-1"
                    >
                      <span>Ver detalhes</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>

                    {isInscrito ? (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        Inscrito ✓
                      </span>
                    ) : evento.status === 'PUBLICADO' ? (
                      <button
                        onClick={() => onQuickInscrever(evento.id_evento)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer min-h-[34px]"
                      >
                        Inscrever-se
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium italic">
                        {evento.status === 'ENCERRADO' ? 'Encerrado' : 'Indisponível'}
                      </span>
                    )}
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
