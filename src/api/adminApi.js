import api from './axios'

/**
 * Admin API — semua call ke /api/v1/admin/*
 * Membutuhkan token dengan role admin/seller
 */
export const adminApi = {
  // Dashboard
  getSummary:           ()             => api.get('/admin/summary'),

  // Users
  getUsers:             (params)       => api.get('/admin/users', { params }),
  updateUserRole:       (id, role)     => api.put(`/admin/users/${id}/role`, { role }),

  // Products
  getProducts:          (params)       => api.get('/admin/products', { params }),
  uploadProductImages:  (formData)     => api.post('/admin/products/upload-images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  createProduct:        (data)         => api.post('/admin/products', data),
  updateProduct:        (id, data)     => api.put(`/admin/products/${id}`, data),
  deleteProduct:        (id)           => api.delete(`/admin/products/${id}`),

  // Orders
  getOrders:            (params)       => api.get('/admin/orders', { params }),
  updateOrderStatus:    (id, status)   => api.put(`/admin/orders/${id}/status`, { status }),

  // Payments
  verifyPayment:        (id, status)   => api.put(`/admin/payments/${id}/verify`, { status }),

  // Articles (Blog)
  getArticles:          (params)       => api.get('/admin/articles', { params }),
  createArticle:        (data)         => api.post('/admin/articles', data),
  updateArticle:        (id, data)     => api.put(`/admin/articles/${id}`, data),
  deleteArticle:        (id)           => api.delete(`/admin/articles/${id}`),
  togglePublishArticle: (id)           => api.patch(`/admin/articles/${id}/publish`),
}
