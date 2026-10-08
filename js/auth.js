/**
 * IFCE Iventus - Módulo de Autenticação Real e Gestão de Usuários
 * Conexão com backend Node.js e banco MySQL db_eventos_ifce
 */

import { store } from './store.js';
import { api } from './api.js';
import { showToast } from './ui.js';

export const auth = {
  getCurrentUser() {
    return store.getCurrentUser();
  },

  isAuthenticated() {
    return !!store.getCurrentUser();
  },

  // RF02: O sistema deve permitir o login de usuários
  // Correção do Problema 01 do documento de testes:
  // Login REAL com validação rigorosa de hash e credenciais
  async login(identifier, password) {
    if (!identifier || !password) {
      throw new Error('Por favor, preencha o e-mail e a senha.');
    }

    try {
      const response = await api.login(identifier.trim(), password);
      const user = response.user;

      // Adapta campos para o padrão esperado pelo front
      const formattedUser = {
        id: user.id_usuario,
        id_usuario: user.id_usuario,
        name: user.nome,
        nome: user.nome,
        email: user.email,
        role: user.perfil.toLowerCase(),
        perfil: user.perfil,
        matricula: user.matricula || '',
        telefone: user.telefone || '',
        materias: user.materias || '',
        curso: user.matricula?.startsWith('2024') ? 'Informática S1' : 'Informática S6',
        campus: 'Campus Cedro - IFCE',
        avatar: user.foto_perfil || (user.perfil === 'PROFESSOR' ? '/assets/images/avatar-prof.svg' : '/assets/images/avatar-lais.svg'),
      };

      store.setCurrentUser(formattedUser);
      showToast(`Bem-vindo(a), ${formattedUser.name}!`, 'success');
      return formattedUser;
    } catch (err) {
      // Exibe a mensagem de erro exata do backend
      throw new Error(err.message || 'Erro ao realizar login.');
    }
  },

  // RF01: O sistema deve permitir o cadastro de usuários
  // Correção do Problema 02: Validação de duplicidade e integridade
  async register(userData) {
    if (!userData.name || !userData.email || !userData.password) {
      throw new Error('Todos os campos obrigatórios devem ser preenchidos.');
    }
    if (userData.password !== userData.confirmPassword) {
      throw new Error('A confirmação da senha não confere.');
    }
    if (userData.password.length < 6) {
      throw new Error('A senha deve possuir no mínimo 6 caracteres.');
    }

    try {
      const response = await api.register({
        nome: userData.name,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        matricula: userData.matricula,
        perfil: userData.role || 'participante',
      });

      const user = response.user;
      const formattedUser = {
        id: user.id_usuario,
        id_usuario: user.id_usuario,
        name: user.nome,
        nome: user.nome,
        email: user.email,
        role: user.perfil.toLowerCase(),
        perfil: user.perfil,
        matricula: user.matricula || '',
        telefone: user.telefone || '',
        materias: user.materias || '',
        curso: 'Informática S6',
        campus: 'Campus Cedro - IFCE',
        avatar: user.foto_perfil || '/assets/images/avatar-lais.svg',
      };

      store.setCurrentUser(formattedUser);
      showToast('Conta criada com sucesso no IFCE Iventus!', 'success');
      return formattedUser;
    } catch (err) {
      throw new Error(err.message || 'Erro ao cadastrar usuário.');
    }
  },

  logout() {
    api.setToken(null);
    store.setCurrentUser(null);
    showToast('Você saiu da sua conta com segurança.', 'info');
  },

  // RF03: O sistema deve permitir a recuperação de senha
  async recoverPassword(email) {
    if (!email || !email.includes('@')) {
      throw new Error('Informe um e-mail válido.');
    }
    const res = await api.recoverPassword(email);
    showToast(res.message || 'Instruções de recuperação enviadas para o e-mail.', 'success');
    return res;
  },

  async resetPassword(newPassword, confirmPassword) {
    if (!newPassword || newPassword.length < 6) {
      throw new Error('A nova senha deve ter no mínimo 6 caracteres.');
    }
    if (newPassword !== confirmPassword) {
      throw new Error('As senhas não coincidem.');
    }
    const res = await api.resetPassword(null, newPassword, confirmPassword);
    showToast('Sua senha foi redefinida com sucesso!', 'success');
    return res;
  },
};
