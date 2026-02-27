import './Footer.css';
import logoTunafy from '../../assets/images/logo tunafy.png';

/* ── Social icon SVGs ─────────────────────────── */
const FacebookIcon = () => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.5 12.5C22.5 6.977 18.023 2.5 12.5 2.5C6.977 2.5 2.5 6.977 2.5 12.5C2.5 17.488 6.152 21.628 10.938 22.371V15.39H8.398V12.5H10.938V10.297C10.938 7.789 12.43 6.406 14.715 6.406C15.809 6.406 16.953 6.602 16.953 6.602V9.063H15.691C14.45 9.063 14.063 9.834 14.063 10.625V12.5H16.836L16.393 15.39H14.063V22.371C18.848 21.628 22.5 17.488 22.5 12.5Z" fill="white"/>
  </svg>
);

const XIcon = () => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 3.125H21.552L14.325 11.388L22.827 21.875H16.17L10.956 15.08L4.99 21.875H1.68L9.41 13.045L1.254 3.125H8.08L12.793 9.343L18.244 3.125ZM17.083 19.875H18.916L7.084 5H5.117L17.083 19.875Z" fill="white"/>
  </svg>
);

const WorldIcon = () => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 2.5C6.977 2.5 2.5 6.977 2.5 12.5C2.5 18.023 6.977 22.5 12.5 22.5C18.023 22.5 22.5 18.023 22.5 12.5C22.5 6.977 18.023 2.5 12.5 2.5ZM12.5 4.5C13.252 4.5 14.184 5.277 14.963 6.914C15.297 7.602 15.58 8.437 15.8 9.375H9.2C9.42 8.437 9.703 7.602 10.037 6.914C10.816 5.277 11.748 4.5 12.5 4.5ZM9.61 4.937C9.171 5.658 8.808 6.475 8.523 7.375H5.527C6.494 5.967 7.938 4.91 9.61 4.937ZM15.39 4.937C17.062 4.91 18.506 5.967 19.473 7.375H16.477C16.192 6.475 15.829 5.658 15.39 4.937ZM4.906 9.375H8.266C8.09 10.218 7.992 11.098 7.978 12H4.508C4.55 11.098 4.686 10.218 4.906 9.375ZM10.267 9.375H14.733C14.913 10.213 15.01 11.096 15.022 12H9.978C9.99 11.096 10.087 10.213 10.267 9.375ZM16.734 9.375H20.094C20.314 10.218 20.45 11.098 20.492 12H17.022C17.008 11.098 16.91 10.218 16.734 9.375ZM4.508 14H7.978C7.992 14.902 8.09 15.782 8.266 16.625H4.906C4.686 15.782 4.55 14.902 4.508 14ZM9.978 14H15.022C15.01 14.904 14.913 15.787 14.733 16.625H10.267C10.087 15.787 9.99 14.904 9.978 14ZM17.022 14H20.492C20.45 14.902 20.314 15.782 20.094 16.625H16.734C16.91 15.782 17.008 14.902 17.022 14ZM5.527 18.625H8.523C8.808 19.525 9.171 20.342 9.61 21.063C7.938 21.09 6.494 20.033 5.527 18.625ZM9.2 18.625H15.8C15.58 19.563 15.297 20.398 14.963 21.086C14.184 22.723 13.252 23.5 12.5 23.5C11.748 23.5 10.816 22.723 10.037 21.086C9.703 20.398 9.42 19.563 9.2 18.625ZM16.477 18.625H19.473C18.506 20.033 17.062 21.09 15.39 21.063C15.829 20.342 16.192 19.525 16.477 18.625Z" fill="white"/>
  </svg>
);

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* ── Left: Brand Column ──────────────────── */}
        <div className="footer-brand">
          <img src={logoTunafy} alt="Tunafy Logo" className="footer-logo" />
          <p className="footer-tagline">
            Sustainable ocean intelligence and premium seafood sourcing for the global market
          </p>

          {/* Social icons */}
          <div className="footer-socials">
            <a href="#" className="footer-social-btn" aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a href="#" className="footer-social-btn" aria-label="X / Twitter">
              <XIcon />
            </a>
            <a href="#" className="footer-social-btn" aria-label="Website">
              <WorldIcon />
            </a>
          </div>
        </div>

        {/* ── Middle: Platform Column ──────────────── */}
        <div className="footer-col">
          <h4 className="footer-col-title">Platform</h4>
          <ul className="footer-links">
            <li><a href="#">How it works</a></li>
            <li><a href="#">Features</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Testimonials</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        {/* ── Right: Compliance Column ─────────────── */}
        <div className="footer-col">
          <h4 className="footer-col-title">Compliance</h4>
          <ul className="footer-links">
            <li><a href="#">Blog</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Terms and Condition</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>

      </div>

      {/* ── Divider ────────────────────────────────── */}
      <div className="footer-divider" />

      {/* ── Bottom bar ─────────────────────────────── */}
      <div className="footer-bottom">
        <span className="footer-copy">© 2026 Tunafy. All Rights Reserved</span>
        <div className="footer-bottom-links">
          <a href="#">Cookie Policy</a>
          <a href="#">Status</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
