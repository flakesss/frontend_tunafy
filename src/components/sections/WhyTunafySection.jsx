import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './WhyTunafySection.css';
import nelayanPhoto from '../../assets/images/nelayan_photo.png';

const WhyTunafySection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <section className="why-tunafy-section">
      <div className="why-tunafy-inner">
        {/* Left — Text Content */}
        <div className="why-tunafy-text">
          <p className="why-tunafy-label">{t('whyTunafy.label')}</p>
          <h2 className="why-tunafy-heading">
            {t('whyTunafy.heading')}
          </h2>
          <p className="why-tunafy-body">
            {t('whyTunafy.body')}
          </p>
          <button className="why-tunafy-btn" onClick={() => navigate('/marketplace')}>{t('whyTunafy.cta')}</button>
        </div>

        {/* Right — Image */}
        <div className="why-tunafy-image-wrap">
          <img
            src={nelayanPhoto}
            alt="Tunafy — Traceable Sourcing from Banda Sea"
            className="why-tunafy-image"
          />
        </div>
      </div>
    </section>
  );
};

export default WhyTunafySection;

