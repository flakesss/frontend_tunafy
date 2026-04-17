import React, { useEffect, useRef, useState } from 'react';
import './JangkauanSection.css';
import mapIndo from '../../assets/images/peta indo.svg';

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

const JangkauanSection = () => {
  const [sectionRef, inView] = useInView(0.1);

  return (
    <section
      ref={sectionRef}
      className={`jangkauan-section ${inView ? 'jangkauan--visible' : 'jangkauan--hidden'}`}
    >
      {/* Header */}
      <div className="jangkauan-header">
        <p className="jangkauan-label">JANGKAUAN OPERASIONAL</p>
        <h2 className="jangkauan-title">Dari Laut Maluku ke Industri Jawa</h2>
        <p className="jangkauan-desc">
          Flocify beroperasi dengan dua titik utama yang saling terhubung — sumber tangkapan di perairan Maluku dan kantor operasional di Bandung, Jawa Barat.
        </p>
        <div className="jangkauan-divider" />
      </div>

      {/* Map — tanpa animasi, tanpa cards */}
      <div className="jangkauan-map-wrap">
        <img
          src={mapIndo}
          alt="Peta operasional Flocify — dari Maluku ke Jawa"
          className="jangkauan-map-img"
        />
      </div>
    </section>
  );
};

export default JangkauanSection;
