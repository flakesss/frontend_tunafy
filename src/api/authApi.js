import api from './axios'

/**
 * Auth API — login, register, logout, availability checks.
 * Semua call ke /api/v1/auth/*
 */
export const authApi = {
  /** Login dengan email & password */
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  /** Register user baru */
  register: (data) =>
    api.post('/auth/register', data),

  /** Logout — invalidate session */
  logout: () =>
    api.post('/auth/logout'),

  /** Refresh access token */
  refresh: (refreshToken) =>
    api.post('/auth/refresh', { refresh_token: refreshToken }),

  /** Cek ketersediaan username secara real-time */
  checkUsername: (username) =>
    api.get('/auth/check-username', { params: { username } }),

  /** Cek ketersediaan nomor telepon secara real-time */
  checkPhone: (phone) =>
    api.get('/auth/check-phone', { params: { phone } }),

  /** Kirim email reset password */
  forgotPassword: (email) =>
    api.post('/auth/forgot-password', { email }),
}
