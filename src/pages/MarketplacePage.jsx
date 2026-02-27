import { useEffect, useState } from 'react'
import { Agentation } from 'agentation'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import MarketplaceFilter from '../components/marketplace/MarketplaceFilter'
import './MarketplacePage.css'

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
  const [filters, setFilters] = useState(INITIAL_FILTERS)

  const handleFilterChange = (section, value) => {
    setFilters((prev) => ({
      ...prev,
      [section]: toggleFilter(prev[section], value),
    }))
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

          {/* Area produk — kanan (menyusul) */}
          <section className="marketplace-products">
            {/* Produk akan ditambahkan di sini */}
          </section>
        </div>
      </main>

      <Footer />

      {import.meta.env.DEV && <Agentation />}
    </>
  )
}

export default MarketplacePage
