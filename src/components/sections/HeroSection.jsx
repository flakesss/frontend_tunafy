import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './HeroSection.css';

import heroBackground from '../../assets/images/Gemini_Generated_Image_wf99d8wf99d8wf99(1).webp';

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="hero-container">
      <div className="hero-sticky-wrapper">

        {/* Background statis — frame pertama WebP */}
        <div className="hero-animation-container">
          <img
            src={heroBackground}
            alt="Hero background"
            className="hero-static-bg"
          />
          <div className="hero-blue-overlay" />
          <div className="hero-gradient-overlay" />
          <div className="hero-bottom-gradient" />
        </div>

        {/* Teks & CTA */}
        <div className="hero-text-wrapper">
          <div className="hero-text-container">
            <span className="hero-tagline">{t('hero.tagline')}</span>
            <h1 className="hero-title">Tuna Premium Maluku, Langsung untuk Bisnis Anda.</h1>
            <p className="hero-description">Flocify menghubungkan pabrik pengolahan dan distributor seafood dengan sumber tuna terbaik dari perairan Maluku konsisten, berkualitas, dan mudah diakses.</p>
            <button className="hero-cta-button" onClick={() => navigate('/products')}>
              Lihat Produk
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
