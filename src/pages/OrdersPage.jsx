import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Agentation } from 'agentation'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { orderApi } from '../api/orderApi'
import './OrdersPage.css'

const formatRupiah = (num) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)

// Helper to format kg with ton indicator
const formatKgWithTon = (kg) => {
  const tons = (kg / 1000).toFixed(1).replace(/\.0$/, '')
  return `${kg} kg (${tons} Ton)`
}

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

// Status badge config — labels now driven by i18next, handled in component
const STATUS_COLORS = {
  pending:    { color: '#6B7280', bg: '#F3F4F6' },
  confirmed:  { color: '#0273FF', bg: '#EFF6FF' },
  processing: { color: '#D97706', bg: '#FFFBEB' },
  shipped:    { color: '#7C3AED', bg: '#F5F3FF' },
  delivered:  { color: '#059669', bg: '#ECFDF5' },
  cancelled:  { color: '#DC2626', bg: '#FEF2F2' },
}

function StatusBadge({ status }) {
  const { t } = useTranslation()
  const cfg = STATUS_COLORS[status] || STATUS_COLORS.pending
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: 20,
      fontSize: '0.78rem',
      fontWeight: 700,
      fontFamily: 'Montserrat, sans-serif',
      color: cfg.color,
      background: cfg.bg,
      letterSpacing: '0.02em',
    }}>
      {t(`orders.status.${status}`, status)}
    </span>
  )
}

export default function OrdersPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await orderApi.getOrders()
      setOrders(res.data.data || [])
    } catch (err) {
      if (err.response?.status === 401) {
        setError(t('orders.loginRequired'))
      } else {
        setError(t('orders.loadError'))
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  useEffect(() => {
    document.body.style.backgroundColor = '#ffffff'
    document.documentElement.style.backgroundColor = '#ffffff'
    return () => {
      document.body.style.backgroundColor = ''
      document.documentElement.style.backgroundColor = ''
    }
  }, [])

  const handleCancel = async (orderId) => {
    if (!window.confirm(t('orders.cancelConfirm'))) return
    setCancellingId(orderId)
    try {
      await orderApi.cancelOrder(orderId)
      await fetchOrders()
    } catch (err) {
      alert(err.response?.data?.message || t('orders.cancelError'))
    } finally {
      setCancellingId(null)
    }
  }

  // ─── Loading state ───
  if (loading) {
    return (
      <>
        <Navbar scrollYProgress={null} contentRef={null} alwaysVisible />
        <main className="orders-page">
          <div className="orders-container">
            <div className="orders-empty"><p>{t('orders.loading')}</p></div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar scrollYProgress={null} contentRef={null} alwaysVisible />
      <main className="orders-page">
        <div className="orders-container">

          <header className="orders-header">
            <h1 className="orders-header__title">{t('orders.title')}</h1>
            <p className="orders-header__subtitle">
              {t('orders.subtitle')}
            </p>
          </header>

          {error ? (
            <div className="orders-empty">
              <p style={{ color: '#EF4444' }}>{error}</p>
              <button className="orders-btn orders-btn--primary" onClick={() => navigate('/login')}>
                {t('orders.loginNow')}
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="orders-empty">
              <div className="orders-empty__icon">
                <svg viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="32" fill="#F0F6FF"/>
                  <path d="M20 20h24v4H20zM20 28h24v16H20z" stroke="#0373FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <line x1="25" y1="33" x2="39" y2="33" stroke="#0373FF" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="25" y1="37" x2="33" y2="37" stroke="#0373FF" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h2 className="orders-empty__title">{t('orders.empty')}</h2>
              <p className="orders-empty__desc">{t('orders.emptyDesc')}</p>
              <button className="orders-btn orders-btn--primary" onClick={() => navigate('/marketplace')}>
                {t('orders.shopNow')}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {orders.map((order) => {
                const items = order.order_items || []
                const itemCount = items.reduce((s, i) => s + i.qty_kg, 0)
                return (
                  <div key={order.id} style={{
                    background: '#fff',
                    borderRadius: 16,
                    padding: '24px 28px',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
                    border: '1px solid #F1F5F9',
                  }}>
                    {/* Header row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.78rem', color: '#9CA3AF', marginBottom: 4, fontWeight: 500 }}>
                          {t('orders.orderNumber')}
                        </p>
                        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.85rem', fontWeight: 700, color: '#0273FF', letterSpacing: '0.03em' }}>
                          #{order.id.slice(-10).toUpperCase()}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <StatusBadge status={order.status} />
                        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.75rem', color: '#9CA3AF', marginTop: 6 }}>
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, background: '#F1F5F9', marginBottom: 16 }} />

                    {/* Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                      {items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{
                              background: '#EFF6FF', color: '#0273FF',
                              borderRadius: 8, padding: '3px 10px',
                              fontSize: '0.78rem', fontWeight: 700, fontFamily: 'Montserrat, sans-serif'
                            }}>
                              {formatKgWithTon(item.qty_kg)}
                            </span>
                            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: '#111827' }}>
                              {item.product_name}
                            </span>
                          </div>
                          <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem', color: '#374151' }}>
                            {formatRupiah(item.subtotal ?? item.price_per_kg * item.qty_kg)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                      <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.82rem', color: '#6B7280' }}>
                        {items.length} {t('orders.products')} · {itemCount} kg
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.75rem', color: '#9CA3AF' }}>{t('orders.total')}</p>
                          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#111827' }}>
                            {formatRupiah(order.total_amount)}
                          </p>
                        </div>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleCancel(order.id)}
                            disabled={cancellingId === order.id}
                            style={{
                              padding: '8px 18px', borderRadius: 10, border: '1.5px solid #EF4444',
                              background: '#fff', color: '#EF4444', cursor: 'pointer',
                              fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '0.82rem',
                              opacity: cancellingId === order.id ? 0.6 : 1,
                            }}
                          >
                            {cancellingId === order.id ? t('orders.cancelling') : t('orders.cancel')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <button className="orders-btn orders-btn--ghost" onClick={() => navigate('/marketplace')}>
              {t('orders.backToMarket')}
            </button>
          </div>
        </div>
      </main>
      <Footer />
      {import.meta.env.DEV && <Agentation />}
    </>
  )
}
