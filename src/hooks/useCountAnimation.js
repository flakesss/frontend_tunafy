import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook untuk animasi counting number
 * @param {number} end - Nilai akhir yang dituju
 * @param {number} duration - Durasi animasi dalam ms (default: 2000)
 * @param {number} start - Nilai awal (default: 0)
 * @param {string} suffix - Suffix yang ditambahkan (contoh: '+', '%')
 * @returns {Object} - { countRef, elementRef, isVisible }
 *
 * PERFORMA: Menggunakan direct DOM manipulation (countRef.current.textContent)
 * alih-alih setState, sehingga tidak ada React re-render per frame animasi.
 * Ini mengurangi dari ~240 re-render/detik (4 stat cards × 60fps) menjadi 0.
 */
const useCountAnimation = (end, duration = 2000, start = 0, suffix = '') => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);   // ref ke container (untuk IntersectionObserver)
  const countRef   = useRef(null);   // ref ke <span> teks angka (untuk direct DOM update)
  const animationFrameRef = useRef(null);

  // Handle decimal numbers (seperti 5.000)
  const hasDecimal = String(end).includes('.');
  const numericEnd = typeof end === 'string'
    ? parseFloat(end.replace(/\./g, '').replace(/[+%]/g, ''))
    : end;

  // Intersection Observer untuk mendeteksi visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Reset tampilan ke start
          if (countRef.current) {
            countRef.current.textContent = start;
          }
          setIsVisible(true);
        } else {
          setIsVisible(false);
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          // Reset tampilan
          if (countRef.current) {
            countRef.current.textContent = start;
          }
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px'
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [start]);

  // Counting animation — menggunakan direct DOM, BUKAN setState
  useEffect(() => {
    if (!isVisible) return;

    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      // Easing function (ease-out-cubic)
      const easeOut = 1 - Math.pow(1 - percentage, 3);

      let currentCount = start + (numericEnd - start) * easeOut;

      // ── Direct DOM update (tanpa setState → tanpa re-render React) ──
      if (countRef.current) {
        if (hasDecimal) {
          countRef.current.textContent = Math.floor(currentCount).toLocaleString('id-ID');
        } else {
          countRef.current.textContent = Math.floor(currentCount);
        }
      }

      if (percentage < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Pastikan nilai akhir tepat
        if (countRef.current) {
          if (hasDecimal) {
            countRef.current.textContent = numericEnd.toLocaleString('id-ID');
          } else {
            countRef.current.textContent = numericEnd;
          }
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVisible, numericEnd, duration, start, hasDecimal]);

  return { countRef, elementRef, isVisible };
};

export default useCountAnimation;
