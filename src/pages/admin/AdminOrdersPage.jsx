import { useState, useEffect, useCallback } from 'react'
import AdminLayout from './AdminLayout'
import { adminApi } from '../../api/adminApi'

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

const formatRp = (n) => 'Rp ' + Number(n).toLocaleString('id-ID')
const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminApi.getOrders({ page, limit: 15, status: filterStatus || undefined })
      const { data, meta } = res.data.data
      setOrders(data || [])
      setMeta(meta || {})
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [page, filterStatus])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const handleStatusChange = async (orderId, status) => {
    try {
      await adminApi.updateOrderStatus(orderId, status)
      fetchOrders()
    } catch (e) { console.error(e) }
  }

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Pesanan</h1>
          <p className="admin-page-subtitle">{meta.total ?? 0} total pesanan</p>
        </div>
        <select
          className="admin-select"
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1) }}
        >
          <option value="">Semua Status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-card__header">
          <h2 className="admin-table-card__title">Daftar Pesanan</h2>
        </div>

        <div className="admin-table-wrapper">
          {loading ? (
            <div className="admin-loading">Memuat pesanan...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th><th>Pembeli</th><th>Items</th>
                  <th>Total</th><th>Status</th><th>Tanggal</th><th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={7} className="admin-empty">Tidak ada pesanan</td></tr>
                ) : (
                  orders.map((order) => (
                    <>
                      <tr key={order.id} style={{ cursor: 'pointer' }} onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                          #{order.id.slice(-8).toUpperCase()}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: '#111827' }}>{order.profiles?.full_name || '—'}</div>
                        </td>
                        <td>{order.order_items?.length || 0} item</td>
                        <td style={{ fontWeight: 600 }}>{formatRp(order.total_amount)}</td>
                        <td>
                          <span className={`admin-badge admin-badge--${order.status}`}>{order.status}</span>
                        </td>
                        <td>{formatDate(order.created_at)}</td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <select
                            className="admin-select"
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          >
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>

                      {/* Expanded row — alamat pengiriman + items */}
                      {expandedId === order.id && (
                        <tr key={order.id + '-detail'} style={{ background: '#F8FAFF' }}>
                          <td colSpan={7} style={{ padding: '16px 24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: '0.8rem' }}>
                              <div>
                                <p style={{ fontWeight: 700, marginBottom: 6 }}>Alamat Pengiriman</p>
                                <p style={{ color: '#374151', lineHeight: 1.6 }}>
                                  {order.shipping_address?.fullName} · {order.shipping_address?.phone}<br/>
                                  {order.shipping_address?.address}, {order.shipping_address?.city},<br/>
                                  {order.shipping_address?.province} {order.shipping_address?.postalCode}
                                </p>
                                {order.notes && <p style={{ marginTop: 6, color: '#6B7280' }}>Catatan: {order.notes}</p>}
                              </div>
                              <div>
                                <p style={{ fontWeight: 700, marginBottom: 6 }}>Item Pesanan</p>
                                {(order.order_items || []).map(item => (
                                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <span>{item.product_name} × {item.qty_kg} kg</span>
                                    <span>{formatRp(item.subtotal)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {meta.totalPages > 1 && (
          <div className="admin-pagination">
            <button className="admin-btn admin-btn--ghost admin-btn--sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>‹ Prev</button>
            <span>Halaman {page} / {meta.totalPages}</span>
            <button className="admin-btn admin-btn--ghost admin-btn--sm" disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)}>Next ›</button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
