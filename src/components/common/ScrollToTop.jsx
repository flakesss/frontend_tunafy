import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop - Komponen untuk scroll ke atas halaman setiap kali navigasi
 * 
 * Masalah: Ketika user scroll di halaman home sampai bawah, lalu navigasi ke
 * halaman lain (marketplace, dll), posisi scroll tetap di bawah.
 * 
 * Solusi: Komponen ini mendengarkan perubahan pathname dan scroll ke atas.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    // Scroll ke atas dengan behavior instant untuk navigasi antar halaman
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop
