import React, { useState } from 'react';
import { SolicitacaoInscricaoModeracao } from '../../types';
import { Check, X, ShieldAlert } from 'lucide-react';

interface AdminInscriptionsViewProps {
  solicitacoes: SolicitacaoInscricaoModeracao[];
  onModerar: (id_inscricao: number, decisao: 'APROVAR' | 'RECUSAR') => void;
}

export const AdminInscriptionsView: React.FC<AdminInscriptionsViewProps> = ({
  solicitacoes,
  onModerar,
}) => {
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAction = (id: number, decisao: 'APROVAR' | 'RECUSAR', nome: string) => {
    onModerar(id, decisao);
    setFeedback(
      decisao === 'APROVAR'
        ? `Inscrição de ${nome} aprovada com sucesso!`
        : `Inscrição de ${nome} recusada.`
    );
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title matching Aprovação dos Inscrições - Administrador.png */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Solicitações de Inscrição
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Painel de moderação administrativa para homologação de participantes e regras de capacidade.
        </p>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Inscriptions Container */}
      <div className="space-y-3">
        {/* Mobile View: Cards for screens < sm */}
        <div className="sm:hidden space-y-3">
          {solicitacoes.map((item, index) => {
            const isModerated = item.status_moderacao !== 'PENDENTE';
            return (
              <div
                key={`m-sol-insc-${item.id_inscricao}-${index}`}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {item.participante_nome}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.evento_titulo}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                    {item.condicao === 'PARTICIPANTE'
                      ? 'Participante'
                      : item.condicao === 'PROFESSOR'
                      ? 'Professor'
                      : 'Administrador'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-100">
                  <span>Data: {item.data_solicitacao}</span>
                  {isModerated && (
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        item.status_moderacao === 'APROVADO'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status_moderacao === 'APROVADO' ? 'Aprovado' : 'Recusado'}
                    </span>
                  )}
                </div>

                {!isModerated && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleAction(item.id_inscricao, 'APROVAR', item.participante_nome)}
                      className="w-full py-2 bg-[#15803d] hover:bg-[#166534] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Aprovar</span>
                    </button>
                    <button
                      onClick={() => handleAction(item.id_inscricao, 'RECUSAR', item.participante_nome)}
                      className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl transition-colors cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5"
                    >
                      <X className="w-4 h-4 stroke-[2.5]" />
                      <span>Recusar</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop View: Table for screens >= sm */}
        <div className="hidden sm:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-xs font-semibold text-slate-500">
                <tr>
                  <th className="px-6 py-4">Participante</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Condição</th>
                  <th className="px-6 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {solicitacoes.map((item, index) => {
                  const isModerated = item.status_moderacao !== 'PENDENTE';
                  return (
                    <tr key={`sol-insc-${item.id_inscricao}-${index}`} className="hover:bg-slate-50/60 transition-colors">
                      {/* Participante */}
                      <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                        {item.participante_nome}
                      </td>

                      {/* Data */}
                      <td className="px-6 py-4 text-xs font-medium text-slate-600">
                        {item.data_solicitacao}
                      </td>

                      {/* Condição */}
                      <td className="px-6 py-4 text-xs font-medium text-slate-600">
                        {item.condicao === 'PARTICIPANTE'
                          ? 'Participante'
                          : item.condicao === 'PROFESSOR'
                          ? 'Professor'
                          : 'Administrador'}
                      </td>

                      {/* Ações: Recusar (red) / Aprovar (green) */}
                      <td className="px-6 py-4 text-center">
                        {isModerated ? (
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-md ${
                              item.status_moderacao === 'APROVADO'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {item.status_moderacao === 'APROVADO' ? 'Aprovado' : 'Recusado'}
                          </span>
                        ) : (
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => handleAction(item.id_inscricao, 'RECUSAR', item.participante_nome)}
                              className="px-4 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
                            >
                              Recusar
                            </button>
                            <button
                              onClick={() => handleAction(item.id_inscricao, 'APROVAR', item.participante_nome)}
                              className="px-4 py-1.5 bg-[#15803d] hover:bg-[#166534] text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
                            >
                              Aprovar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Ver mais Footer */}
          <div className="py-4 text-center border-t border-slate-100 bg-slate-50/40">
            <span className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer">
              Ver mais
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
