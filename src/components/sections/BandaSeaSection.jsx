import React, { useState } from 'react';
import './BandaSeaSection.css';
import { useTranslation } from 'react-i18next';
import bgPhoto from '../../assets/images/Tangkapan-Tuna-di-Perairan-Maluku-Utara.-Foto-USAID-for-Kieraha.com_.jpg';
import useCountAnimation from '../../hooks/useCountAnimation';

/**
 * StatCard menggunakan ref-based counter (direct DOM update).
 * countRef menunjuk ke <span> yang diupdate langsung tanpa React re-render.
 */
const StatCard = ({ endValue, label, suffix = '', duration = 2000 }) => {
  const parseEndValue = (value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const cleanValue = value.replace(/\./g, '').replace(/[+%]/g, '');
      return parseFloat(cleanValue);
    }
    return 0;
  };

  const numericEnd = parseEndValue(endValue);

  // countRef = ref ke <span>, elementRef = ref ke container card
  const { countRef, elementRef } = useCountAnimation(
    numericEnd,
    duration,
    0,
    suffix
  );

  return (
    <div className="stat-card" ref={elementRef}>
      <span className="stat-number">
        {/* countRef menunjuk ke span ini — diupdate langsung via textContent */}
        <span ref={countRef}>0</span>{suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

const BandaSeaSection = () => {
  const { t } = useTranslation();
  const statsData = [
    { endValue: 300, suffix: '+', label: t('bandaSea.stats.fishers'), duration: 2000 },
    { endValue: '5.000', suffix: '+', label: t('bandaSea.stats.logistics'), duration: 2500 },
    { endValue: 98, suffix: '%', label: t('bandaSea.stats.quality'), duration: 1800 },
    { endValue: 0, suffix: '%', label: t('bandaSea.stats.illegal'), duration: 1500 },
  ];

  const [email, setEmail] = useState('');

  const handleGetStarted = () => {
    const subject = encodeURIComponent("Inquiry about Tunafy");
    const body = encodeURIComponent(email ? `Hello, my email is ${email}. I'm interested in getting started.` : "Hello, I'm interested in getting started.");
    window.location.href = `mailto:support@tunafy.id?subject=${subject}&body=${body}`;
  };

  return (
    <section className="banda-section">
      {/* Background image */}
      <div
        className="banda-bg"
        style={{ backgroundImage: `url(${bgPhoto})` }}
      />

      {/* White gradient overlay at top */}
      <div className="banda-gradient-top" />

      {/* Content */}
      <div className="banda-content">
        <h2 className="banda-heading">
          {t('bandaSea.heading')}
        </h2>
        <p className="banda-body">
          {t('bandaSea.body')}
        </p>

        {/* Stats Cards dengan animasi counting */}
        <div className="banda-stats">
          {statsData.map((stat, index) => (
            <StatCard
              key={index}
              endValue={stat.endValue}
              suffix={stat.suffix}
              label={stat.label}
              duration={stat.duration}
            />
          ))}
        </div>

        {/* CTA Email Block */}
        <div className="banda-cta">
          <h3 className="banda-cta-title">{t('bandaSea.ctaTitle')}</h3>
          <p className="banda-cta-subtitle">{t('bandaSea.ctaSubtitle')}</p>
          <div className="banda-cta-form">
            <input
              className="banda-cta-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('bandaSea.emailPlaceholder')}
            />
            <button className="banda-cta-btn" onClick={handleGetStarted}>
              {t('bandaSea.getStarted')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BandaSeaSection;
