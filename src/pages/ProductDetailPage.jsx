import { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Agentation } from 'agentation'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { productApi } from '../api/productApi'
import { orderApi } from '../api/orderApi'
import './ProductDetailPage.css'

// Helper to format kg with ton indicator
const formatKgWithTon = (kg) => {
  const tons = (kg / 1000).toFixed(1).replace(/\.0$/, '')
  return `${kg} Kg (${tons} Ton)`
}

// Arrow Right Icon
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

// Star Icon
const StarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2L14.09 8.26L21 9.27L16 13.97L17.18 20.84L12 17.77L6.82 20.84L8 13.97L3 9.27L9.91 8.26L12 2Z"
      fill="#F6AA17"
    />
  </svg>
)

// Chevron Left Icon
const ChevronLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6"/>
  </svg>
)

// Chevron Right Icon
const ChevronRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
)

// Add Icon
const AddIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6V18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 12H18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Location Icon
const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="#000F1E" strokeWidth="1.5" />
    <path d="M3.62001 8.49C5.59001 -0.169998 18.42 -0.159997 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39001 20.54C5.63001 17.88 2.47001 13.57 3.62001 8.49Z" stroke="#000F1E" strokeWidth="1.5" />
  </svg>
)

// Minus Icon
const MinusIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 12H18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Cart Icon (untuk tombol Cart - sama seperti di ProductCard)
const CartIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2 2H3.74001C4.82001 2 5.67 2.93 5.58 4L4.75 13.96C4.61 15.59 5.89999 16.99 7.53999 16.99H18.19C19.63 16.99 20.89 15.81 21 14.38L21.54 6.88C21.66 5.22 20.4 3.87 18.73 3.87H5.82001"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.25 22C16.9404 22 17.5 21.4404 17.5 20.75C17.5 20.0596 16.9404 19.5 16.25 19.5C15.5596 19.5 15 20.0596 15 20.75C15 21.4404 15.5596 22 16.25 22Z"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.25 22C8.94036 22 9.5 21.4404 9.5 20.75C9.5 20.0596 8.94036 19.5 8.25 19.5C7.55964 19.5 7 20.0596 7 20.75C7 21.4404 7.55964 22 8.25 22Z"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 8H21"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// Order Icon (untuk tombol Order Now - plus sign)
const OrderIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19" stroke="#F6AA17" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 12H19" stroke="#F6AA17" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const PLACEHOLDER_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect fill="%23F1F5F9" width="400" height="400"/><text fill="%23CBD5E1" font-family="sans-serif" font-size="18" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle">No Image</text></svg>'

// Close Icon
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
)

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('pengiriman')
  const pengirimanRef = useRef(null)
  const detailRef = useRef(null)
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, transform: 'translateX(0px)' })
  const [isUnderlineReady, setIsUnderlineReady] = useState(false)

  // Function to measure underline position
  const measureUnderline = () => {
    const activeRef = activeTab === 'pengiriman' ? pengirimanRef.current : detailRef.current
    if (activeRef) {
      setUnderlineStyle({
        width: activeRef.offsetWidth,
        transform: `translateX(${activeRef.offsetLeft}px)`
      })
      setIsUnderlineReady(true)
    }
  }

  // Use useLayoutEffect for synchronous measurement after DOM updates
  useLayoutEffect(() => {
    measureUnderline()
  }, [activeTab, t])

  // Additional useEffect for delayed measurement to ensure fonts/images are loaded
  useEffect(() => {
    // Multiple delayed measurements to catch different rendering stages
    const timers = [
      setTimeout(measureUnderline, 0),
      setTimeout(measureUnderline, 50),
      setTimeout(measureUnderline, 100),
      setTimeout(measureUnderline, 200),
      setTimeout(measureUnderline, 500) // After fonts loaded
    ]

    // Re-measure on window resize
    window.addEventListener('resize', measureUnderline)

    return () => {
      timers.forEach(timer => clearTimeout(timer))
      window.removeEventListener('resize', measureUnderline)
    }
  }, [activeTab, t])
  const [cartLoading, setCartLoading] = useState(false)
  const [cartToast, setCartToast] = useState(null)
  
  // State for mobile drawer bottom sheet
  const [mobileDrawerState, setMobileDrawerState] = useState({ open: false, action: null }) // { type: 'success'|'error', message: string }

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const res = await productApi.getById(id)
        // ApiResponse format: { success: true, data: <product> }
        const payload = res.data?.data
        setProduct(payload)
        // Set default quantity ke min_order_kg jika ada
        if (payload?.min_order_kg) setQuantity(payload.min_order_kg)
      } catch (e) {
        console.error('Failed to fetch product:', e)
        setFetchError(t('productDetail.error'))
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  // Paksa body background putih saat di halaman ini
  useEffect(() => {
    const prev = document.body.style.backgroundColor
    document.body.style.backgroundColor = '#ffffff'
    document.documentElement.style.backgroundColor = '#ffffff'
    return () => {
      document.body.style.backgroundColor = prev
      document.documentElement.style.backgroundColor = ''
    }
  }, [])

  // Derived values — aman karena product bisa null saat loading
  const images = product?.images?.length ? product.images : [PLACEHOLDER_IMAGE]
  const formattedPrice = product?.price_per_kg?.toLocaleString('id-ID') ?? '0'
  const subtotal = (product?.price_per_kg ?? 0) * (parseInt(quantity, 10) || 0)
  const formattedSubtotal = subtotal.toLocaleString('id-ID')

  const handlePrevImage = () =>
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))

  const handleNextImage = () =>
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))

  const handleQuantityChange = (delta) => {
    const min = product?.min_order_kg ?? 1
    const max = product?.stock_kg ?? 100000
    const currentQty = parseInt(quantity, 10) || min
    const newQty = Math.min(max, Math.max(min, currentQty + delta))
    setQuantity(newQty)
  }

  const handleQuantityInput = (e) => {
    const val = e.target.value
    if (val === '') {
      setQuantity('')
      return
    }
    const num = parseInt(val, 10)
    if (!isNaN(num)) {
      setQuantity(num)
    }
  }

  const handleQuantityBlur = () => {
    const min = product?.min_order_kg ?? 1
    const max = product?.stock_kg ?? 100000
    let value = parseInt(quantity, 10)
    if (isNaN(value) || value < min) {
      setQuantity(min)
    } else if (value > max) {
      setQuantity(max)
    } else {
      setQuantity(value)
    }
  }

  const showToast = (type, message) => {
    setCartToast({ type, message })
    setTimeout(() => setCartToast(null), 3000)
  }

  const handleAddToCart = async () => {
    const min = product?.min_order_kg ?? 1
    const max = product?.stock_kg ?? 100000
    let qty = parseInt(quantity, 10)
    if (isNaN(qty) || qty < min) qty = min
    else if (qty > max) qty = max

    if (qty !== quantity) setQuantity(qty)

    setCartLoading(true)
    try {
      await orderApi.addToCart(product.id, qty)
      showToast('success', t('productDetail.toastSuccess'))
    } catch (e) {
      if (e.response?.status === 401) {
        showToast('error', t('productDetail.toastLoginRequired'))
        setTimeout(() => navigate('/login'), 1200)
      } else {
        showToast('error', e.response?.data?.message || t('productDetail.toastCartError'))
      }
    } finally {
      setCartLoading(false)
    }
  }

  const handleOrderNow = async () => {
    const min = product?.min_order_kg ?? 1
    const max = product?.stock_kg ?? 100000
    let qty = parseInt(quantity, 10)
    if (isNaN(qty) || qty < min) qty = min
    else if (qty > max) qty = max

    if (qty !== quantity) setQuantity(qty)

    setCartLoading(true)
    try {
      await orderApi.addToCart(product.id, qty)
      navigate('/about')
    } catch (e) {
      if (e.response?.status === 401) {
        showToast('error', t('productDetail.toastLoginRequired'))
        setTimeout(() => navigate('/login'), 1200)
      } else {
        showToast('error', e.response?.data?.message || t('productDetail.toastOrderError'))
      }
    } finally {
      setCartLoading(false)
    }
  }

  const handleActionClick = (actionType) => {
    // Di mobile, klik pertama buka drawer
    if (window.innerWidth <= 900 && !mobileDrawerState.open) {
      setMobileDrawerState({ open: true, action: actionType })
      return
    }

    // Jika desktop ATAU laci (drawer) sudah terbuka, jalankan aksi sesungguhnya
    if (actionType === 'cart') {
      handleAddToCart()
    } else {
      handleOrderNow()
    }

    // Tutup laci setelah berhasil ditekan
    if (window.innerWidth <= 900) {
      setMobileDrawerState({ open: false, action: null })
    }
  }

  // ─── Loading state ───────────────────────────────────────────
  if (loading) {
    return (
      <>
        <Navbar scrollYProgress={null} contentRef={null} alwaysVisible />
        <main className="product-detail-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <p style={{ color: '#6B7280', fontFamily: 'Montserrat, sans-serif' }}>{t('productDetail.loading')}</p>
        </main>
        <Footer />
      </>
    )
  }

  // ─── Error state ─────────────────────────────────────────────
  if (fetchError || !product) {
    return (
      <>
        <Navbar scrollYProgress={null} contentRef={null} alwaysVisible />
        <main className="product-detail-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
          <p style={{ color: '#EF4444', fontFamily: 'Montserrat, sans-serif' }}>{fetchError || t('productDetail.notFound')}</p>
          <Link to="/marketplace" style={{ color: '#0273FF', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>{t('productDetail.backToMarket')}</Link>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar scrollYProgress={null} contentRef={null} alwaysVisible />

      <main className="product-detail-page">
        {/* Breadcrumb Navigation */}
        <nav className="product-breadcrumb">
          <Link to="/marketplace" className="breadcrumb-link">{t('nav.marketplace')}</Link>
          <ArrowRightIcon />
          <span className="breadcrumb-item breadcrumb-current">{product.name}</span>
        </nav>

        <div className="product-detail-content">
          {/* Product Gallery Section */}
          <div className="product-gallery">
            {/* Main Image */}
            <div className="product-gallery__main">
              <button className="product-gallery__nav product-gallery__nav--left" onClick={handlePrevImage}>
                <ChevronLeftIcon />
              </button>
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="product-gallery__main-image"
              />
              <button className="product-gallery__nav product-gallery__nav--right" onClick={handleNextImage}>
                <ChevronRightIcon />
              </button>
            </div>

            {/* Thumbnail Images */}
            <div className="product-gallery__thumbnails">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`product-gallery__thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="product-info">
            {/* Tags */}
            <div className="product-info__tags">
              <span className="product-info__tag">{product.species}</span>
              <span className="product-info__tag">{product.form}</span>
              <span className="product-info__tag">{product.grade}</span>
            </div>

            {/* Product Name */}
            <h1 className="product-info__name">{product.name}</h1>

            {/* Price */}
            <div className="product-info__price">
              <span className="product-info__price-currency">Rp</span>
              <span className="product-info__price-amount">{formattedPrice}</span>
              <span className="product-info__price-unit">/ Kg</span>
            </div>

            {/* Product Details Card */}
            <div className="product-details-card">
              <div className="product-details-card__column">
                <div className="product-details-card__item">
                  <span className="product-details-card__label">{t('productDetail.catchDate')}</span>
                  <span className="product-details-card__value">
                    {product.catch_date
                      ? new Date(product.catch_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                      : '—'}
                  </span>
                </div>
                <div className="product-details-card__item">
                  <span className="product-details-card__label">{t('productDetail.vesselName')}</span>
                  <span className="product-details-card__value">{product.vessel_name || '—'}</span>
                </div>
              </div>
              <div className="product-details-card__column">
                <div className="product-details-card__item">
                  <span className="product-details-card__label">{t('productDetail.oceanZone')}</span>
                  <span className="product-details-card__value">{product.ocean_zone || '—'}</span>
                </div>
                <div className="product-details-card__item">
                  <span className="product-details-card__label">{t('productDetail.vesselId')}</span>
                  <span className="product-details-card__value product-details-card__value--blue">{product.vessel_id || '—'}</span>
                </div>
              </div>
            </div>

            {/* Mobile Overlay Backdrop */}
            {mobileDrawerState.open && (
              <div 
                className="order-card__backdrop" 
                onClick={() => setMobileDrawerState({ open: false, action: null })}
              />
            )}

            {/* Order Card */}
            <div className={`product-order-card ${mobileDrawerState.open ? 'drawer-open' : ''}`}>
              
              {/* Mobile Drawer Header (Hanya muncul saat drawer open) */}
              <div className="order-card__drawer-header">
                <h3>{mobileDrawerState.action === 'cart' ? t('productDetail.drawerTitleCart') : t('productDetail.drawerTitleOrder')}</h3>
                <button 
                  className="order-card__drawer-close"
                  onClick={() => setMobileDrawerState({ open: false, action: null })}
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="order-card__drawer-content">
                {/* Out of Stock Banner */}
                {product.stock_kg <= 0 && (
                  <div className="order-card__out-of-stock-banner">
                    Stok Habis
                  </div>
                )}

                {/* Order Quantity Section */}
                <div className="order-card__quantity-section">
                  <h3 className="order-card__quantity-title">{t('productDetail.orderQty')}</h3>
                  <img
                    src={images[0]}
                    alt={product.name}
                    className="order-card__product-image"
                  />
                  <div className="order-card__quantity-selector">
                    <button
                      className="order-card__quantity-btn"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={(parseInt(quantity, 10) || 0) <= (product.min_order_kg ?? 1) || product.stock_kg <= 0}
                    >
                      <MinusIcon />
                    </button>
                    <div className="order-card__quantity-input-wrapper">
                      <input
                        type="number"
                        className="order-card__quantity-input"
                        value={product.stock_kg <= 0 ? 0 : quantity}
                        onChange={handleQuantityInput}
                        onBlur={handleQuantityBlur}
                        min={product.stock_kg <= 0 ? 0 : (product.min_order_kg ?? 1)}
                        max={product.stock_kg ?? 100000}
                        disabled={product.stock_kg <= 0}
                      />
                    </div>
                    <button
                      className="order-card__quantity-btn"
                      onClick={() => handleQuantityChange(1)}
                      disabled={(parseInt(quantity, 10) || 0) >= (product.stock_kg ?? 100000) || product.stock_kg <= 0}
                    >
                      <AddIcon />
                    </button>
                  </div>
                </div>

                {/* Info Group */}
                <div className="order-card__info-group">
                  {/* Min Order Info */}
                  <div className="order-card__info-row">
                    <span className="order-card__info-label">{t('productDetail.minOrder')}</span>
                    <span className="order-card__info-value">{formatKgWithTon(product.min_order_kg ?? 1)}</span>
                  </div>
                  {/* Stock Info */}
                  <div className={`order-card__info-row ${product.stock_kg <= 0 ? 'order-card__info-row--out' : ''}`}>
                    <span className="order-card__info-label">{t('productDetail.stockAvail')}</span>
                    <span className="order-card__info-value">{formatKgWithTon(product.stock_kg ?? 0)}</span>
                  </div>
                </div>

                {/* Subtotal Section */}
                <div className="order-card__subtotal-section">
                  <span className="order-card__subtotal-label">{t('productDetail.subtotal')}</span>
                  <span className="order-card__subtotal-value">{product.stock_kg <= 0 ? 0 : formattedSubtotal}</span>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="order-card__actions">
                {/* Tombol Cart: Tampilkan jika desktop ATAU drawer tutup ATAU action adalah cart */}
                {(!mobileDrawerState.open || mobileDrawerState.action === 'cart' || window.innerWidth > 900) && (
                  <button
                    className={`order-card__btn-cart ${mobileDrawerState.open ? 'drawer-btn-active' : ''}`}
                    onClick={() => handleActionClick('cart')}
                    disabled={cartLoading || product.stock_kg <= 0}
                    style={{ opacity: cartLoading || product.stock_kg <= 0 ? 0.5 : 1 }}
                  >
                    <span className="order-card__btn-icon">
                      <OrderIcon />
                    </span>
                    {cartLoading ? '...' : (mobileDrawerState.open && window.innerWidth <= 900) ? t('productDetail.addCart') : t('productDetail.cart')}
                  </button>
                )}

                {/* Tombol Order Now: Tampilkan jika desktop ATAU drawer tutup ATAU action adalah order */}
                {(!mobileDrawerState.open || mobileDrawerState.action === 'order' || window.innerWidth > 900) && (
                  <button
                    className={`order-card__btn-order ${mobileDrawerState.open ? 'drawer-btn-active' : ''}`}
                    onClick={() => handleActionClick('order')}
                    disabled={cartLoading || product.stock_kg <= 0}
                    style={{ opacity: cartLoading || product.stock_kg <= 0 ? 0.5 : 1 }}
                  >
                    <span className="order-card__btn-icon">
                      <CartIcon />
                    </span>
                    {cartLoading ? '...' : (mobileDrawerState.open && window.innerWidth <= 900) ? t('productDetail.buyNow') : t('productDetail.orderNow')}
                  </button>
                )}
              </div>
            </div>

            {/* Delivery Info Card */}
            <div className="product-delivery-card">
              <div className="product-delivery-card__tabs" style={{ position: 'relative' }}>
                <span 
                  ref={pengirimanRef}
                  className={`product-delivery-card__tab ${activeTab === 'pengiriman' ? 'product-delivery-card__tab--active' : ''}`}
                  onClick={() => setActiveTab('pengiriman')}
                >
                  {t('productDetail.tabDelivery')}
                </span>
                <span 
                  ref={detailRef}
                  className={`product-delivery-card__tab ${activeTab === 'detail' ? 'product-delivery-card__tab--active' : ''}`}
                  onClick={() => setActiveTab('detail')}
                >
                  {t('productDetail.tabDetail')}
                </span>
              </div>
              <div 
                className="product-delivery-card__underline"
                style={underlineStyle}
              ></div>
              
              <div className="product-delivery-card__content">
                {activeTab === 'pengiriman' ? (
                  <>
                    <div className="product-delivery-card__origin">
                      <LocationIcon />
                      <span className="product-delivery-card__origin-label">{t('productDetail.shippedFrom')}</span>
                      <span className="product-delivery-card__origin-value">{product.location || 'Indonesia'}</span>
                    </div>
                    <div className="product-delivery-card__map-placeholder" />
                  </>
                ) : (
                  <div className="product-delivery-card__detail-text">
                    <p>{product.description || `Produk ${product.species} berkualitas ${product.grade}, dalam bentuk ${product.form}. Stok tersedia: ${product.stock_kg ?? '—'} kg.`}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Toast Notification */}
      {cartToast && (
        <div style={{
          position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          background: cartToast.type === 'success' ? '#0273FF' : '#EF4444',
          color: '#fff', padding: '12px 24px', borderRadius: 12,
          fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '0.875rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)', zIndex: 9999,
          animation: 'fadeInUp 0.3s ease',
        }}>
          {cartToast.message}
        </div>
      )}

      {import.meta.env.DEV && <Agentation />}
    </>
  )
}

export default ProductDetailPage
