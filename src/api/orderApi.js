import api from './axios'

/**
 * Orders & Cart API
 * Semua call ke /api/v1/orders/*
 * (Semua endpoint membutuhkan token — auto-injected via axios interceptor)
 */
export const orderApi = {
  // ─── Cart ──────────────────────────────────────────────────────

  /** Ambil isi cart user yang sedang login */
  getCart: () =>
    api.get('/orders/cart'),

  /**
   * Tambah produk ke cart (atau update qty jika sudah ada).
   * @param {string} productId - UUID produk
   * @param {number} qtyKg - Jumlah dalam kg (min: 1)
   */
  addToCart: (productId, qtyKg) =>
    api.post('/orders/cart', { product_id: productId, qty_kg: qtyKg }),

  /**
   * Update qty item di cart.
   * @param {string} productId - UUID produk
   * @param {number} qtyKg - Qty baru
   */
  updateCartQty: (productId, qtyKg) =>
    api.put(`/orders/cart/${productId}`, { qty_kg: qtyKg }),

  /** Hapus item dari cart */
  removeFromCart: (productId) =>
    api.delete(`/orders/cart/${productId}`),

  // ─── Orders ────────────────────────────────────────────────────

  /**
   * Buat order dari cart (checkout).
   * @param {Object} shippingData - Data alamat pengiriman dari form checkout
   */
  createOrder: (shippingData) =>
    api.post('/orders', shippingData),

  /** Ambil riwayat semua order user */
  getOrders: () =>
    api.get('/orders'),

  /** Ambil detail satu order by ID */
  getOrderById: (id) =>
    api.get(`/orders/${id}`),

  /** Cancel order */
  cancelOrder: (id) =>
    api.put(`/orders/${id}/status`, { status: 'cancelled' }),
}
