import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
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
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const currentPath = location.pathname;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const langDropdownRef = useRef(null);

  const [activeLink, setActiveLink] = useState(() => {
    if (currentPath === '/marketplace' || currentPath.startsWith('/product/')) return 'Marketplace';
    if (currentPath === '/orders') return 'Orders';
    if (currentPath === '/about' || currentPath === '/checkout') return 'Cart';
    return 'Home';
  });

  // Update active link saat location berubah
  useEffect(() => {
    if (currentPath === '/marketplace' || currentPath.startsWith('/product/')) {
      setActiveLink('Marketplace');
    } else if (currentPath === '/orders') {
      setActiveLink('Orders');
    } else if (currentPath === '/about' || currentPath === '/checkout') {
      setActiveLink('Cart');
    } else {
      setActiveLink('Home');
    }
    setMobileMenuOpen(false);
  }, [currentPath]);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [showLogo, setShowLogo] = useState(alwaysVisible);
  const [showMenu, setShowMenu] = useState(alwaysVisible);
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(alwaysVisible);

  const navLinks = [
    { name: 'Home',        label: t('nav.home'),        to: '/' },
    { name: 'Marketplace', label: t('nav.marketplace'), to: '/marketplace' },
    { name: 'Cart',        label: t('nav.cart'),        to: '/about' },
    { name: 'Orders',      label: t('nav.orders'),      to: '/orders' },
  ];

  useEffect(() => {
    if (!scrollYProgress) return;
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const newShowLogo = latest >= 0.5;
      const newShowMenu = latest >= 0.52;
      setShowLogo(newShowLogo);
      setShowMenu(newShowMenu);
      // Tutup mobile menu ketika navbar kembali ke posisi awal (animasi hero)
      if (!newShowMenu) {
        setMobileMenuOpen(false);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  useEffect(() => {
    if (!contentRef || !contentRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { setHasScrolledPastHero(entry.isIntersecting); },
      { threshold: 0, rootMargin: '-75px 0px 0px 0px' }
    );
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [contentRef]);

  const getUserInitial = () => {
    const name = user?.user_metadata?.full_name || user?.email || '';
    return name.charAt(0).toUpperCase() || '?';
  };

  const getDisplayName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/login');
  };

  // Language helpers
  const currentLang = i18n.language?.startsWith('id') ? 'id' : 'en';
  const languages = [
    { code: 'en', label: 'English',   flag: 'https://flagcdn.com/w40/gb.png', alt: 'English' },
    { code: 'id', label: 'Indonesia', flag: 'https://flagcdn.com/w40/id.png', alt: 'Indonesia' },
  ];
  const activeLang = languages.find((l) => l.code === currentLang) || languages[0];

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setLangDropdownOpen(false);
  };

  return (
    <nav className={`navbar ${hasScrolledPastHero ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Hamburger Button */}
        <button
          className={`navbar-hamburger ${showMenu ? 'visible' : 'hidden'}`}
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 12H21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 6H21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 18H21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>

        {/* Left — Navigation Links */}
        <div className={`navbar-links ${showMenu ? 'visible' : 'hidden'}`}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className={`navbar-link ${activeLink === link.name ? 'active' : ''}`}
              onClick={() => setActiveLink(link.name)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Center — Logo */}
        <div className={`navbar-logo-container ${showLogo ? 'visible' : 'hidden'}`}>
          <img src={logoTunafy} alt="Tunafy Logo" className="navbar-logo" />
        </div>

        {/* Right — Language & Login/User */}
        <div className={`navbar-actions ${showMenu ? 'visible' : 'hidden'}`}>

          {/* Language Selector */}
          <div className="navbar-language" ref={langDropdownRef}>
            <button
              className="navbar-lang-btn"
              onClick={() => setLangDropdownOpen((v) => !v)}
              aria-label="Change language"
            >
              <img src={activeLang.flag} alt={activeLang.alt} className="flag-icon" />
              <span className="navbar-lang-label">{currentLang.toUpperCase()}</span>
              <svg
                className={`arrow-down-icon${langDropdownOpen ? ' open' : ''}`}
                width="16" height="16" viewBox="0 0 24 24" fill="none"
              >
                <path d="M8 10L12 14L16 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {langDropdownOpen && (
              <div className="navbar-lang-dropdown">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`navbar-lang-option${currentLang === lang.code ? ' active' : ''}`}
                    onClick={() => handleLanguageChange(lang.code)}
                  >
                    <img src={lang.flag} alt={lang.alt} className="flag-icon" />
                    <span>{lang.label}</span>
                    {currentLang === lang.code && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Login/User */}
          {isAuthenticated ? (
            <div className="navbar-user" ref={dropdownRef}>
              <button
                className="navbar-avatar-btn"
                onClick={() => setDropdownOpen((v) => !v)}
                aria-label="User menu"
              >
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt={getDisplayName()} className="navbar-avatar-img" />
                ) : (
                  <span className="navbar-avatar-initial">{getUserInitial()}</span>
                )}
                <svg
                  className={`navbar-avatar-chevron${dropdownOpen ? ' open' : ''}`}
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                >
                  <path d="M8 10L12 14L16 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="navbar-dropdown">
                  <div className="navbar-dropdown__header">
                    <p className="navbar-dropdown__name">{getDisplayName()}</p>
                    <p className="navbar-dropdown__email">{user?.email}</p>
                  </div>
                  <div className="navbar-dropdown__divider" />
                  <Link to="/about" className="navbar-dropdown__item" onClick={() => setDropdownOpen(false)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                    </svg>
                    {t('nav.basket')}
                  </Link>
                  {(user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'seller') && (
                    <Link to="/admin" className="navbar-dropdown__item" onClick={() => setDropdownOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                      </svg>
                      {t('nav.adminPanel')}
                    </Link>
                  )}
                  <div className="navbar-dropdown__divider" />
                  <button className="navbar-dropdown__item navbar-dropdown__item--logout" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="navbar-login-btn">{t('nav.login')}</Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className={`navbar-mobile-menu${hasScrolledPastHero ? ' scrolled' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className={`navbar-mobile-link${activeLink === link.name ? ' active' : ''}`}
              onClick={() => { setActiveLink(link.name); setMobileMenuOpen(false); }}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile Language Toggle */}
          <div className="navbar-mobile-lang">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`navbar-mobile-lang-btn${currentLang === lang.code ? ' active' : ''}`}
                onClick={() => { handleLanguageChange(lang.code); setMobileMenuOpen(false); }}
              >
                <img src={lang.flag} alt={lang.alt} className="flag-icon" />
                {lang.label}
              </button>
            ))}
          </div>

          {!isAuthenticated && (
            <Link to="/login" className="navbar-mobile-link navbar-mobile-link--cta" onClick={() => setMobileMenuOpen(false)}>
              {t('nav.login')}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
