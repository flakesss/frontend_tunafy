import { useState, useEffect, useMemo } from 'react';

/**
 * Hook to preload animation images for smooth scroll-based playback
 * @param {number} totalFrames - Total number of animation frames (default: 192)
 * @returns {Object} { images, loading, progress, error }
 */
const useImagePreloader = (totalFrames = 192) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  // Generate array of image paths using Vite's import.meta.glob
  const imageModules = useMemo(() => {
    const modules = import.meta.glob(
      '/src/assets/images/foto animasi/*.png',
      { eager: false }
    );
    return modules;
  }, []);

  // Sort and extract image URLs
  const sortedImages = useMemo(() => {
    const entries = Object.entries(imageModules);
    
    // Sort by filename to ensure correct order
    entries.sort((a, b) => {
      const numA = parseInt(a[0].match(/(\d+)\.png$/)?.[1] || '0');
      const numB = parseInt(b[0].match(/(\d+)\.png$/)?.[1] || '0');
      return numA - numB;
    });

    return entries.slice(0, totalFrames);
  }, [imageModules, totalFrames]);

  useEffect(() => {
    let mounted = true;
    let loadedCount = 0;

    const preloadImages = async () => {
      try {
        setLoading(true);
        setProgress(0);

        const loadPromises = sortedImages.map(async ([path, importFn]) => {
          try {
            const module = await importFn();
            loadedCount++;
            if (mounted) {
              setProgress(Math.round((loadedCount / sortedImages.length) * 100));
            }
            return module.default;
          } catch (err) {
            console.warn(`Failed to load image: ${path}`);
            return null;
          }
        });

        const results = await Promise.all(loadPromises);
        
        if (mounted) {
          const validImages = results.filter(Boolean);
          setLoading(false);
          
          if (validImages.length === 0) {
            setError('No images could be loaded');
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    preloadImages();

    return () => {
      mounted = false;
    };
  }, [sortedImages]);

  // Get image URL for a specific frame (1-indexed)
  const getImageUrl = (frameNumber) => {
    const index = frameNumber - 1;
    if (index >= 0 && index < sortedImages.length) {
      return sortedImages[index];
    }
    return null;
  };

  return {
    loading,
    progress,
    error,
    totalImages: sortedImages.length,
    getImageUrl,
    imagePaths: sortedImages.map(([path]) => path),
  };
};

export default useImagePreloader;
