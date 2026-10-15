import React, { useState } from 'react';
import { ShieldCheck, Search, Award, CheckCircle2, XCircle, Download, FileText, ArrowRight } from 'lucide-react';
import { Certificado } from '../../types';
import { gerarCertificadoPDF } from '../../utils/pdfGenerator';

interface CertificateValidatorViewProps {
  onValidate: (codigo: string) => Certificado | null;
  certificados: Certificado[];
}

export const CertificateValidatorView: React.FC<CertificateValidatorViewProps> = ({
  onValidate,
  certificados,
}) => {
  const [codigo, setCodigo] = useState('');
  const [resultado, setResultado] = useState<Certificado | null>(null);
  const [pesquisado, setPesquisado] = useState(false);

  const handleVerificar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo.trim()) return;

    const cert = onValidate(codigo);
    setResultado(cert);
    setPesquisado(true);
  };

  const handleTestCode = (sampleCode: string) => {
    setCodigo(sampleCode);
    const cert = onValidate(sampleCode);
    setResultado(cert);
    setPesquisado(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Serviço Oficial de Validação de Autenticidade Digital</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Validador de Certificados IFCE Iventus
        </h1>
        <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
          Consulte e confirme a legitimidade de certificados acadêmicos emitidos pelo Instituto Federal do Ceará através do código alfanumérico único.
        </p>
      </div>

      {/* Validation Input Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8">
        <form onSubmit={handleVerificar} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Código de Validação Digital (Token Único):
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={codigo}
                onChange={(e) => {
                  setCodigo(e.target.value);
                  setPesquisado(false);
                }}
                placeholder="Ex: IFCE-SC23-9F8A-7C21-BD3E-88A1"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm font-mono uppercase text-slate-900 outline-none transition-all shadow-2xs"
                required
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px] shadow-xs"
              >
                <Search className="w-4 h-4" />
                <span>Verificar Certificado</span>
              </button>
            </div>
          </div>
        </form>

        {/* Quick test pills */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 mb-2">
            Códigos de Teste Registrados no Banco de Dados:
          </p>
          <div className="flex flex-wrap gap-2">
            {certificados.slice(0, 3).map((c, index) => (
              <button
                key={`val-${c.id_certificado}-${c.codigo_validacao}-${index}`}
                type="button"
                onClick={() => handleTestCode(c.codigo_validacao)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-[11px] font-mono text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer"
              >
                {c.codigo_validacao}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Validation Result */}
      {pesquisado && (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          {resultado ? (
            <div className="bg-emerald-50/70 border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[11px] font-extrabold uppercase tracking-wide">
                    Documento Válido & Autêntico
                  </span>
                  <h3 className="text-xl font-bold text-emerald-950 mt-0.5">
                    Certificado Oficial Registrado no IFCE
                  </h3>
                </div>
              </div>

              {/* Certificate Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-5 rounded-2xl border border-emerald-200 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Nome do Participante:</span>
                  <span className="font-bold text-slate-900 text-sm">{resultado.participante_nome}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Matrícula Acadêmica:</span>
                  <span className="font-semibold text-slate-800">{resultado.participante_matricula || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Evento Científico:</span>
                  <span className="font-bold text-slate-900">{resultado.evento_titulo}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Carga Horária Aprovada:</span>
                  <span className="font-bold text-emerald-700 text-sm">{resultado.carga_horaria || 20} Horas</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Docente / Coordenador:</span>
                  <span className="font-medium text-slate-800">{resultado.organizador_nome || 'IFCE Docente'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Data de Conclusão / Emissão:</span>
                  <span className="font-medium text-slate-800">
                    {resultado.data_evento || new Date(resultado.data_emissao).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-[11px] text-emerald-800 font-mono">
                  Hash de integridade referencial: <span className="font-bold">{resultado.codigo_validacao}</span>
                </div>

                <button
                  onClick={() => gerarCertificadoPDF(resultado)}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Via Oficial em PDF</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <XCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-red-900">
                Certificado Não Encontrado
              </h3>
              <p className="text-xs text-red-700 max-w-md mx-auto">
                O código informado ("{codigo}") não corresponde a nenhum registro autêntico no banco de dados do IFCE Iventus. Certifique-se de digitar o código completo incluindo os hífens.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
