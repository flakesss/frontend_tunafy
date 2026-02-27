import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook untuk animasi counting number
 * @param {number} end - Nilai akhir yang dituju
 * @param {number} duration - Durasi animasi dalam ms (default: 2000)
 * @param {number} start - Nilai awal (default: 0)
 * @param {string} suffix - Suffix yang ditambahkan (contoh: '+', '%')
 * @returns {Object} - { count, elementRef, isVisible }
 */
const useCountAnimation = (end, duration = 2000, start = 0, suffix = '') => {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Intersection Observer untuk mendeteksi visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Reset count ke start ketika masuk viewport
          setCount(start);
          setIsVisible(true);
        } else {
          // Stop animation dan reset ketika keluar viewport
          setIsVisible(false);
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          setCount(start);
        }
      },
      {
        threshold: 0.3, // Trigger ketika 30% elemen terlihat
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

  // Counting animation
  useEffect(() => {
    if (!isVisible) return;

    // Handle decimal numbers (seperti 5.000)
    const hasDecimal = String(end).includes('.');
    const numericEnd = typeof end === 'string' ? parseFloat(end.replace(/[+%]/g, '')) : end;
    
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      // Easing function (ease-out-cubic)
      const easeOut = 1 - Math.pow(1 - percentage, 3);
      
      let currentCount = start + (numericEnd - start) * easeOut;

      // Format angka
      if (hasDecimal) {
        // Untuk angka seperti 5.000, tampilkan dengan format Indonesia
        currentCount = Math.floor(currentCount);
        setCount(currentCount.toLocaleString('id-ID'));
      } else {
        setCount(Math.floor(currentCount));
      }

      if (percentage < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Pastikan nilai akhir sesuai
        if (hasDecimal) {
          setCount(numericEnd.toLocaleString('id-ID'));
        } else {
          setCount(numericEnd);
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVisible, end, duration, start]);

  return { count, elementRef, isVisible };
};

export default useCountAnimation;
