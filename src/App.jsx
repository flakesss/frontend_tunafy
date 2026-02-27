import { useRef } from 'react'
import { useScroll } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import HeroSection from './components/sections/HeroSection'
import WhyTunafySection from './components/sections/WhyTunafySection'
import BandaSeaSection from './components/sections/BandaSeaSection'
import ScrollingLine from './components/sections/ScrollingLine'
import Footer from './components/layout/Footer'
import { Agentation } from 'agentation'
import './App.css'

function App() {
  // Ref untuk hero container — dipakai bersama oleh HeroSection dan Navbar
  const heroRef = useRef(null)
  // Ref untuk content section (section 2)
  const contentRef = useRef(null)

  // Single source of truth untuk scroll progress
  // offset: ["start start", "end end"] → 0 = hero paling atas, 1 = hero habis
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  })

  return (
    <>
      {/* Navbar menerima scrollYProgress dan contentRef untuk deteksi section 2 */}
      <Navbar scrollYProgress={scrollYProgress} contentRef={contentRef} />

      <div className="app">
        {/* HeroSection menerima heroRef dan scrollYProgress dari App */}
        <HeroSection heroRef={heroRef} scrollYProgress={scrollYProgress} />

        {/* Section 2 — background putih, konten menyusul */}
        <section className="content-section" ref={contentRef}>
          <WhyTunafySection />

          {/* Animasi garis bergerak antara section 2 dan section 3 */}
          <ScrollingLine />

          <BandaSeaSection />
        </section>

        {/* Footer */}
        <Footer />
      </div>

      {/* Agentation — visual feedback tool for AI agent, development only */}
      {import.meta.env.DEV && <Agentation />}
    </>
  )
}

export default App

