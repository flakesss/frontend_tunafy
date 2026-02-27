import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { useScroll } from 'framer-motion';
import './WhyTunafySection.css';

const TOTAL_FRAMES = 83;
const START_FRAME  = 41; // animasi mulai dari frame 41

/**
 * WhyTunafySection — scroll-based frame animation (Apple-style)
 *
 * Optimasi:
 * 1. WebP frames (89% lebih kecil dari PNG)
 * 2. Canvas context { alpha: false, desynchronized: true } — GPU async
 * 3. createImageBitmap() — decode off main thread
 * 4. passive: true pada event listeners
 */
const WhyTunafySection = () => {
  const sectionRef = useRef(null);
  const canvasRef  = useRef(null);
  const ctxRef     = useRef(null);

  const [imagesReady, setImagesReady] = useState(false);

  // Simpan ImageBitmap (sudah decoded off-thread)
  const bitmapsRef = useRef([]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // ── FIX #1: Pakai WebP glob ───────────────────────────────────────────────
  const imageModules = useMemo(() => {
    return import.meta.glob('/src/assets/images/frame webp/FRAME *.webp', { eager: true });
  }, []);

  const sortedImageUrls = useMemo(() => {
    const entries = Object.entries(imageModules);
    entries.sort((a, b) => {
      const numA = parseInt(a[0].match(/FRAME (\d+)\.webp$/)?.[1] || '0');
      const numB = parseInt(b[0].match(/FRAME (\d+)\.webp$/)?.[1] || '0');
      return numA - numB;
    });
    return entries.slice(START_FRAME - 1, TOTAL_FRAMES).map(([, mod]) => mod.default);
  }, [imageModules]);

  // ── FIX #2: Init canvas dengan alpha:false + desynchronized:true ──────────
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || ctxRef.current) return;
    canvas.width  = canvas.offsetWidth  || 800;
    canvas.height = canvas.offsetHeight || 600;
    ctxRef.current = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
    });
  }, []);

  // ── FIX #3: createImageBitmap untuk decode off main thread ────────────────
  useEffect(() => {
    if (sortedImageUrls.length === 0) return;
    initCanvas();

    const total   = sortedImageUrls.length;
    const bitmaps = new Array(total);

    const loadBitmap = async (url, index) => {
      try {
        const res    = await fetch(url);
        const blob   = await res.blob();
        bitmaps[index] = await createImageBitmap(blob);
      } catch {
        // fallback
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
    };

    Promise.all(sortedImageUrls.map((url, i) => loadBitmap(url, i))).then(() => {
      bitmapsRef.current = bitmaps;
      setImagesReady(true);

      // Render frame pertama langsung
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
      const idx    = parseInt(canvas.dataset.frameIdx || '0');
      const bitmap = bitmapsRef.current[idx];
      const ctx    = ctxRef.current;
      if (ctx && bitmap) {
        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      }
    };
    window.addEventListener('resize', handleResize, { passive: true }); // Fix #4
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Update frame di scroll — tanpa re-render, tanpa decode ───────────────
  useEffect(() => {
    if (!imagesReady) return;

    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const canvas  = canvasRef.current;
      const ctx     = ctxRef.current;
      const bitmaps = bitmapsRef.current;
      if (!canvas || !ctx || bitmaps.length === 0) return;

      const clamped = Math.max(0, Math.min(latest, 1));
      const idx     = Math.round(clamped * (bitmaps.length - 1));
      const bitmap  = bitmaps[idx];
      if (!bitmap) return;

      canvas.dataset.frameIdx = idx;
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    });

    return () => unsubscribe();
  }, [scrollYProgress, imagesReady]);

  return (
    <section className="why-tunafy-section" ref={sectionRef}>
      <div className="why-tunafy-inner">
        {/* Left — Text Content */}
        <div className="why-tunafy-text">
          <p className="why-tunafy-label">WHY CHOOSE TUNAFY</p>
          <h2 className="why-tunafy-heading">
            Traceable Sourcing from the Heart of the Banda Sea.
          </h2>
          <p className="why-tunafy-body">
            Our supply chain is optimized for speed and transparency. From the
            artisanal fishermen of Maluku to the markets, we ensure every fish
            is tracked, temperature-logged, and delivered with integrity.
          </p>
          <button className="why-tunafy-btn">View Product Catalog</button>
        </div>

        {/* Right — Canvas animation (WebP + createImageBitmap) */}
        <div className="why-tunafy-image-wrap">
          <canvas
            ref={canvasRef}
            className="why-tunafy-image"
            aria-label="Tunafy — Traceable Sourcing from Banda Sea"
            style={{ display: imagesReady ? 'block' : 'none' }}
          />

          {/* Loading spinner saat preload belum selesai */}
          {!imagesReady && (
            <div className="why-tunafy-loading">
              <div className="why-tunafy-spinner" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WhyTunafySection;
