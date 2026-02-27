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
 *
 * PERFORMA: Menggunakan Canvas API + pre-decoded HTMLImageElement
 * alih-alih img.src swap, sehingga tidak ada decode overhead per frame.
 */
const HeroSection = ({ heroRef, scrollYProgress }) => {
  const canvasRef   = useRef(null); // canvas untuk rendering frame animasi
  const heroLogoRef = useRef(null); // untuk mengukur lebar logo hero di DOM

  const [imagesReady, setImagesReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Simpan Image objects (sudah ter-decode) — bukan hanya URL
  const decodedImagesRef = useRef([]);

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

  // Kumpulkan URL gambar via import.meta.glob
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

  // ── KUNCI PERFORMA: Preload sebagai HTMLImageElement (ter-decode di memori) ──
  // drawImage(img) jauh lebih cepat dari swap img.src karena tidak perlu decode.
  useEffect(() => {
    if (sortedImageUrls.length === 0) return;

    let loadedCount = 0;
    const total = sortedImageUrls.length;
    const images = new Array(total);

    const preloadImage = (url, index) =>
      new Promise((resolve) => {
        const img = new Image();
        const done = () => {
          images[index] = img; // simpan Image object, bukan URL
          loadedCount++;
          setLoadingProgress(Math.round((loadedCount / total) * 100));
          resolve();
        };
        img.onload = done;
        img.onerror = done;
        img.src = url;
      });

    Promise.all(sortedImageUrls.map((url, i) => preloadImage(url, i))).then(() => {
      decodedImagesRef.current = images;
      setImagesReady(true);

      // Render frame pertama ke canvas segera setelah siap
      const canvas = canvasRef.current;
      if (canvas && images[0]) {
        canvas.width  = canvas.offsetWidth  || window.innerWidth;
        canvas.height = canvas.offsetHeight || window.innerHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(images[0], 0, 0, canvas.width, canvas.height);
      }
    });
  }, [sortedImageUrls]);

  // Resize canvas saat window berubah ukuran
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const images = decodedImagesRef.current;
      // Simpan index frame saat ini agar bisa di-redraw setelah resize
      const currentIdx = canvas.dataset.frameIdx ? parseInt(canvas.dataset.frameIdx) : 0;
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      if (images[currentIdx]) {
        const ctx = canvas.getContext('2d');
        ctx.drawImage(images[currentIdx], 0, 0, canvas.width, canvas.height);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Update canvas frame langsung di scroll (tanpa React re-render) ──
  // Ini dilakukan lewat Canvas API: tidak ada setState, tidak ada DOM swap.
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const canvas = canvasRef.current;
      const images = decodedImagesRef.current;
      if (!canvas || images.length === 0) return;

      const idx = Math.max(0, Math.min(Math.round(latest * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1));
      if (!images[idx]) return;

      // Simpan index agar resize handler bisa redraw frame yang benar
      canvas.dataset.frameIdx = idx;

      const ctx = canvas.getContext('2d');
      // drawImage: hanya copy pixel → ZERO DECODE OVERHEAD
      ctx.drawImage(images[idx], 0, 0, canvas.width, canvas.height);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // ─── Transform functions ─────────────────────────────────────────────────
  // Logo bergerak naik ke posisi navbar
  const logoY = useTransform(scrollYProgress, (v) => {
    const t = Math.max(0, Math.min(v / SWAP_PROGRESS, 1));
    return translateYEndRef.current * t;
  });

  // Logo mengecil sampai TEPAT sama dengan ukuran navbar logo
  const logoScale = useTransform(scrollYProgress, (v) => {
    const t = Math.max(0, Math.min(v / SWAP_PROGRESS, 1));
    return 1 + (scaleEndRef.current - 1) * t;
  });

  // Visibility instan: visible → hidden tepat di SWAP_PROGRESS (tanpa fade)
  const logoVisibility = useTransform(
    scrollYProgress,
    (v) => (v >= SWAP_PROGRESS ? 'hidden' : 'visible')
  );

  // ─── Text & Button Animation ─────────────────────────────────────────────────
  const textOpacity = useTransform(
    scrollYProgress,
    [TEXT_START, TEXT_FULL],
    [0, 1]
  );

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

        {/* Canvas animation — menggantikan <img> swap */}
        <div className="hero-animation-container">
          <canvas
            ref={canvasRef}
            className="hero-animation-canvas"
            style={{ display: imagesReady ? 'block' : 'none' }}
          />
          <div className="hero-blue-overlay"></div>
          <div className="hero-gradient-overlay"></div>
          <div className="hero-bottom-gradient"></div>
        </div>

        {/* Logo hero — selalu di DOM, visibility dikontrol MotionValue */}
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
                onLoad={updateTransforms}
              />
            </div>
          </motion.div>
        </div>

        {/* Text & Button - muncul dengan fade in dari bawah */}
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
