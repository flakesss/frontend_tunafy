import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Agentation } from 'agentation'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { orderApi } from '../api/orderApi'
import './OrdersPage.css'

// Add Icon
const AddIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6V18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 12H18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Minus Icon
const MinusIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 12H18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const formatRupiah = (num) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)

// Helper to format kg with ton indicator
const formatKgWithTon = (kg) => {
  const tons = (kg / 1000).toFixed(1).replace(/\.0$/, '')
  return `${kg} kg (${tons} Ton)`
}

export default function CartPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchCart = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await orderApi.getCart()
      const items = (response.data.data || []).map((item) => ({
        id: item.product_id,
        cartItemId: item.id,
        image: item.products?.images?.[0] || '',
        name: item.products?.name || '-',
        location: item.products?.location || '-',
        grade: item.products?.grade || '-',
        type: item.products?.form || '-',
        species: item.products?.species || '-',
        pricePerKg: item.products?.price_per_kg || 0,
        minOrderKg: item.products?.min_order_kg || 1,
        stockKg: item.products?.stock_kg ?? 0,
        qty: item.qty_kg,
      }))
      setCart(items)
    } catch (err) {
      if (err.response?.status === 401) {
        setError(t('cart.loginRequired'))
      } else {
        setError(t('cart.loadError'))
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCart() }, [fetchCart])

  useEffect(() => {
    document.body.style.backgroundColor = '#ffffff'
    document.documentElement.style.backgroundColor = '#ffffff'
    return () => {
      document.body.style.backgroundColor = ''
      document.documentElement.style.backgroundColor = ''
    }
  }, [])

  const updateQty = async (productId, delta, currentQty, minOrder = 1) => {
    const newQty = Math.min(100000, Math.max(minOrder, currentQty + delta))
    setCart(prev => prev.map(item => item.id === productId ? { ...item, qty: newQty } : item))
    try {
      await orderApi.updateCartQty(productId, newQty)
    } catch {
      fetchCart()
    }
  }

  const removeItem = async (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId))
    try {
      await orderApi.removeFromCart(productId)
    } catch {
      fetchCart()
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + item.pricePerKg * item.qty, 0)
  const totalKg = cart.reduce((sum, item) => sum + item.qty, 0)

  // Cek apakah ada item yang stoknya tidak mencukupi
  const unavailableItems = cart.filter(item => item.stockKg <= 0)
  const insufficientStockItems = cart.filter(item => item.stockKg > 0 && item.qty > item.stockKg)
  const hasStockIssues = unavailableItems.length > 0 || insufficientStockItems.length > 0

  // Helper untuk cek status stok item
  const getStockStatus = (item) => {
    if (item.stockKg <= 0) return 'out'
    if (item.qty > item.stockKg) return 'insufficient'
    return 'available'
  }

  if (loading) {
    return (
      <>
        <Navbar scrollYProgress={null} contentRef={null} alwaysVisible />
        <main className="orders-page">
          <div className="orders-container">
            <div className="orders-empty"><p>{t('cart.loading')}</p></div>
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
            <h1 className="orders-header__title">{t('cart.title')}</h1>
            <p className="orders-header__subtitle">
              {t('cart.subtitle')}
            </p>
          </header>

          {error ? (
            <div className="orders-empty">
              <p style={{ color: '#EF4444' }}>{error}</p>
              <button className="orders-btn orders-btn--primary" onClick={() => navigate('/login')}>
                {t('cart.loginNow')}
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="orders-empty">
              <div className="orders-empty__icon">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="32" r="32" fill="#F0F6FF"/>
                  <path d="M20 22h3l4 18h18l3-12H23" stroke="#0373FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="29" cy="44" r="2" fill="#0373FF"/>
                  <circle cx="39" cy="44" r="2" fill="#0373FF"/>
                </svg>
              </div>
              <h2 className="orders-empty__title">{t('cart.empty')}</h2>
              <p className="orders-empty__desc">{t('cart.emptyDesc')}</p>
              <button className="orders-btn orders-btn--primary" onClick={() => navigate('/marketplace')}>
                {t('cart.exploreMarket')}
              </button>
            </div>
          ) : (
            <div className="orders-layout">
              {/* Left: Cart Items */}
              <div className="orders-items">
                <div className="orders-items__header">
                  <span>{cart.length} {t('cart.products')}</span>
                   <span>{formatKgWithTon(totalKg)} {t('cart.total')}</span>
                </div>

                {cart.map(item => {
                  const stockStatus = getStockStatus(item)
                  const isUnavailable = stockStatus === 'out'
                  const isInsufficient = stockStatus === 'insufficient'
                  const hasBanner = isUnavailable || isInsufficient
                  
                  return (
                  <div key={item.id} className={`orders-card ${isUnavailable ? 'orders-card--unavailable' : ''} ${isInsufficient ? 'orders-card--insufficient' : ''} ${hasBanner ? 'orders-card--has-banner' : ''}`}>
                    {/* Stock Warning Banner */}
                    {isUnavailable && (
                      <div className="orders-card__stock-banner orders-card__stock-banner--out">
                        {t('cart.stockOut')}
                      </div>
                    )}
                    {isInsufficient && (
                      <div className="orders-card__stock-banner orders-card__stock-banner--insufficient">
                        {t('cart.stockInsufficient')} {item.stockKg} kg, {t('cart.inCart')} {item.qty} kg
                      </div>
                    )}
                    
                    <div className="orders-card__img-wrap">
                      <img src={item.image} alt={item.name} className="orders-card__img" />
                      {isUnavailable && <div className="orders-card__img-overlay" />}
                    </div>

                    <div className="orders-card__info">
                      <div className="orders-card__tags">
                        <span className="orders-tag">{item.species}</span>
                        <span className="orders-tag">{item.type}</span>
                        <span className="orders-tag orders-tag--grade">Grade {item.grade}</span>
                      </div>
                      <h3 className="orders-card__name">{item.name}</h3>
                      <p className="orders-card__location">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6C3.5 9.25 8 14.5 8 14.5C8 14.5 12.5 9.25 12.5 6C12.5 3.515 10.485 1.5 8 1.5ZM8 7.75C7.034 7.75 6.25 6.966 6.25 6C6.25 5.034 7.034 4.25 8 4.25C8.966 4.25 9.75 5.034 9.75 6C9.75 6.966 8.966 7.75 8 7.75Z" fill="#0273FF"/>
                        </svg>
                        {item.location}
                      </p>
                      <p className="orders-card__price-per-kg">{formatRupiah(item.pricePerKg)} / kg</p>
                      <p className={`orders-card__stock ${isUnavailable ? 'orders-card__stock--out' : isInsufficient ? 'orders-card__stock--insufficient' : ''}`}>
                        {t('cart.stock')} {item.stockKg <= 0 ? t('cart.stockEmpty') : `${item.stockKg} kg`}
                      </p>
                    </div>

                    <div className="orders-card__actions">
                      <div className="orders-qty">
                        <button
                          className="orders-qty__btn"
                          onClick={() => updateQty(item.id, -1, item.qty, item.minOrderKg)}
                          disabled={item.qty <= item.minOrderKg || isUnavailable}
                        >
                          <MinusIcon />
                        </button>
                        <div className="orders-qty__input-wrapper">
                          <input
                            type="number"
                            className="orders-qty__input"
                            value={item.qty}
                            onChange={async (e) => {
                              const value = parseInt(e.target.value, 10)
                              const minOrder = item.minOrderKg || 1
                              if (!isNaN(value) && value >= minOrder && value <= 100000) {
                                setCart(prev => prev.map(i => i.id === item.id ? { ...i, qty: value } : i))
                                try {
                                  await orderApi.updateCartQty(item.id, value)
                                } catch {
                                  fetchCart()
                                }
                              }
                            }}
                            min={item.minOrderKg || 1}
                            max={item.stockKg || 100000}
                            disabled={isUnavailable}
                          />
                          <span className="orders-qty__unit">kg</span>
                        </div>
                        <button
                          className="orders-qty__btn"
                          onClick={() => updateQty(item.id, +1, item.qty, item.minOrderKg)}
                          disabled={item.qty >= item.stockKg || isUnavailable}
                        >
                          <AddIcon />
                        </button>
                      </div>
                      <p className="orders-card__subtotal">{formatRupiah(item.pricePerKg * item.qty)}</p>
                      <button className="orders-card__remove" onClick={() => removeItem(item.id)} title="Hapus item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14H6L5 6"/>
                          <path d="M10 11v6M14 11v6"/>
                          <path d="M9 6V4h6v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  )
                })}

                <button className="orders-btn orders-btn--ghost" onClick={() => navigate('/marketplace')}>
                  {t('cart.backToMarket')}
                </button>
              </div>

              {/* Right: Order Summary */}
              <aside className="orders-summary">
                <h2 className="orders-summary__title">{t('cart.orderSummary')}</h2>

                <div className="orders-summary__rows">
                  {cart.map(item => (
                    <div key={item.id} className="orders-summary__row">
                      <div className="orders-summary__item-info">
                        <span className="orders-summary__item-name">{item.name}</span>
                        <span className="orders-summary__item-qty">{formatKgWithTon(item.qty)}</span>
                      </div>
                      <span className="orders-summary__row-val">{formatRupiah(item.pricePerKg * item.qty)}</span>
                    </div>
                  ))}
                </div>

                <div className="orders-summary__divider" />

                <div className="orders-summary__row orders-summary__row--total">
                  <span>{t('cart.orderTotal')}</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>

                {hasStockIssues && (
                  <div className="orders-summary__stock-warning">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <div>
                      {unavailableItems.length > 0 && (
                        <p>{unavailableItems.length} {t('cart.stockWarningOut')}</p>
                      )}
                      {insufficientStockItems.length > 0 && (
                        <p>{insufficientStockItems.length} {t('cart.stockWarningInsufficient')}</p>
                      )}
                    </div>
                  </div>
                )}

                <button
                  className="orders-btn orders-btn--primary orders-summary__cta"
                  onClick={() => navigate('/checkout', { state: { cart, subtotal, total: subtotal } })}
                  disabled={hasStockIssues}
                  style={{ opacity: hasStockIssues ? 0.5 : 1, cursor: hasStockIssues ? 'not-allowed' : 'pointer' }}
                >
                  {t('cart.checkout')}
                </button>

                <p className="orders-summary__note">
                  {t('cart.priceNote')}
                </p>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
      {import.meta.env.DEV && <Agentation />}
    </>
  )
}
