import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WhoFlocifySection.css';
import berandaAsset from '../../assets/images/assets beranda 2.svg';

const WhoFlocifySection = () => {
  const navigate = useNavigate();

  return (
    <section className="who-flocify-section">
      <div className="who-flocify-inner">

        {/* Left — Image (full-bleed from left edge) */}
        <div className="who-flocify-image-wrap">
          <img
            src={berandaAsset}
            alt="Mengapa Flocify"
            className="who-flocify-image"
          />
        </div>

        {/* Right — Text Content */}
        <div className="who-flocify-text">
          <p className="who-flocify-label">MENGAPA FLOCIFY</p>
          <h2 className="who-flocify-heading">
            Mitra Pasokan yang Bisa Diandalkan
          </h2>
          <p className="who-flocify-body">
            Kami hadir untuk memastikan kebutuhan bahan baku tuna bisnis Anda terpenuhi secara konsisten dari sumber terpercaya, dengan proses yang transparan dan komunikasi yang responsif.
          </p>
          <button className="who-flocify-btn" onClick={() => navigate('/about')}>
            Kontak Kami
          </button>
        </div>

      </div>
    </section>
  );
};

export default WhoFlocifySection;
