/**
 * IFCE Iventus - Módulo de Perfil e Alteração de Senha
 * Conexão com backend e suporte a upload real de foto de perfil
 */

import { store } from './store.js';
import { api } from './api.js';
import { showToast } from './ui.js';

export const profileModule = {
  renderProfile() {
    const user = store.getCurrentUser();
    if (!user) return;

    // Atualiza cabeçalho visual do perfil
    const nameHeading = document.getElementById('profile-header-name');
    const roleHeading = document.getElementById('profile-header-role');
    const avatarImg = document.getElementById('profile-avatar-display');

    if (nameHeading) nameHeading.textContent = user.name || user.nome;
    if (roleHeading) {
      if (user.role === 'professor') {
        roleHeading.textContent = `${user.materias ? 'Matérias: ' + user.materias : 'Professor / Organizador'} • Campus Cedro`;
      } else {
        roleHeading.textContent = `${user.curso || 'Informática'} • Campus Cedro`;
      }
    }
    if (avatarImg) {
      avatarImg.src = user.avatar || user.foto_perfil || '/assets/images/avatar-lais.svg';
    }

    // Preenche os campos do formulário de dados pessoais
    const form = document.getElementById('form-personal-data');
    if (form) {
      const setVal = (name, val) => {
        const el = form.querySelector(`[name="${name}"]`);
        if (el) el.value = val || '';
      };

      setVal('name', user.name || user.nome);
      setVal('email', user.email);
      setVal('matricula', user.matricula);
      setVal('telefone', user.telefone);
      setVal('materias', user.materias);

      // Alterna exibição de Matrícula (Aluno) vs Responsável por Matérias (Professor) conforme Figma
      const fieldMatriculaWrap = document.getElementById('field-matricula-wrap');
      const fieldMateriasWrap = document.getElementById('field-materias-wrap');
      if (fieldMatriculaWrap && fieldMateriasWrap) {
        if (user.role === 'professor') {
          fieldMatriculaWrap.classList.add('hidden');
          fieldMateriasWrap.classList.remove('hidden');
        } else {
          fieldMatriculaWrap.classList.remove('hidden');
          fieldMateriasWrap.classList.add('hidden');
        }
      }
    }
  },

  async handleProfileSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const currentUser = store.getCurrentUser();
    if (!currentUser) return;

    const updatedData = {
      nome: form.querySelector('[name="name"]').value.trim(),
      email: form.querySelector('[name="email"]').value.trim(),
      matricula: form.querySelector('[name="matricula"]')?.value.trim() || null,
      telefone: form.querySelector('[name="telefone"]')?.value.trim() || null,
      materias: form.querySelector('[name="materias"]')?.value.trim() || null,
    };

    if (!updatedData.nome || !updatedData.email) {
      showToast('Nome completo e e-mail são obrigatórios.', 'error');
      return;
    }

    try {
      const res = await api.updateProfile(updatedData);
      store.setCurrentUser({
        ...currentUser,
        name: updatedData.nome,
        nome: updatedData.nome,
        email: updatedData.email,
        matricula: updatedData.matricula,
        telefone: updatedData.telefone,
        materias: updatedData.materias,
      });
      showToast('Dados cadastrais atualizados com sucesso no banco de dados!', 'success');
      this.renderProfile();
    } catch (err) {
      showToast(err.message || 'Erro ao atualizar dados do perfil.', 'error');
    }
  },

  async handlePhotoUpload(file) {
    if (!file) return;
    try {
      showToast('Enviando foto de perfil...', 'info');
      const uploadRes = await api.uploadFile(file);
      const newPhotoUrl = uploadRes.url;

      await api.updateProfile({ foto_perfil: newPhotoUrl });

      const currentUser = store.getCurrentUser();
      if (currentUser) {
        store.setCurrentUser({
          ...currentUser,
          avatar: newPhotoUrl,
          foto_perfil: newPhotoUrl,
        });
      }

      showToast('Foto de perfil alterada com sucesso!', 'success');
      this.renderProfile();
    } catch (err) {
      showToast(err.message || 'Falha ao enviar foto.', 'error');
    }
  },

  async handlePasswordSubmit(e) {
    e.preventDefault();
    const form = e.target;

    const currentPass = form.querySelector('[name="current_password"]').value;
    const newPass = form.querySelector('[name="new_password"]').value;
    const confirmPass = form.querySelector('[name="confirm_new_password"]').value;

    if (!currentPass || !newPass || !confirmPass) {
      showToast('Preencha a senha atual e a nova senha.', 'error');
      return;
    }

    if (newPass.length < 6) {
      showToast('A nova senha deve ter no mínimo 6 caracteres.', 'error');
      return;
    }

    if (newPass !== confirmPass) {
      showToast('A confirmação da nova senha não confere.', 'error');
      return;
    }

    try {
      await api.changePassword(currentPass, newPass, confirmPass);
      showToast('Senha alterada com sucesso no sistema!', 'success');
      form.reset();
    } catch (err) {
      showToast(err.message || 'Erro ao alterar senha.', 'error');
    }
  },
};
