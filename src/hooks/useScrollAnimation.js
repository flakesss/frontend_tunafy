import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook to track scroll position and calculate current animation frame
 * @param {React.RefObject} containerRef - Reference to the scroll container
 * @param {number} totalFrames - Total number of animation frames (default: 192)
 * @returns {Object} { currentFrame, scrollProgress, isInView }
 */
const useScrollAnimation = (containerRef, totalFrames = 192) => {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);
  
  const rafRef = useRef(null);
  const lastScrollY = useRef(0);

  // Calculate frame based on scroll progress
  const calculateFrame = useCallback((progress) => {
    // Map progress (0-1) to frame number (1 to totalFrames)
    const frame = Math.floor(progress * (totalFrames - 1)) + 1;
    return Math.min(Math.max(frame, 1), totalFrames);
  }, [totalFrames]);

  // Handle scroll event with requestAnimationFrame for performance
  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the container has been scrolled through
      // Container starts at bottom of viewport (rect.top = windowHeight)
      // Container ends when rect.bottom = 0
      const scrollStart = windowHeight;
      const scrollEnd = -rect.height;
      const scrollRange = scrollStart - scrollEnd;
      
      // Current position within the scroll range
      const currentPosition = rect.top;
      
      // Calculate progress (0 when container enters viewport, 1 when it leaves)
      let progress = (scrollStart - currentPosition) / scrollRange;
      progress = Math.max(0, Math.min(1, progress));
      
      setScrollProgress(progress);
      setCurrentFrame(calculateFrame(progress));
      
      // Check if container is in view
      setIsInView(rect.bottom > 0 && rect.top < windowHeight);
      
      lastScrollY.current = window.scrollY;
    });
  }, [containerRef, calculateFrame]);

  // Set up scroll listener and Intersection Observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial calculation
    handleScroll();

    // Add scroll listener with passive option for performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll, containerRef]);

  return {
    currentFrame,
    scrollProgress,
    isInView,
  };
};

export default useScrollAnimation;
