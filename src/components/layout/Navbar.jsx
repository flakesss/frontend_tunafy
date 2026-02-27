import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import logoTunafy from '../../assets/images/logo tunafy.png';

/**
 * Navbar component
 *
 * Props:
 *  - scrollYProgress: MotionValue 0→1 dari App.jsx (null di halaman non-hero)
 *  - contentRef: ref ke section 2 untuk IntersectionObserver
 *  - alwaysVisible: jika true, semua elemen langsung tampil (untuk halaman non-hero)
 */
const Navbar = ({ scrollYProgress, contentRef, alwaysVisible = false }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const [activeLink, setActiveLink] = useState(() => {
    // Set active berdasarkan path saat ini
    if (currentPath === '/marketplace') return 'Marketplace';
    if (currentPath === '/traceability') return 'Traceability';
    if (currentPath === '/legal') return 'Legal Docs';
    return 'Home';
  });

  // alwaysVisible: langsung tampil (halaman non-hero seperti Marketplace)
  const [showLogo, setShowLogo] = useState(alwaysVisible);
  const [showMenu, setShowMenu] = useState(alwaysVisible);
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(alwaysVisible);

  const navLinks = [
    { name: 'Home',         to: '/' },
    { name: 'Marketplace',  to: '/marketplace' },
    { name: 'Traceability', to: '/traceability' },
    { name: 'Legal Docs',   to: '/legal' },
  ];

  // Subscribe ke scrollYProgress MotionValue yang SAMA dengan HeroSection
  // → timing swap logo dijamin sinkron frame-perfect
  useEffect(() => {
    if (!scrollYProgress) return;

    const unsubscribe = scrollYProgress.on('change', (latest) => {
      // Logo navbar muncul tepat saat hero logo menghilang (progress 0.5)
      setShowLogo(latest >= 0.5);
      // Links & actions fade in sedikit setelah logo muncul
      setShowMenu(latest >= 0.52);
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  // IntersectionObserver untuk mendeteksi kapan masuk section 2
  useEffect(() => {
    if (!contentRef || !contentRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Background muncul ketika section2 mulai terlihat (bahkan sebagian)
        setHasScrolledPastHero(entry.isIntersecting);
      },
      {
        threshold: 0, // Trigger segera ketika section2 mulai masuk viewport
        rootMargin: '-75px 0px 0px 0px', // Account for navbar height
      }
    );

    observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, [contentRef]);

  return (
    <nav className={`navbar ${hasScrolledPastHero ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Left — Navigation Links */}
        <div className={`navbar-links ${showMenu ? 'visible' : 'hidden'}`}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className={`navbar-link ${activeLink === link.name ? 'active' : ''}`}
              onClick={() => setActiveLink(link.name)}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Center — Logo (instan, tanpa CSS transition) */}
        <div className={`navbar-logo-container ${showLogo ? 'visible' : 'hidden'}`}>
          <img src={logoTunafy} alt="Tunafy Logo" className="navbar-logo" />
        </div>

        {/* Right — Language & Login */}
        <div className={`navbar-actions ${showMenu ? 'visible' : 'hidden'}`}>
          {/* Language Selector */}
          <div className="navbar-language">
            <div className="language-flag">
              <img
                src="https://flagcdn.com/w40/gb.png"
                alt="English"
                className="flag-icon"
              />
            </div>
            <svg className="arrow-down-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M8 10L12 14L16 10"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Login Button */}
          <button className="navbar-login-btn">Log In</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
