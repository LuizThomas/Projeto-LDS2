import React, { useState } from 'react';
import { SolicitacaoCertificadoModeracao } from '../../types';
import { Check } from 'lucide-react';

interface AdminCertificatesViewProps {
  solicitacoes: SolicitacaoCertificadoModeracao[];
  onModerar: (id_certificado: number, decisao: 'APROVAR' | 'RECUSAR') => void;
}

export const AdminCertificatesView: React.FC<AdminCertificatesViewProps> = ({
  solicitacoes,
  onModerar,
}) => {
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAction = (id: number, decisao: 'APROVAR' | 'RECUSAR', evento: string) => {
    onModerar(id, decisao);
    setFeedback(
      decisao === 'APROVAR'
        ? `Lote de certificados para "${evento}" aprovado com sucesso!`
        : `Lote de certificados para "${evento}" recusado.`
    );
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title matching Aprovação dos Certificados - Administrador.png */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Meus certificados
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Aprovação institucional e liberação de chaves públicas de autenticidade para certificados.
        </p>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Certificates Moderation Container */}
      <div className="space-y-3">
        {/* Mobile View: Cards for screens < sm */}
        <div className="sm:hidden space-y-3">
          {solicitacoes.map((item, index) => {
            const isModerated = item.status_moderacao !== 'PENDENTE';
            return (
              <div
                key={`m-sol-cert-${item.id_certificado}-${index}`}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {item.evento_titulo}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Organizador: {item.organizador_nome}
                    </p>
                  </div>
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

                <div className="text-xs text-slate-400 pt-1 border-t border-slate-100">
                  <span>Data da Solicitação: {item.data_solicitacao}</span>
                </div>

                {!isModerated && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleAction(item.id_certificado, 'APROVAR', item.evento_titulo)}
                      className="w-full py-2 bg-[#15803d] hover:bg-[#166534] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Aprovar</span>
                    </button>
                    <button
                      onClick={() => handleAction(item.id_certificado, 'RECUSAR', item.evento_titulo)}
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
                  <th className="px-6 py-4">Evento</th>
                  <th className="px-6 py-4">Organizador</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {solicitacoes.map((item, index) => {
                  const isModerated = item.status_moderacao !== 'PENDENTE';
                  return (
                    <tr key={`sol-cert-${item.id_certificado}-${index}`} className="hover:bg-slate-50/60 transition-colors">
                      {/* Evento */}
                      <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                        {item.evento_titulo}
                      </td>

                      {/* Organizador */}
                      <td className="px-6 py-4 text-xs font-medium text-slate-600">
                        {item.organizador_nome}
                      </td>

                      {/* Data */}
                      <td className="px-6 py-4 text-xs font-medium text-slate-600">
                        {item.data_solicitacao}
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
                              onClick={() => handleAction(item.id_certificado, 'RECUSAR', item.evento_titulo)}
                              className="px-4 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
                            >
                              Recusar
                            </button>
                            <button
                              onClick={() => handleAction(item.id_certificado, 'APROVAR', item.evento_titulo)}
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
