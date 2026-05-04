import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WhyTunafySection.css';
import storyAsset from '../../assets/images/webp/assets story.webp';

const WhyTunafySection = () => {
  const navigate = useNavigate();

  return (
    <section className="why-tunafy-section">
      <div className="why-tunafy-inner">
        {/* Left — Text Content */}
        <div className="why-tunafy-text">
          <p className="why-tunafy-label">SIAPA KAMI ?</p>
          <h2 className="why-tunafy-heading">
            Agregator Terpercaya untuk Distribusi Perikanan Indonesia
          </h2>
          <p className="why-tunafy-body">
            Flocify adalah perusahaan perdagangan hasil laut yang menghubungkan sumber tuna unggulan dari Maluku ke pasar nasional. Kami berkomitmen pada efisiensi rantai pasok, transparansi proses, dan kualitas produk di setiap tahap distribusi.
          </p>

          {/* Stats row */}
          <div className="why-tunafy-stats">
            <div className="why-tunafy-stat">
              <span className="why-tunafy-stat-value">15–26 Ton</span>
              <span className="why-tunafy-stat-label">Kapasitas/Hari</span>
            </div>
            <div className="why-tunafy-stat">
              <span className="why-tunafy-stat-value">3 Produk</span>
              <span className="why-tunafy-stat-label">Unggulan</span>
            </div>
            <div className="why-tunafy-stat">
              <span className="why-tunafy-stat-value">Maluku</span>
              <span className="why-tunafy-stat-label">Sumber Tangkapan</span>
            </div>
          </div>
        </div>

        {/* Right — Image */}
        <div className="why-tunafy-image-wrap">
          <img
            src={storyAsset}
            alt="Flocify Story"
            className="why-tunafy-image"
          />
        </div>
      </div>
    </section>
  );
};

export default WhyTunafySection;
