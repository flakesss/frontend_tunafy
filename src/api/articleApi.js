import api from './axios'

/**
 * Public Article API — /api/v1/articles
 */
export const articleApi = {
  /**
   * Ambil semua artikel yang sudah published, difilter by lang.
   * @param {{ lang: 'id'|'en', page?: number, limit?: number, category?: string }} params
   */
  getAll: (params) => api.get('/articles', { params }),

  /**
   * Ambil satu artikel by slug + lang.
   * @param {string} slug
   * @param {'id'|'en'} lang
   */
  getBySlug: (slug, lang) => api.get(`/articles/${slug}`, { params: { lang } }),
}
