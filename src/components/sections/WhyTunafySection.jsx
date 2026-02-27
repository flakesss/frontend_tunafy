import { useRef, useMemo, useState, useEffect } from 'react';
import { useScroll } from 'framer-motion';
import './WhyTunafySection.css';

const TOTAL_FRAMES = 83;
const START_FRAME  = 41; // animasi mulai dari frame 45

const WhyTunafySection = () => {
  // Ref untuk section ini (target scroll) dan img element (update langsung di DOM)
  const sectionRef = useRef(null);
  const imageRef   = useRef(null);

  const [imagesReady, setImagesReady] = useState(false);

  // Scroll progress: 0 = section mulai masuk viewport, 1 = section habis keluar
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Lazy-load semua frame dari folder /src/assets/images/frame/
  const imageModules = useMemo(() => {
    return import.meta.glob('/src/assets/images/frame/FRAME *.png', { eager: true });
  }, []);

  // Sort secara numerik: "FRAME 1.png" < "FRAME 2.png" < ... < "FRAME 83.png"
  const sortedImageUrls = useMemo(() => {
    const entries = Object.entries(imageModules);
    entries.sort((a, b) => {
      const numA = parseInt(a[0].match(/FRAME (\d+)\.png$/)?.[1] || '0');
      const numB = parseInt(b[0].match(/FRAME (\d+)\.png$/)?.[1] || '0');
      return numA - numB;
    });
    // Slice dari START_FRAME-1 (index 44) sampai TOTAL_FRAMES (index 82)
    return entries.slice(START_FRAME - 1, TOTAL_FRAMES).map(([, mod]) => mod.default);
  }, [imageModules]);

  // Preload semua frame ke cache browser
  useEffect(() => {
    if (sortedImageUrls.length === 0) return;
    let loaded = 0;
    const total = sortedImageUrls.length;

    const preload = (url) =>
      new Promise((resolve) => {
        const img = new Image();
        const done = () => { loaded++; resolve(); };
        img.onload = done;
        img.onerror = done;
        img.src = url;
      });

    Promise.all(sortedImageUrls.map(preload)).then(() => setImagesReady(true));
  }, [sortedImageUrls]);

  // Update frame langsung di DOM saat scroll — tanpa re-render
  useEffect(() => {
    if (!imagesReady) return;

    const unsubscribe = scrollYProgress.on('change', (latest) => {
      // Animasi mulai dari 0% scroll section dan selesai di 100%
      const clamped = Math.max(0, Math.min(latest, 1));
      const idx = Math.round(clamped * (TOTAL_FRAMES - 1));

      if (imageRef.current && sortedImageUrls[idx]) {
        imageRef.current.src = sortedImageUrls[idx];
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, sortedImageUrls, imagesReady]);

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

        {/* Right — Animated frame image */}
        <div className="why-tunafy-image-wrap">
          {/* Tampilkan frame pertama langsung; frame berikutnya diupdate via ref */}
          {sortedImageUrls.length > 0 && (
            <img
              ref={imageRef}
              src={sortedImageUrls[0]}
              alt="Tunafy — Traceable Sourcing from Banda Sea"
              className="why-tunafy-image"
            />
          )}

          {/* Loading overlay saat preload belum selesai */}
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

