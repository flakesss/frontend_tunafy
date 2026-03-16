import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Agentation } from 'agentation'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { orderApi } from '../api/orderApi'
import './CheckoutPage.css'

// Arrow Right Icon per ProductDetailPage design
const ArrowRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 10L12 14L16 10"
      stroke="#292D32"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="rotate(-90 12 12)"
    />
  </svg>
)

const formatRupiah = (num) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)

const PROVINCES = [
  'Aceh', 'Bali', 'Banten', 'Bengkulu', 'DI Yogyakarta', 'DKI Jakarta',
  'Gorontalo', 'Jambi', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur',
  'Kalimantan Barat', 'Kalimantan Selatan', 'Kalimantan Tengah', 'Kalimantan Timur', 'Kalimantan Utara',
  'Kepulauan Bangka Belitung', 'Kepulauan Riau', 'Lampung', 'Maluku', 'Maluku Utara',
  'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Papua', 'Papua Barat',
  'Riau', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tengah', 'Sulawesi Tenggara', 'Sulawesi Utara',
  'Sumatera Barat', 'Sumatera Selatan', 'Sumatera Utara',
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  // Ambil data dari Orders page, fallback ke dummy
  const orderData = location.state || {
    cart: [{ name: 'Bluefin Loin', qty: 5, pricePerKg: 24000 }],
    subtotal: 120000,
    total: 120000,
  }

  const [form, setForm] = useState({
    fullName: '', phone: '', email: '',
    address: '', city: '', province: '', postalCode: '',
    notes: '',
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState(null)

  useEffect(() => {
    document.body.style.backgroundColor = '#ffffff'
    document.documentElement.style.backgroundColor = '#ffffff'
    return () => {
      document.body.style.backgroundColor = ''
      document.documentElement.style.backgroundColor = ''
    }
  }, [])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = t('checkout.validation.fullName')
    if (!form.phone.trim()) e.phone = t('checkout.validation.phone')
    else if (!/^(\+62|62|0)[0-9]{8,12}$/.test(form.phone.replace(/\s/g, ''))) e.phone = t('checkout.validation.phoneFormat')
    if (!form.email.trim()) e.email = t('checkout.validation.email')
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = t('checkout.validation.emailFormat')
    if (!form.address.trim()) e.address = t('checkout.validation.address')
    if (!form.city.trim()) e.city = t('checkout.validation.city')
    if (!form.province) e.province = t('checkout.validation.province')
    if (!form.postalCode.trim()) e.postalCode = t('checkout.validation.postalCode')
    else if (!/^\d{5}$/.test(form.postalCode)) e.postalCode = t('checkout.validation.postalCodeFormat')
    return e
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      const firstErrEl = document.querySelector('.checkout-field--error')
      if (firstErrEl) firstErrEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setLoading(true)
    try {
      // Kirim data alamat + catatan ke backend untuk create order dari cart
      const shippingData = {
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        address: form.address,
        city: form.city,
        province: form.province,
        postalCode: form.postalCode,
        notes: form.notes || null,
      }
      const response = await orderApi.createOrder(shippingData)
      setOrderId(response.data?.data?.id || null)
      setSubmitted(true)
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Gagal membuat pesanan. Silakan coba lagi.'
      setErrors({ _global: msg })
    } finally {
      setLoading(false)
    }
  }

  // ─── Success State ───
  if (submitted) {
    return (
      <>
        <Navbar scrollYProgress={null} contentRef={null} alwaysVisible />
        <main className="checkout-page">
          <div className="checkout-container checkout-container--center">
            <div className="checkout-success">
              <div className="checkout-success__icon">
                <svg viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="40" fill="#ECFDF5"/>
                  <path d="M24 40l12 12L56 28" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="checkout-success__title">{t('checkout.successTitle')}</h1>
              <p className="checkout-success__desc">
                {t('checkout.successDesc', { name: form.fullName, phone: form.phone })}
              </p>
              <div className="checkout-success__order-id">
                {t('checkout.orderNo')} <strong>#{orderId ? orderId.slice(-8).toUpperCase() : Date.now().toString().slice(-8)}</strong>
              </div>
              <div className="checkout-success__btns">
                <button className="checkout-btn checkout-btn--primary" onClick={() => navigate('/marketplace')}>
                  {t('checkout.backToMarket')}
                </button>
                <button className="checkout-btn checkout-btn--ghost" onClick={() => navigate('/about')}>
                  {t('checkout.viewCart')}
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // ─── Main Form ───
  return (
    <>
      <Navbar scrollYProgress={null} contentRef={null} alwaysVisible />
      <main className="checkout-page">
        <div className="checkout-container">
          <header className="checkout-header">
            <nav className="checkout-breadcrumb">
              <Link to="/about" className="checkout-breadcrumb-link">
                {t('checkout.breadcrumbCart')}
              </Link>
              <ArrowRightIcon />
              <span className="checkout-breadcrumb-current">{t('checkout.title')}</span>
            </nav>
            <h1 className="checkout-header__title">{t('checkout.title')}</h1>
            <p className="checkout-header__subtitle">{t('checkout.subtitle')}</p>
          </header>

          <div className="checkout-layout">
            {/* ─── Form (kiri) ─── */}
            <form className="checkout-form" onSubmit={onSubmit} noValidate>

              {/* Seksi 1: Data Pembeli */}
              <section className="checkout-section">
                <h2 className="checkout-section__title">
                  <span className="checkout-section__num">1</span>
                  {t('checkout.section1')}
                </h2>
                <div className="checkout-fields">
                  <div className={`checkout-field ${errors.fullName ? 'checkout-field--error' : ''}`}>
                    <label className="checkout-label">{t('checkout.fullName')} <span>*</span></label>
                    <input
                      className="checkout-input"
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={onChange}
                      placeholder={t('checkout.namePlaceholder')}
                    />
                    {errors.fullName && <p className="checkout-error-msg">{errors.fullName}</p>}
                  </div>

                  <div className="checkout-fields-row">
                    <div className={`checkout-field ${errors.phone ? 'checkout-field--error' : ''}`}>
                      <label className="checkout-label">{t('checkout.phone')} <span>*</span></label>
                      <input
                        className="checkout-input"
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={onChange}
                        placeholder="081234567890"
                      />
                      {errors.phone && <p className="checkout-error-msg">{errors.phone}</p>}
                    </div>
                    <div className={`checkout-field ${errors.email ? 'checkout-field--error' : ''}`}>
                      <label className="checkout-label">{t('checkout.email')} <span>*</span></label>
                      <input
                        className="checkout-input"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="email@contoh.com"
                      />
                      {errors.email && <p className="checkout-error-msg">{errors.email}</p>}
                    </div>
                  </div>
                </div>
              </section>

              {/* Seksi 2: Alamat Pengiriman */}
              <section className="checkout-section">
                <h2 className="checkout-section__title">
                  <span className="checkout-section__num">2</span>
                  {t('checkout.section2')}
                </h2>
                <div className="checkout-fields">
                  <div className={`checkout-field ${errors.address ? 'checkout-field--error' : ''}`}>
                    <label className="checkout-label">{t('checkout.address')} <span>*</span></label>
                    <textarea
                      className="checkout-input checkout-textarea"
                      name="address"
                      value={form.address}
                      onChange={onChange}
                      placeholder={t('checkout.addressPlaceholder')}
                      rows={3}
                    />
                    {errors.address && <p className="checkout-error-msg">{errors.address}</p>}
                  </div>

                  <div className="checkout-fields-row">
                    <div className={`checkout-field ${errors.city ? 'checkout-field--error' : ''}`}>
                      <label className="checkout-label">{t('checkout.city')} <span>*</span></label>
                      <input
                        className="checkout-input"
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={onChange}
                        placeholder={t('checkout.cityPlaceholder')}
                      />
                      {errors.city && <p className="checkout-error-msg">{errors.city}</p>}
                    </div>
                    <div className={`checkout-field ${errors.postalCode ? 'checkout-field--error' : ''}`}>
                      <label className="checkout-label">{t('checkout.postalCode')} <span>*</span></label>
                      <input
                        className="checkout-input"
                        type="text"
                        name="postalCode"
                        value={form.postalCode}
                        onChange={onChange}
                        placeholder="12345"
                        maxLength={5}
                      />
                      {errors.postalCode && <p className="checkout-error-msg">{errors.postalCode}</p>}
                    </div>
                  </div>

                  <div className={`checkout-field ${errors.province ? 'checkout-field--error' : ''}`}>
                    <label className="checkout-label">{t('checkout.province')} <span>*</span></label>
                    <select
                      className="checkout-input checkout-select"
                      name="province"
                      value={form.province}
                      onChange={onChange}
                    >
                      <option value="">{t('checkout.selectProvince')}</option>
                      {PROVINCES.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    {errors.province && <p className="checkout-error-msg">{errors.province}</p>}
                  </div>

                  <div className="checkout-field">
                    <label className="checkout-label">{t('checkout.notes')} <span className="checkout-label--opt">{t('checkout.notesOptional')}</span></label>
                    <textarea
                      className="checkout-input checkout-textarea"
                      name="notes"
                      value={form.notes}
                      onChange={onChange}
                      placeholder={t('checkout.notesPH')}
                      rows={2}
                    />
                  </div>
                </div>
              </section>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="checkout-btn checkout-btn--primary checkout-btn--submit"
              >
                {loading ? (
                  <>
                    <span className="checkout-spinner" />
                    {t('checkout.processing')}
                  </>
                ) : (
                  t('checkout.confirm')
                )}
              </button>
            </form>

            {/* ─── Order Summary (kanan) ─── */}
            <aside className="checkout-summary">
              <h2 className="checkout-summary__title">{t('checkout.orderSummary')}</h2>

              <div className="checkout-summary__items">
                {orderData.cart.map((item, i) => (
                  <div key={i} className="checkout-summary__item">
                    <div className="checkout-summary__item-left">
                      <span className="checkout-summary__qty-badge">{item.qty}kg</span>
                      <span className="checkout-summary__item-name">{item.name}</span>
                    </div>
                    <span className="checkout-summary__item-price">
                      {formatRupiah(item.pricePerKg * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="checkout-summary__divider" />

              <div className="checkout-summary__row checkout-summary__row--total">
                <span>{t('checkout.total')}</span>
                <span>{formatRupiah(orderData.subtotal)}</span>
              </div>

              <div className="checkout-summary__info">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0373FF" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{t('checkout.priceNote')}</span>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
      {import.meta.env.DEV && <Agentation />}
    </>
  )
}
