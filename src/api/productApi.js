import api from './axios'

/**
 * Products API
 * Semua call ke /api/v1/products/*
 */
export const productApi = {
  /**
   * Ambil semua produk dengan filter, sort, pagination.
   * @param {Object} params
   * @param {string} [params.species]  - Comma-separated: 'Bluefin Tuna,Bigeye Tuna'
   * @param {string} [params.form]     - Comma-separated: 'Loin (Skin-on),Steak'
   * @param {string} [params.grade]    - Comma-separated: 'A+,A'
   * @param {string} [params.sort]     - 'newest' | 'price_asc' | 'price_desc'
   * @param {number} [params.page]     - Halaman (default: 1)
   * @param {number} [params.limit]    - Item per halaman (default: 12)
   * @param {string} [params.search]   - Keyword pencarian
   */
  getAll: (params = {}) =>
    api.get('/products', { params }),

  /** Ambil detail satu produk by ID */
  getById: (id) =>
    api.get(`/products/${id}`),
}
