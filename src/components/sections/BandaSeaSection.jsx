import './BandaSeaSection.css';
import bgPhoto from '../../assets/images/Tangkapan-Tuna-di-Perairan-Maluku-Utara.-Foto-USAID-for-Kieraha.com_.jpg';
import useCountAnimation from '../../hooks/useCountAnimation';

// Komponen StatCard dengan animasi counting
const StatCard = ({ endValue, label, suffix = '', duration = 2000 }) => {
  // Parse nilai akhir dari string (contoh: "300+" -> 300)
  const parseEndValue = (value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      // Handle format Indonesia (5.000 -> 5000)
      const cleanValue = value.replace(/\./g, '').replace(/[+%]/g, '');
      return parseFloat(cleanValue);
    }
    return 0;
  };

  // Detect if value has decimal format (like "5.000")
  const hasDecimalFormat = typeof endValue === 'string' && endValue.includes('.');
  const numericEnd = parseEndValue(endValue);
  
  const { count, elementRef, isVisible } = useCountAnimation(
    numericEnd,
    duration,
    0,
    suffix
  );

  // Format display value
  const formatValue = () => {
    if (hasDecimalFormat) {
      // Format dengan titik sebagai pemisah ribuan (format Indonesia)
      return count.toLocaleString('id-ID');
    }
    return count;
  };

  return (
    <div className="stat-card" ref={elementRef}>
      <span className="stat-number">
        {formatValue()}{suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

const BandaSeaSection = () => {
  // Data statistik dengan nilai target dan suffix
  const statsData = [
    { endValue: 300, suffix: '+', label: 'Traceable Fishers', duration: 2000 },
    { endValue: '5.000', suffix: '+', label: 'Daily Tuna Logistics', duration: 2500 },
    { endValue: 98, suffix: '%', label: 'Average Quality', duration: 1800 },
    { endValue: 0, suffix: '%', label: 'Illegal Fishing', duration: 1500 },
  ];

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
          Connecting Indonesian Fisheries to Global
        </h2>
        <p className="banda-body">
          We empower traceable and sustainable seafood commerce in the Coral Triangle, facilitating the Southeast Asian region to directly serve markets like Japan ensured with ease of access and complete legality.
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
          {/* Heading */}
          <h3 className="banda-cta-title">Fresh Tuna Direct From Maluku</h3>

          {/* Subtitle */}
          <p className="banda-cta-subtitle">Traceable, Trusted, and Legal</p>

          {/* Email input bar */}
          <div className="banda-cta-form">
            <input
              className="banda-cta-input"
              type="email"
              placeholder="Enter your email"
            />
            <button className="banda-cta-btn">Get Started</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BandaSeaSection;
