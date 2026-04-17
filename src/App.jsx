import Navbar from './components/layout/Navbar'
import HeroSection from './components/sections/HeroSection'
import WhyTunafySection from './components/sections/WhyTunafySection'
import ProductsSection from './components/sections/ProductsSection'
import WhoFlocifySection from './components/sections/WhoFlocifySection'
import JangkauanSection from './components/sections/JangkauanSection'
import BlogPreviewSection from './components/sections/BlogPreviewSection'
import BandaSeaSection from './components/sections/BandaSeaSection'
import ScrollingLine from './components/sections/ScrollingLine'
import Footer from './components/layout/Footer'
import { Agentation } from 'agentation'
import './App.css'

function App() {
  return (
    <>
      {/* Navbar — transparent saat di atas, solid saat scroll */}
      <Navbar scrollYProgress={null} contentRef={null} />

      <div className="app">
        <HeroSection />

        <section className="content-section">
          <WhyTunafySection />
          <ProductsSection />
          <WhoFlocifySection />
          <JangkauanSection />
          <BlogPreviewSection />
          <ScrollingLine />
          <BandaSeaSection />
        </section>

        <Footer />
      </div>

      {import.meta.env.DEV && <Agentation />}
    </>
  )
}

export default App
