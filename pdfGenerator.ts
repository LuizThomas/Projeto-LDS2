import jsPDF from 'jspdf';
import { Certificado } from '../types';

export function gerarCertificadoPDF(certificado: Certificado): void {
  // Landscape A4: 297mm x 210mm
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  // Background tint
  doc.setFillColor(254, 255, 254);
  doc.rect(0, 0, width, height, 'F');

  // Decorative border - IFCE Institutional Green (#15803d)
  doc.setDrawColor(21, 128, 61);
  doc.setLineWidth(3);
  doc.rect(8, 8, width - 16, height - 16);

  // Inner thin border
  doc.setDrawColor(22, 163, 74);
  doc.setLineWidth(0.8);
  doc.rect(12, 12, width - 24, height - 24);

  // Corner decorations
  doc.setFillColor(21, 128, 61);
  doc.rect(8, 8, 12, 12, 'F');
  doc.rect(width - 20, 8, 12, 12, 'F');
  doc.rect(8, height - 20, 12, 12, 'F');
  doc.rect(width - 20, height - 20, 12, 12, 'F');

  // Red accent dots (characteristic of IFCE logo)
  doc.setFillColor(220, 38, 38);
  doc.circle(28, 28, 3.5, 'F');
  doc.circle(width - 28, 28, 3.5, 'F');

  // Institution Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('REPÚBLICA FEDERATIVA DO BRASIL', width / 2, 26, { align: 'center' });
  doc.text('MINISTÉRIO DA EDUCAÇÃO', width / 2, 31, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(21, 128, 61);
  doc.text('INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DO CEARÁ', width / 2, 38, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('SISTEMA IFCE IVENTUS - GERENCIAMENTO DE EVENTOS CIENTÍFICOS', width / 2, 44, { align: 'center' });

  // Main Certificate Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(15, 23, 42);
  doc.text('CERTIFICADO DE PARTICIPAÇÃO', width / 2, 62, { align: 'center' });

  // Divider Line
  doc.setDrawColor(22, 163, 74);
  doc.setLineWidth(1.2);
  doc.line(width / 2 - 45, 66, width / 2 + 45, 66);

  // Body text
  const nome = certificado.participante_nome || 'Participante';
  const matricula = certificado.participante_matricula ? `(Matrícula: ${certificado.participante_matricula})` : '';
  const evento = certificado.evento_titulo || 'Evento Científico do IFCE';
  const atividade = certificado.atividade_titulo ? `na atividade "${certificado.atividade_titulo}"` : 'nas atividades científicas';
  const cargaHoraria = certificado.carga_horaria || 20;
  const dataFormatada = certificado.data_evento || new Date(certificado.data_emissao).toLocaleDateString('pt-BR');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(51, 65, 85);
  doc.text('Certificamos para os devidos fins de direito que', width / 2, 80, { align: 'center' });

  // Participant Name highlight
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(21, 128, 61);
  doc.text(nome.toUpperCase(), width / 2, 94, { align: 'center' });

  // Text details
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(51, 65, 85);
  
  if (matricula) {
    doc.text(matricula, width / 2, 102, { align: 'center' });
  }

  const paragraph = `participou com êxito do evento acadêmico-científico "${evento}", atuando ${atividade}, realizado pelo Instituto Federal de Educação, Ciência e Tecnologia do Ceará (IFCE), perfazendo uma carga horária total comprovada de ${cargaHoraria} horas.`;

  const splitText = doc.splitTextToSize(paragraph, width - 60);
  doc.text(splitText, width / 2, 114, { align: 'center', lineHeightFactor: 1.4 });

  // Signatures Section
  const sigY = 155;
  const col1X = width * 0.3;
  const col2X = width * 0.7;

  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.5);
  doc.line(col1X - 35, sigY, col1X + 35, sigY);
  doc.line(col2X - 35, sigY, col2X + 35, sigY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(certificado.organizador_nome || 'Prof. Saulo Bezerra', col1X, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Coordenação Geral do Evento', col1X, sigY + 9, { align: 'center' });
  doc.text('IFCE - Campus Cedro', col1X, sigY + 13, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('Prof. Dr. José Olinda', col2X, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Diretoria de Pesquisa e Extensão', col2X, sigY + 9, { align: 'center' });
  doc.text('Instituto Federal do Ceará', col2X, sigY + 13, { align: 'center' });

  // Bottom Validation & Security Box
  const boxY = height - 28;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(20, boxY, width - 40, 14, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('CHAVE DE AUTENTICIDADE DIGITAL:', 25, boxY + 5);

  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(21, 128, 61);
  doc.text(certificado.codigo_validacao, 85, boxY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Data de Emissão: ${dataFormatada} | Registro em conformidade com o DIP/IFCE | Válido em todo o território nacional.`, 25, boxY + 10);

  // Trigger download
  const cleanTitle = (certificado.evento_titulo || 'Certificado').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`IFCE_Certificado_${cleanTitle}_${certificado.codigo_validacao.slice(0, 8)}.pdf`);
}
