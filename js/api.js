/**
 * IFCE Iventus - Cliente de API RESTful
 * Comunicação direta com o backend Node/Express e banco db_eventos_ifce
 */

const TOKEN_KEY = 'ifce_iventus_token_jwt';

export const api = {
  getToken() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || token === 'undefined' || token === 'null' || token.trim() === '') {
      return null;
    }
    return token;
  },

  setToken(token) {
    if (token && token !== 'undefined' && token !== 'null') {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  getCurrentUserId() {
    try {
      const stored = localStorage.getItem('ifce_iventus_current_user_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.id || parsed.id_usuario || 1;
      }
    } catch (e) {}
    return 1;
  },

  async ensureSessionToken(userId) {
    if (this.getToken()) return this.getToken();
    try {
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId || this.getCurrentUserId() }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          this.setToken(data.token);
          return data.token;
        }
      }
    } catch (e) {
      // silencioso
    }
    return null;
  },

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    const currentUserId = this.getCurrentUserId();
    if (currentUserId) {
      headers['X-User-Id'] = String(currentUserId);
    }

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const res = await fetch(endpoint, config);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || `Erro HTTP ${res.status}: Falha na operação.`);
      }

      return data;
    } catch (err) {
      console.warn(`[API Notice] ${endpoint}:`, err.message || err);
      throw err;
    }
  },

  // --- Autenticação ---
  async login(email, password) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  },

  async register(userData) {
    const data = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  },

  async recoverPassword(email) {
    return this.request('/api/auth/recover', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token, newPassword, confirmPassword) {
    return this.request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword, confirmPassword }),
    });
  },

  async getMe() {
    return this.request('/api/auth/me');
  },

  async updateProfile(updates) {
    return this.request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async changePassword(currentPassword, newPassword, confirmNewPassword) {
    return this.request('/api/auth/profile/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
    });
  },

  // --- Eventos ---
  async getEvents(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set('search', params.search);
    if (params.status) searchParams.set('status', params.status);
    if (params.category) searchParams.set('category', params.category);
    if (params.organizerId) searchParams.set('organizerId', String(params.organizerId));

    const qs = searchParams.toString();
    const endpoint = `/api/events${qs ? `?${qs}` : ''}`;
    return this.request(endpoint);
  },

  async getEvent(id) {
    return this.request(`/api/events/${id}`);
  },

  async createEvent(eventData) {
    return this.request('/api/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  async updateEvent(id, updates) {
    return this.request(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async updateEventStatus(id, status) {
    return this.request(`/api/events/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async deleteEvent(id) {
    return this.request(`/api/events/${id}`, {
      method: 'DELETE',
    });
  },

  // --- Inscrições ---
  async getMyRegistrations() {
    return this.request('/api/registrations/my');
  },

  async getEventRegistrations(eventId) {
    return this.request(`/api/registrations/event/${eventId}`);
  },

  async enroll(eventId, activityId) {
    return this.request('/api/registrations', {
      method: 'POST',
      body: JSON.stringify({ eventId, activityId }),
    });
  },

  async cancelRegistration(registrationId) {
    return this.request(`/api/registrations/${registrationId}/cancel`, {
      method: 'POST',
    });
  },

  // --- Frequência & Certificados ---
  async setAttendance(registrationId, presente) {
    return this.request('/api/attendance/attendance', {
      method: 'POST',
      body: JSON.stringify({ registrationId, presente }),
    });
  },

  async getMyCertificates() {
    return this.request('/api/certificates/my');
  },

  async verifyCertificate(code) {
    return this.request(`/api/certificates/verify/${code}`);
  },

  // --- Uploads de Imagem & Banner ---
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const token = this.getToken();
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Erro ao realizar upload do arquivo.');
    }
    return data;
  },

  getExportCSVUrl(eventId) {
    return `/api/reports/participants/${eventId}/csv`;
  },
};
