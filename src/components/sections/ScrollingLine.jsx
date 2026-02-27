import { useEffect, useRef } from 'react';
import './ScrollingLine.css';
import lineAsset from '../../assets/images/supergraphic_line.png';

const CSS_HEIGHT = 80; // harus sama dengan `height` di CSS

/**
 * ScrollingLine — infinite horizontal marquee, GPU-smooth tanpa reset-jump.
 *
 * Fix kunci: background-size: auto 100% menskala gambar ke tinggi CSS_HEIGHT.
 * Lebar tile yang DITAMPILKAN = naturalWidth × (CSS_HEIGHT / naturalHeight).
 * Kita set --tile-w ke nilai ini, bukan naturalWidth mentah,
 * sehingga translateX(-tile-w) bergeser PERSIS satu tile → loop seamless.
 */
const ScrollingLine = () => {
  const bgRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      if (bgRef.current && img.naturalHeight > 0) {
        // Hitung lebar tile yang benar-benar ditampilkan oleh browser
        const scale = CSS_HEIGHT / img.naturalHeight;
        const displayedTileW = Math.round(img.naturalWidth * scale);
        bgRef.current.style.setProperty('--tile-w', `${displayedTileW}px`);
      }
    };
    img.src = lineAsset;
  }, []);

  return (
    <div className="scrolling-line-wrapper" aria-hidden="true">
      <div
        ref={bgRef}
        className="scrolling-line-bg"
        style={{ backgroundImage: `url(${lineAsset})` }}
      />
    </div>
  );
};

export default ScrollingLine;


