import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { motion, useTransform } from 'framer-motion';
import './HeroSection.css';
import logoTunafy from '../../assets/images/logo tunafy.png';

const TOTAL_FRAMES = 160; // Animasi sampai frame 160
const NAVBAR_LOGO_WIDTH = 156; // matches .navbar-logo { width: 156px } di Navbar.css
const NAVBAR_HEIGHT = 75;      // matches .navbar { height: 75px } di Navbar.css
const SWAP_PROGRESS = 0.5;     // swap terjadi di 50% scroll progress
const TEXT_START = 0.52;       // teks mulai muncul SETELAH navbar selesai (progress 52%)
const TEXT_FULL  = 0.60;       // teks fully visible di progress 60%

/**
 * HeroSection component with scroll-based animation background
 *
 * Props:
 *  - heroRef: ref dari App.jsx (target useScroll)
 *  - scrollYProgress: MotionValue 0→1, shared dengan Navbar
 *
 * Scale dihitung dari ukuran NYATA logo di DOM (bukan estimasi),
 * sehingga logo hero selalu tepat sama ukurannya dengan logo navbar saat swap.
 */
const HeroSection = ({ heroRef, scrollYProgress }) => {
  const imageRef   = useRef(null); // untuk update frame animasi background
  const heroLogoRef = useRef(null); // untuk mengukur lebar logo hero di DOM

  const [imagesReady, setImagesReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Refs untuk nilai transform — dibaca oleh useTransform setiap frame
  // (dipakai ref bukan state agar tidak re-render saat resize)
  const scaleEndRef      = useRef(0.17);
  const translateYEndRef = useRef(-400);

  // Hitung ulang nilai transform dari ukuran DOM yang nyata
  const updateTransforms = useCallback(() => {
    // translateY: dari tengah viewport ke tengah navbar
    const vh = window.innerHeight;
    const navbarCenterY = NAVBAR_HEIGHT / 2; // = 37.5px
    translateYEndRef.current = -(vh / 2 - navbarCenterY);

    // scale: sesuaikan lebar logo hero dengan lebar logo navbar
    if (heroLogoRef.current && heroLogoRef.current.offsetWidth > 0) {
      scaleEndRef.current = NAVBAR_LOGO_WIDTH / heroLogoRef.current.offsetWidth;
    }
  }, []);

  // Recalculate on mount dan setiap resize
  useEffect(() => {
    updateTransforms();
    window.addEventListener('resize', updateTransforms);
    return () => window.removeEventListener('resize', updateTransforms);
  }, [updateTransforms]);

  // Preload images
  const imageModules = useMemo(() => {
    return import.meta.glob('/src/assets/images/foto animasi/*.png', { eager: true });
  }, []);

  const sortedImageUrls = useMemo(() => {
    const entries = Object.entries(imageModules);
    entries.sort((a, b) => {
      const numA = parseInt(a[0].match(/(\d+)\.png$/)?.[1] || '0');
      const numB = parseInt(b[0].match(/(\d+)\.png$/)?.[1] || '0');
      return numA - numB;
    });
    return entries.slice(0, TOTAL_FRAMES).map(([, module]) => module.default);
  }, [imageModules]);

  useEffect(() => {
    if (sortedImageUrls.length === 0) return;
    let loadedCount = 0;
    const total = sortedImageUrls.length;

    const preloadImage = (url) =>
      new Promise((resolve) => {
        const img = new Image();
        const done = () => {
          loadedCount++;
          setLoadingProgress(Math.round((loadedCount / total) * 100));
          resolve();
        };
        img.onload = done;
        img.onerror = done;
        img.src = url;
      });

    Promise.all(sortedImageUrls.map(preloadImage)).then(() => setImagesReady(true));
  }, [sortedImageUrls]);

  // Update background frame langsung di DOM (tanpa re-render)
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const idx = Math.max(0, Math.min(Math.round(latest * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1));
      if (imageRef.current && sortedImageUrls[idx]) {
        imageRef.current.src = sortedImageUrls[idx];
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, sortedImageUrls]);

  // ─── Transform functions ─────────────────────────────────────────────────
  // Membaca dari ref → selalu gunakan nilai terbaru (termasuk setelah resize)

  // Logo bergerak naik ke posisi navbar
  const logoY = useTransform(scrollYProgress, (v) => {
    const t = Math.max(0, Math.min(v / SWAP_PROGRESS, 1));
    return translateYEndRef.current * t;
  });

  // Logo mengecil sampai TEPAT sama dengan ukuran navbar logo
  const logoScale = useTransform(scrollYProgress, (v) => {
    const t = Math.max(0, Math.min(v / SWAP_PROGRESS, 1));
    // Interpolasi linear: 1 (hero size) → scaleEnd (navbar size)
    return 1 + (scaleEndRef.current - 1) * t;
  });

  // Visibility instan: visible → hidden tepat di SWAP_PROGRESS (tanpa fade)
  const logoVisibility = useTransform(
    scrollYProgress,
    (v) => (v >= SWAP_PROGRESS ? 'hidden' : 'visible')
  );

  // ─── Text & Button Animation ─────────────────────────────────────────────────
  // Muncul fade in dari bawah ke atas SETELAH navbar selesai (progress 0.52)
  // Timing:
  //  - 0.52 : mulai muncul (logo swap sudah selesai, navbar links sudah fade in)
  //  - 0.60 : fully visible
  //  - tetap visible sampai akhir scroll

  const textOpacity = useTransform(
    scrollYProgress,
    [TEXT_START, TEXT_FULL],
    [0, 1]
  );

  // Slide up: mulai 40px di bawah, naik ke posisi asli
  const textTranslateY = useTransform(
    scrollYProgress,
    [TEXT_START, TEXT_FULL],
    [40, 0]
  );

  return (
    <section className="hero-container" ref={heroRef}>
      <div className="hero-sticky-wrapper">

        {/* Loading state */}
        {!imagesReady && (
          <div className="hero-loading">
            <div className="loading-spinner"></div>
            <p>Loading animation... {loadingProgress}%</p>
            <div className="loading-bar">
              <div className="loading-bar-fill" style={{ width: `${loadingProgress}%` }}></div>
            </div>
          </div>
        )}

        {/* Animated background */}
        <div className="hero-animation-container">
          {imagesReady && sortedImageUrls.length > 0 && (
            <img
              ref={imageRef}
              src={sortedImageUrls[0]}
              alt="Animation frame"
              className="hero-animation-image"
            />
          )}
          <div className="hero-blue-overlay"></div>
          <div className="hero-gradient-overlay"></div>
          <div className="hero-bottom-gradient"></div>
        </div>

        {/* Logo hero — selalu di DOM, visibility dikontrol MotionValue (instan, tanpa fade) */}
        <div className="hero-content-wrapper">
          <motion.div
            className="hero-content"
            style={{
              y: logoY,
              scale: logoScale,
              visibility: logoVisibility,
            }}
          >
            <div className="hero-content-inner">
              <img
                ref={heroLogoRef}
                src={logoTunafy}
                alt="Tunafy Logo"
                className="hero-logo"
                onLoad={updateTransforms} // hitung ulang scale setelah gambar termuat
              />
            </div>
          </motion.div>
        </div>

        {/* Text & Button - muncul dengan fade in dari bawah mulai frame 70 */}
        <div className="hero-text-wrapper">
          <motion.div
            className="hero-text-container"
            style={{
              opacity: textOpacity,
              y: textTranslateY,
            }}
          >
            <h1 className="hero-title">
              Sourcing Premium Tuna Made Simple
            </h1>
            <p className="hero-description">
              The smartest way to buy Premium Grade Tuna. Fully traceable, legally compliant, and delivered globally.
            </p>
            <button className="hero-cta-button">
              View Product Catalog
            </button>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
