import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { motion, useTransform } from 'framer-motion';
import './HeroSection.css';
import logoTunafy from '../../assets/images/logo tunafy.png';

const TOTAL_FRAMES = 160;
const NAVBAR_LOGO_WIDTH = 156;
const NAVBAR_HEIGHT = 75;
const SWAP_PROGRESS = 0.5;
const TEXT_START = 0.52;
const TEXT_FULL  = 0.60;

/**
 * HeroSection — scroll-based frame animation (Apple-style)
 *
 * Optimasi yang diterapkan:
 * 1. WebP frames (bukan PNG) — 96% lebih kecil
 * 2. Canvas context { alpha: false, desynchronized: true } — GPU async compositing
 * 3. createImageBitmap() — decode off main thread, zero jank saat scroll
 * 4. Framer Motion scroll listener berjalan di compositor thread (passive)
 */
const HeroSection = ({ heroRef, scrollYProgress }) => {
  const canvasRef   = useRef(null);
  const heroLogoRef = useRef(null);

  const [imagesReady, setImagesReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Simpan ImageBitmap objects — sudah di-decode off main thread
  const bitmapsRef = useRef([]);

  // Canvas 2D context — cached agar tidak di-lookup tiap frame
  const ctxRef = useRef(null);

  const scaleEndRef      = useRef(0.17);
  const translateYEndRef = useRef(-400);

  const updateTransforms = useCallback(() => {
    const vh = window.innerHeight;
    translateYEndRef.current = -(vh / 2 - NAVBAR_HEIGHT / 2);
    if (heroLogoRef.current && heroLogoRef.current.offsetWidth > 0) {
      scaleEndRef.current = NAVBAR_LOGO_WIDTH / heroLogoRef.current.offsetWidth;
    }
  }, []);

  useEffect(() => {
    updateTransforms();
    window.addEventListener('resize', updateTransforms, { passive: true }); // Fix #4
    return () => window.removeEventListener('resize', updateTransforms);
  }, [updateTransforms]);

  // ── FIX #1: Pakai WebP glob (bukan PNG) ──────────────────────────────────
  const imageModules = useMemo(() => {
    return import.meta.glob(
      '/src/assets/images/foto animasi webp/*.webp',
      { eager: true }
    );
  }, []);

  const sortedImageUrls = useMemo(() => {
    const entries = Object.entries(imageModules);
    entries.sort((a, b) => {
      const numA = parseInt(a[0].match(/(\d+)\.webp$/)?.[1] || '0');
      const numB = parseInt(b[0].match(/(\d+)\.webp$/)?.[1] || '0');
      return numA - numB;
    });
    return entries.slice(0, TOTAL_FRAMES).map(([, mod]) => mod.default);
  }, [imageModules]);

  // ── FIX #2: Canvas context dengan alpha:false + desynchronized:true ──────
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || ctxRef.current) return;

    canvas.width  = canvas.offsetWidth  || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;

    // alpha: false     → browser skip compositing transparency layer
    // desynchronized: true → GPU renders async, tidak nunggu CPU
    ctxRef.current = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
    });
  }, []);

  // ── FIX #3: createImageBitmap untuk decode off main thread ───────────────
  // Fetch → Blob → createImageBitmap (decode di worker thread browser)
  // Hasil: ImageBitmap yang langsung bisa digambar tanpa decode overhead
  useEffect(() => {
    if (sortedImageUrls.length === 0) return;

    initCanvas();

    const total = sortedImageUrls.length;
    let loadedCount = 0;
    const bitmaps = new Array(total);

    const loadBitmap = async (url, index) => {
      try {
        const res  = await fetch(url);
        const blob = await res.blob();
        // createImageBitmap = decode di thread terpisah (tidak blokir scroll)
        bitmaps[index] = await createImageBitmap(blob);
      } catch {
        // fallback ke Image() jika fetch/createImageBitmap gagal
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = async () => {
            try { bitmaps[index] = await createImageBitmap(img); } catch { /* noop */ }
            resolve();
          };
          img.onerror = resolve;
          img.src = url;
        });
      }
      loadedCount++;
      setLoadingProgress(Math.round((loadedCount / total) * 100));
    };

    // Muat semua frame secara paralel (maximise bandwidth)
    Promise.all(sortedImageUrls.map((url, i) => loadBitmap(url, i))).then(() => {
      bitmapsRef.current = bitmaps;
      setImagesReady(true);

      // Render frame pertama
      const canvas = canvasRef.current;
      const ctx    = ctxRef.current;
      if (canvas && ctx && bitmaps[0]) {
        ctx.drawImage(bitmaps[0], 0, 0, canvas.width, canvas.height);
      }
    });
  }, [sortedImageUrls, initCanvas]);

  // Resize → redraw frame saat ini
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const idx     = parseInt(canvas.dataset.frameIdx || '0');
      const bitmap  = bitmapsRef.current[idx];
      const ctx     = ctxRef.current;
      if (ctx && bitmap) {
        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      }
    };
    window.addEventListener('resize', handleResize, { passive: true }); // Fix #4
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Update frame di scroll — ZERO React re-render, ZERO decode ───────────
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const canvas  = canvasRef.current;
      const ctx     = ctxRef.current;
      const bitmaps = bitmapsRef.current;
      if (!canvas || !ctx || bitmaps.length === 0) return;

      const idx = Math.max(
        0,
        Math.min(Math.round(latest * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1)
      );
      const bitmap = bitmaps[idx];
      if (!bitmap) return;

      canvas.dataset.frameIdx = idx;
      // drawImage(ImageBitmap) = hanya blitting pixel → tidak ada decode
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // ─── Framer Motion transforms (tidak berubah) ────────────────────────────
  const logoY = useTransform(scrollYProgress, (v) => {
    const t = Math.max(0, Math.min(v / SWAP_PROGRESS, 1));
    return translateYEndRef.current * t;
  });
  const logoScale = useTransform(scrollYProgress, (v) => {
    const t = Math.max(0, Math.min(v / SWAP_PROGRESS, 1));
    return 1 + (scaleEndRef.current - 1) * t;
  });
  const logoVisibility = useTransform(
    scrollYProgress,
    (v) => (v >= SWAP_PROGRESS ? 'hidden' : 'visible')
  );
  const textOpacity = useTransform(scrollYProgress, [TEXT_START, TEXT_FULL], [0, 1]);
  const textTranslateY = useTransform(scrollYProgress, [TEXT_START, TEXT_FULL], [40, 0]);

  return (
    <section className="hero-container" ref={heroRef}>
      <div className="hero-sticky-wrapper">

        {!imagesReady && (
          <div className="hero-loading">
            <div className="loading-spinner"></div>
            <p>Loading animation... {loadingProgress}%</p>
            <div className="loading-bar">
              <div className="loading-bar-fill" style={{ width: `${loadingProgress}%` }}></div>
            </div>
          </div>
        )}

        {/* Canvas — Fix #2: alpha:false + desynchronized via initCanvas */}
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

        <div className="hero-content-wrapper">
          <motion.div
            className="hero-content"
            style={{ y: logoY, scale: logoScale, visibility: logoVisibility }}
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

        <div className="hero-text-wrapper">
          <motion.div
            className="hero-text-container"
            style={{ opacity: textOpacity, y: textTranslateY }}
          >
            <h1 className="hero-title">Sourcing Premium Tuna Made Simple</h1>
            <p className="hero-description">
              The smartest way to buy Premium Grade Tuna. Fully traceable, legally compliant, and delivered globally.
            </p>
            <button className="hero-cta-button">View Product Catalog</button>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
