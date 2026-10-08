/**
 * IFCE Iventus - Gerador e Baixador do Arquivo ZIP do Projeto
 * Permite ao avaliador baixar o código completo em um único arquivo .zip
 */

import { showToast } from './ui.js';

export function downloadProjectZip() {
  showToast('Preparando pacote do projeto completo (.zip)...', 'info');

  const a = document.createElement('a');
  a.href = '/projeto.zip';
  a.download = 'projeto-ifce-iventus.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => {
    showToast('Download do arquivo .zip iniciado!', 'success');
  }, 600);
}

window.downloadProjectZip = downloadProjectZip;
