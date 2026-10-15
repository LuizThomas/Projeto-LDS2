import React, { useState } from 'react';
import { Download, Award, CheckCircle2, ShieldCheck, ExternalLink, QrCode } from 'lucide-react';
import { Certificado } from '../../types';
import { gerarCertificadoPDF } from '../../utils/pdfGenerator';
import confetti from 'canvas-confetti';

interface MyCertificatesViewProps {
  certificados: Certificado[];
}

export const MyCertificatesView: React.FC<MyCertificatesViewProps> = ({ certificados }) => {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [selectedCert, setSelectedCert] = useState<Certificado | null>(null);

  const handleDownload = (cert: Certificado) => {
    setDownloadingId(cert.id_certificado);
    try {
      gerarCertificadoPDF(cert);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } finally {
      setTimeout(() => setDownloadingId(null), 800);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title - Matches Mockup "Certificados - Participante.png" */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Meus certificados</h1>
        <p className="text-xs text-slate-500 mt-1">
          Acesse, emita e comprove sua participação oficial com certificados assinados digitalmente pelo IFCE.
        </p>
      </div>

      {certificados.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">Nenhum certificado emitido</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Ao concluir um evento e ter sua presença homologada pelo professor organizador, seu certificado oficial ficará disponível aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Mobile View: Cards for screens < sm */}
          <div className="sm:hidden space-y-3">
            {certificados.map((cert, index) => {
              const isDownloading = downloadingId === cert.id_certificado;
              return (
                <div
                  key={`m-cert-${cert.id_certificado}-${index}`}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">
                        {cert.evento_titulo}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {cert.codigo_validacao}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                      {cert.carga_horaria || 20}h
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                    <span>
                      Data: {cert.data_evento || new Date(cert.data_emissao).toLocaleDateString('pt-BR')}
                    </span>
                    <button
                      onClick={() => handleDownload(cert)}
                      disabled={isDownloading}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer min-h-[36px]"
                    >
                      <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
                      <span>{isDownloading ? 'Gerando...' : 'Baixar PDF'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop View: Table for screens >= sm */}
          <div className="hidden sm:block bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                {/* Table Header matching mockup */}
                <thead className="bg-slate-50/75 border-b border-slate-200 text-xs font-semibold text-slate-500">
                  <tr>
                    <th scope="col" className="px-6 py-4">Evento</th>
                    <th scope="col" className="px-6 py-4">Data</th>
                    <th scope="col" className="px-6 py-4">Carga Horária</th>
                    <th scope="col" className="px-6 py-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {certificados.map((cert, index) => {
                    const isDownloading = downloadingId === cert.id_certificado;
                    return (
                      <tr key={`cert-${cert.id_certificado}-${cert.codigo_validacao}-${index}`} className="hover:bg-slate-50/60 transition-colors">
                        {/* Evento */}
                        <td className="px-6 py-4.5">
                          <div className="font-semibold text-slate-900 text-sm">
                            {cert.evento_titulo}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                            Código: {cert.codigo_validacao}
                          </div>
                        </td>

                        {/* Data */}
                        <td className="px-6 py-4.5 text-xs text-slate-600 font-medium">
                          {cert.data_evento || new Date(cert.data_emissao).toLocaleDateString('pt-BR')}
                        </td>

                        {/* Carga Horária */}
                        <td className="px-6 py-4.5 text-xs font-semibold text-slate-700">
                          {cert.carga_horaria || 20}h
                        </td>

                        {/* Ações - Download Icon in green matching mockup */}
                        <td className="px-6 py-4.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleDownload(cert)}
                              disabled={isDownloading}
                              className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-600 transition-all shadow-2xs group"
                              title="Baixar Certificado Oficial em PDF"
                            >
                              <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : 'group-hover:scale-110'} transition-transform`} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer Link - Matches "Ver mais" in mockup */}
            <div className="py-4 text-center border-t border-slate-100 bg-slate-50/40">
              <span className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer">
                Ver mais
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
