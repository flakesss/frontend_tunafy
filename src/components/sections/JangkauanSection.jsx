import React from 'react';
import './JangkauanSection.css';
import mapIndo from '../../assets/images/peta indo.svg';

const JangkauanSection = () => {
  return (
    <section className="jangkauan-section">
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
