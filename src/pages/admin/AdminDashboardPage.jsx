import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import { adminApi } from '../../api/adminApi'

const StatCard = ({ label, value, icon, color }) => (
  <div className="admin-stat-card">
    <div className="admin-stat-card__icon" style={{ background: color + '20' }}>
      <span style={{ color }}>{icon}</span>
    </div>
    <p className="admin-stat-card__label">{label}</p>
    <p className="admin-stat-card__value">{value ?? '—'}</p>
  </div>
)

const STATUS_BADGE = {
  pending: 'pending', confirmed: 'confirmed', processing: 'processing',
  shipped: 'shipped', delivered: 'delivered', cancelled: 'cancelled',
}

const formatRp = (n) =>
  'Rp ' + Number(n).toLocaleString('id-ID', { maximumFractionDigits: 0 })

const formatDate = (d) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [sumRes, ordRes] = await Promise.all([
          adminApi.getSummary(),
          adminApi.getOrders({ limit: 5, page: 1 }),
        ])
        setSummary(sumRes.data.data)
        setRecentOrders(ordRes.data.data?.data || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Selamat datang di panel admin Flocify</p>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Memuat data...</div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="admin-stat-grid">
            <StatCard
              label="Total Produk"
              value={summary?.total_products}
              color="#0273FF"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>}
            />
            <StatCard
              label="Total Pesanan"
              value={summary?.total_orders}
              color="#7C3AED"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>}
            />
            <StatCard
              label="Total User"
              value={summary?.total_users}
              color="#059669"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
            />
            <StatCard
              label="Total Revenue"
              value={formatRp(summary?.total_revenue || 0)}
              color="#F6AA17"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>}
            />
          </div>

          {/* Recent Orders */}
          <div className="admin-table-card">
            <div className="admin-table-card__header">
              <h2 className="admin-table-card__title">Pesanan Terbaru</h2>
              <Link to="/admin/orders" className="admin-btn admin-btn--ghost admin-btn--sm">
                Lihat Semua
              </Link>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Pembeli</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr><td colSpan={5} className="admin-empty">Belum ada pesanan</td></tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                          #{order.id.slice(-8).toUpperCase()}
                        </td>
                        <td>{order.profiles?.full_name || order.profiles?.username || '—'}</td>
                        <td>{formatRp(order.total_amount)}</td>
                        <td>
                          <span className={`admin-badge admin-badge--${STATUS_BADGE[order.status] || 'pending'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>{formatDate(order.created_at)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}
