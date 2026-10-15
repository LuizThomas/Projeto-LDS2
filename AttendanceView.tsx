import React, { useState } from 'react';
import { Search, Award, CheckSquare, Square, Download, Check } from 'lucide-react';
import { Inscricao, Evento } from '../../types';
import confetti from 'canvas-confetti';

interface AttendanceViewProps {
  inscricoes: Inscricao[];
  eventos: Evento[];
  onTogglePresenca: (id_inscricao: number) => void;
  isPresente: (id_inscricao: number) => boolean;
  onEmitirCertificado: (alunoNome: string, matricula: string, eventoTitulo: string) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  inscricoes,
  eventos,
  onTogglePresenca,
  isPresente,
  onEmitirCertificado,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Focus on the main event from mockup: Semana da Computação 2024
  const mainEvento = eventos.find((e) => e.titulo.includes('Semana da Computação')) || eventos[0];

  const mainInscritos = inscricoes.filter((i) => {
    const matchesEvent = i.evento_id === mainEvento?.id_evento || i.evento_titulo?.includes('Semana da Computação');
    const matchesSearch = searchTerm ? (i.usuario_nome?.toLowerCase().includes(searchTerm.toLowerCase())) : true;
    return matchesEvent && matchesSearch;
  });

  const handleEmitirParaAluno = (inscricao: Inscricao) => {
    const nome = inscricao.usuario_nome || 'Participante IFCE';
    const matricula = inscricao.usuario_matricula || '20241INFO01';
    const eventoTitulo = mainEvento?.titulo || 'Semana da Computação 2024';

    onEmitirCertificado(nome, matricula, eventoTitulo);
    setFeedback(`Certificado emitido e homologado para ${nome}!`);
    confetti({ particleCount: 40, spread: 50 });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleBatchEmitirCertificados = () => {
    let count = 0;
    mainInscritos.forEach((i) => {
      if (isPresente(i.id_inscricao)) {
        onEmitirCertificado(
          i.usuario_nome || 'Aluno',
          i.usuario_matricula || '20241INFO01',
          mainEvento?.titulo || 'Semana da Computação 2024'
        );
        count++;
      }
    });

    setFeedback(`${count} certificados emitidos para alunos com presença homologada!`);
    confetti({ particleCount: 70, spread: 80 });
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Toast Feedback */}
      {feedback && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Section: Inscritos - Semana da Computação 2024 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
              Inscritos - {mainEvento?.titulo || 'Semana da Computação 2024'}
            </h2>

            {/* Action button */}
            <button
              onClick={handleBatchEmitirCertificados}
              className="w-full sm:w-auto justify-center px-4 py-2.5 bg-black hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-colors min-h-[40px]"
              title="Emitir certificados para todos os alunos com presença confirmada"
            >
              <span>Inserir certificado em PDF</span>
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Search Alunos */}
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar alunos..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-100 focus:bg-white text-xs text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none transition-all"
            />
          </div>
        </div>

        {/* Table of Attendees */}
        {/* Mobile View: Cards for screens < sm */}
        <div className="sm:hidden p-3.5 space-y-3">
          {mainInscritos.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-6">
              Nenhum aluno encontrado para a pesquisa.
            </p>
          ) : (
            mainInscritos.map((inscricao, index) => {
              const presente = isPresente(inscricao.id_inscricao);
              return (
                <div
                  key={`m-att-${inscricao.id_inscricao}-${index}`}
                  className="bg-slate-50/70 rounded-2xl border border-slate-200 p-3.5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-900 text-sm truncate">
                        {inscricao.usuario_nome}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        Turma: {inscricao.usuario_turma || 'Informática S1'}
                      </p>
                    </div>

                    {/* Presença Toggle Box with large touch target */}
                    <button
                      onClick={() => onTogglePresenca(inscricao.id_inscricao)}
                      className="p-1 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
                      title={presente ? 'Confirmado' : 'Ausente'}
                      aria-label="Marcar presença"
                    >
                      {presente ? (
                        <CheckSquare className="w-6 h-6 fill-emerald-600 text-white" />
                      ) : (
                        <Square className="w-6 h-6 text-slate-300" />
                      )}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        presente
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {presente ? 'Presença confirmada' : 'Aguardando'}
                    </span>

                    <button
                      onClick={() => handleEmitirParaAluno(inscricao)}
                      disabled={!presente}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] flex items-center gap-1.5 ${
                        presente
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Certificado</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View: Table for screens >= sm */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-xs font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Turma</th>
                <th className="px-6 py-4 text-center">Presença</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mainInscritos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-xs text-slate-400">
                    Nenhum aluno encontrado para a pesquisa.
                  </td>
                </tr>
              ) : (
                mainInscritos.map((inscricao, index) => {
                  const presente = isPresente(inscricao.id_inscricao);
                  return (
                    <tr key={`att-${inscricao.id_inscricao}-${index}`} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900 text-sm">
                        {inscricao.usuario_nome}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                        {inscricao.usuario_turma || 'Informática S1'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => onTogglePresenca(inscricao.id_inscricao)}
                          className="p-1 text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer inline-flex items-center justify-center"
                          title="Alternar presença"
                        >
                          {presente ? (
                            <CheckSquare className="w-5 h-5 fill-emerald-600 text-white" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleEmitirParaAluno(inscricao)}
                          disabled={!presente}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            presente
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 cursor-pointer'
                              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
                          }`}
                        >
                          Emitir Certificado
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
