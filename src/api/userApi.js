import api from './axios'

/**
 * User Profile API
 * Semua call ke /api/v1/users/*
 * (Membutuhkan token — auto-injected via axios interceptor)
 */
export const userApi = {
  /** Ambil profil user yang sedang login */
  getMe: () =>
    api.get('/users/me'),

  /**
   * Update profil user (full_name, phone, avatar_url, username).
   * @param {Object} data - Fields yang ingin diupdate
   */
  updateMe: (data) =>
    api.put('/users/me', data),
}
