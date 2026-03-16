import { useEffect, useState, useCallback } from 'react'
import { Agentation } from 'agentation'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import MarketplaceFilter from '../components/marketplace/MarketplaceFilter'
import ProductCard from '../components/marketplace/ProductCard'
import Pagination from '../components/marketplace/Pagination'
import SortDropdown from '../components/marketplace/SortDropdown'
import { productApi } from '../api/productApi'
import './MarketplacePage.css'

// Mock data produk berdasarkan spesifikasi Figma - 12 produk (4x3 grid)
const MOCK_PRODUCTS = [
  {
    id: 1,
    image: '/products/bluefin_loin.png',
    name: 'Bluefin Loin',
    location: 'Maluku, ID',
    tags: ['Bluefin Tuna', 'Loin (Skin-on)', 'A+'],
    price: 24000,
  },
  {
    id: 2,
    image: '/products/bigeye_steak.png',
    name: 'Bigeye Steak',
    location: 'Sulawesi, ID',
    tags: ['Bigeye Tuna', 'Steak', 'A'],
    price: 18500,
  },
  {
    id: 3,
    image: '/products/yellowfin_whole.png',
    name: 'Yellowfin Whole',
    location: 'Bali, ID',
    tags: ['Yellowfin Tuna', 'Whole', 'A+'],
    price: 22000,
  },
  {
    id: 4,
    image: '/products/bluefin_loin.png',
    name: 'Bluefin Fillet',
    location: 'Ambon, ID',
    tags: ['Bluefin Tuna', 'Fillet', 'A+'],
    price: 28000,
  },
  {
    id: 5,
    image: '/products/bigeye_steak.png',
    name: 'Bigeye Loin',
    location: 'Bitung, ID',
    tags: ['Bigeye Tuna', 'Loin (Skin-on)', 'A'],
    price: 19500,
  },
  {
    id: 6,
    image: '/products/yellowfin_whole.png',
    name: 'Yellowfin Steak',
    location: 'Lombok, ID',
    tags: ['Yellowfin Tuna', 'Steak', 'A'],
    price: 17500,
  },
  {
    id: 7,
    image: '/products/bluefin_loin.png',
    name: 'Bluefin Whole',
    location: 'Ternate, ID',
    tags: ['Bluefin Tuna', 'Whole', 'A+'],
    price: 26000,
  },
  {
    id: 8,
    image: '/products/bigeye_steak.png',
    name: 'Bigeye Fillet',
    location: 'Manado, ID',
    tags: ['Bigeye Tuna', 'Fillet', 'B+'],
    price: 16500,
  },
  {
    id: 9,
    image: '/products/yellowfin_whole.png',
    name: 'Yellowfin Loin',
    location: 'Surabaya, ID',
    tags: ['Yellowfin Tuna', 'Loin (Skin-on)', 'A+'],
    price: 21000,
  },
  {
    id: 10,
    image: '/products/bluefin_loin.png',
    name: 'Bluefin Steak',
    location: 'Jakarta, ID',
    tags: ['Bluefin Tuna', 'Steak', 'A'],
    price: 25500,
  },
  {
    id: 11,
    image: '/products/bigeye_steak.png',
    name: 'Bigeye Whole',
    location: 'Makassar, ID',
    tags: ['Bigeye Tuna', 'Whole', 'B+'],
    price: 15000,
  },
  {
    id: 12,
    image: '/products/yellowfin_whole.png',
    name: 'Yellowfin Fillet',
    location: 'Semarang, ID',
    tags: ['Yellowfin Tuna', 'Fillet', 'A'],
    price: 23500,
  },
]

// Sort mapping: nilai dari UI → nilai query param backend
const SORT_MAP = {
  'Recommended': 'newest',
  'Price: Low to High': 'price_asc',
  'Price: High to Low': 'price_desc',
  'Newest': 'newest',
}

// Filter species mapping — label UI ke value DB
const SPECIES_MAP = {
  'Bluefin': 'Bluefin Tuna',
  'Bigeye': 'Bigeye Tuna',
  'Yellowfin': 'Yellowfin Tuna',
}

const INITIAL_FILTERS = {
  species: ['all'],
  form:    ['all'],
  grade:   ['all'],
}

/**
 * Toggle helper:
 * - Pilih 'all' → hapus semua pilihan lain, sisakan 'all'
 * - Pilih item lain → hapus 'all', toggle item tersebut
 * - Jika semua unchecked → kembalikan ke 'all'
 */
const toggleFilter = (current, value) => {
  if (value === 'all') return ['all']

  const withoutAll = current.filter((v) => v !== 'all')
  const exists = withoutAll.includes(value)
  const next = exists
    ? withoutAll.filter((v) => v !== value)
    : [...withoutAll, value]

  return next.length === 0 ? ['all'] : next
}

const MarketplacePage = () => {
  const { t } = useTranslation()
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('Recommended')
  const [products, setProducts] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sortOptions = ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Newest']

  // Build API params dari state filter & sort
  const buildApiParams = useCallback(() => {
    const params = {
      page: currentPage,
      limit: 12,
      sort: SORT_MAP[sortBy] || 'newest',
    }
    if (!filters.species.includes('all')) {
      params.species = filters.species.join(',')
    }
    if (!filters.form.includes('all')) {
      params.form = filters.form.join(',')
    }
    if (!filters.grade.includes('all')) {
      params.grade = filters.grade.join(',')
    }
    return params
  }, [filters, currentPage, sortBy])

  // Fetch produk dari API
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await productApi.getAll(buildApiParams())
      const { data, meta } = response.data.data
      setProducts(data || [])
      setTotalPages(meta?.totalPages || 1)
    } catch (err) {
      setError('Gagal memuat produk. Silakan coba lagi.')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [buildApiParams])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleFilterChange = (section, value) => {
    setFilters((prev) => ({
      ...prev,
      [section]: toggleFilter(prev[section], value),
    }))
    setCurrentPage(1) // reset ke halaman 1 saat filter berubah
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleSortChange = (value) => {
    setSortBy(value)
    setCurrentPage(1)
  }

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

  return (
    <>
      <Navbar scrollYProgress={null} contentRef={null} alwaysVisible />

      <main className="marketplace-page">
        <div className="marketplace-layout">
          {/* Sidebar Filter — kiri */}
          <MarketplaceFilter filters={filters} onChange={handleFilterChange} />

          {/* Area konten — kanan (header + produk) */}
          <div className="marketplace-content">
            {/* Header Section - di atas produk */}
            <header className="marketplace-header">
              <h1 className="marketplace-header__title">{t('marketplace.title')}</h1>
              <p className="marketplace-header__description">
                {t('marketplace.description')}
              </p>
            </header>

            {/* Toolbar - Active filters + Sort dropdown */}
            <div className="marketplace-toolbar">
              <div className="marketplace-toolbar__filters">
                <span className="marketplace-toolbar__label">{t('marketplace.activeLabel')}</span>
                {filters.species.includes('all') &&
                 filters.form.includes('all') &&
                 filters.grade.includes('all') ? (
                  <span className="marketplace-toolbar__filter-tag marketplace-toolbar__filter-tag--all">{t('marketplace.allProducts')}</span>
                ) : (
                  <>
                    {!filters.species.includes('all') && filters.species.map((s) => (
                      <span key={s} className="marketplace-toolbar__filter-tag">{s}</span>
                    ))}
                    {!filters.form.includes('all') && filters.form.map((f) => (
                      <span key={f} className="marketplace-toolbar__filter-tag">{f}</span>
                    ))}
                    {!filters.grade.includes('all') && filters.grade.map((g) => (
                      <span key={g} className="marketplace-toolbar__filter-tag">{g}</span>
                    ))}
                  </>
                )}
              </div>
              <SortDropdown
                options={sortOptions}
                value={sortBy}
                onChange={handleSortChange}
              />
            </div>

                        {/* Grid produk */}
            <section className="marketplace-products">
              {loading ? (
                <div className="marketplace-products__empty">
                  <p>{t('marketplace.loading')}</p>
                </div>
              ) : error ? (
                <div className="marketplace-products__empty">
                  <p>{t('marketplace.error')}</p>
                </div>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    image={product.images?.[0] || '/products/bluefin_loin.png'}
                    name={product.name}
                    location={product.location}
                    tags={[product.species, product.form, product.grade]}
                    price={product.price_per_kg}
                  />
                ))
              ) : (
                <div className="marketplace-products__empty">
                  <p>{t('marketplace.noProducts')}</p>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Pagination - di tengah di bawah produk */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>

      <Footer />

      {import.meta.env.DEV && <Agentation />}
    </>
  )
}

export default MarketplacePage
