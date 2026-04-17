import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Agentation } from 'agentation';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import heroBg from '../assets/images/Tangkapan-Tuna-di-Perairan-Maluku-Utara.-Foto-USAID-for-Kieraha.com_.jpg';
import storyAsset from '../assets/images/Page 7898 1.svg';
import storyPhoto from '../assets/images/assets story.svg';
import mapIndo from '../assets/images/peta indo.svg';
import './AboutPage.css';

// ─── SVG Icons ────────────────────────────────────────────────────────────
const IconEye = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0273FF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconStar = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0273FF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconLeaf = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0273FF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8C8 10 5.9 16.17 3.82 19.34C3.56 19.71 3.34 20 3 20"/>
    <path d="M21 3C17 3 5 5 5 17"/>
  </svg>
);
const IconLinkedIn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

// ─── Data ──────────────────────────────────────────────────────────────────
const missions = [
  {
    num: '①',
    title: 'Pemberdayaan Supplier Lokal',
    desc: 'Menjalin kemitraan strategis dengan supplier lokal untuk menjamin stabilitas pasokan dan kualitas produk yang kompetitif.',
  },
  {
    num: '②',
    title: 'Efisiensi Rantai Pasok',
    desc: 'Membangun jalur logistik terintegrasi yang menghubungkan titik produksi daerah ke pasar B2B domestik dan global.',
  },
  {
    num: '③',
    title: 'Standarisasi Kualitas',
    desc: 'Menerapkan standar profesional dan akuntabilitas dalam setiap tahap untuk meningkatkan nilai jual komoditas perikanan Indonesia.',
  },
  {
    num: '④',
    title: 'Transformasi Ekosistem',
    desc: 'Menciptakan sistem perdagangan yang andal dan berkelanjutan yang memberikan nilai jangka panjang bagi seluruh pemangku kepentingan.',
  },
];

const values = [
  {
    icon: <IconEye />,
    title: 'Transparansi',
    desc: 'Kami percaya bahwa kejujuran dan keterbukaan adalah fondasi kemitraan yang kuat dan bertahan lama.',
  },
  {
    icon: <IconStar />,
    title: 'Profesional',
    desc: 'Setiap proses dijalankan dengan standar tinggi dan akuntabilitas yang dapat dipertanggungjawabkan.',
  },
  {
    icon: <IconLeaf />,
    title: 'Berkelanjutan',
    desc: 'Kami berkomitmen pada praktik perdagangan yang mendukung nelayan lokal dan kelestarian sumber daya laut Indonesia.',
  },
];

const team = [
  {
    initials: 'H',
    name: 'Haqqy',
    role: 'CEO',
    desc: 'Memimpin visi dan strategi Flocify. Berpengalaman di bidang perdagangan komoditas dan pengembangan bisnis industri perikanan Indonesia.',
  },
  {
    initials: 'F',
    name: 'Flakes',
    role: 'CMO',
    desc: 'Mengelola strategi pemasaran dan pengembangan mitra B2B. Ahli dalam membangun relasi dengan pelaku industri pengolahan seafood.',
  },
];

// ─── useInView hook ────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── Misi Pill Card Component ──────────────────────────────────────────────
function MisiPill({ mission, side, bg }) {
  return (
    <div className={`about-misi-pill about-misi-pill--${side}`}>
      <div className="about-misi-pill__bg" style={{ backgroundImage: `url(${bg})` }} />
      <div className={`about-misi-pill__overlay about-misi-pill__overlay--${side}`} />
      <div className={`about-misi-pill__content about-misi-pill__content--${side}`}>
        <h4 className="about-misi-pill__title">{mission.title}</h4>
        <p className="about-misi-pill__desc">{mission.desc}</p>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function AboutPage() {
  useEffect(() => {
    document.body.style.backgroundColor = '#ffffff';
    document.documentElement.style.backgroundColor = '#ffffff';
    return () => {
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, []);

  const [mapLineOffset, setMapLineOffset] = useState(0);
  useEffect(() => {
    let frame;
    let offset = 0;
    const animate = () => {
      offset = (offset + 0.4) % 20;
      setMapLineOffset(offset);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleContact = () => {
    const subject = encodeURIComponent('Inquiry Kemitraan — Flocify');
    const body = encodeURIComponent('Halo Tim Flocify,\n\nSaya tertarik untuk berdiskusi tentang kemitraan.\n\nNama:\nPerusahaan:\nKebutuhan:\n\nTerima kasih.');
    window.location.href = `mailto:contact@tunafy.id?subject=${subject}&body=${body}`;
  };

  const [storyRef, storyVisible] = useInView();
  const [visiRef, visiVisible] = useInView();
  const [nilaiRef, nilaiVisible] = useInView();
  const [petaRef, petaVisible] = useInView();
  const [timRef, timVisible] = useInView();
  const [ctaRef, ctaVisible] = useInView();

  return (
    <>
      <Navbar scrollYProgress={null} contentRef={null} alwaysVisible />

      {/* ── [1] HERO HEADER ───────────────────────────────────────────── */}
      <div className="about-hero">
        <div className="about-hero__bg" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="about-hero__overlay" />
        <div className="about-hero__content">
          <span className="about-hero__label">TENTANG FLOCIFY</span>
          <h1 className="about-hero__title">
            Membawa Tuna Terbaik Maluku ke Meja Industri Indonesia
          </h1>
          <p className="about-hero__desc">
            Kami adalah perusahaan perdagangan hasil laut yang percaya bahwa kekayaan laut Indonesia layak sampai ke tangan yang tepat — dengan cara yang jujur, efisien, dan berkelanjutan.
          </p>
        </div>
        <div className="about-hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#ffffff"/>
          </svg>
        </div>
      </div>

      {/* ── [2] CERITA TUNAFY ─────────────────────────────────────────── */}
      <section
        ref={storyRef}
        className={`about-story ${storyVisible ? 'about-section--visible' : 'about-section--hidden'}`}
      >
        <img src={storyAsset} alt="" className="about-story__supergraphic" aria-hidden="true" />
        <div className="about-story__inner">
          <div className="about-story__text">
            <span className="about-label about-label--gold">SIAPA KAMI ?</span>
            <h2 className="about-story__title">
              Agregator Terpercaya untuk Distribusi Perikanan Indonesia
            </h2>
            <div className="about-story__divider" />
            <p className="about-story__para">
              Flocify lahir dari keyakinan bahwa kekayaan laut Indonesia — khususnya tuna terbaik dari perairan Maluku — layak sampai ke tangan industri pengolahan yang tepat, dengan cara yang jujur, efisien, dan berkelanjutan.
            </p>
            <div className="about-story__infobox">
              <div className="about-story__info-row">
                <span className="about-story__info-icon">🏢</span>
                <p className="about-story__info-detail">PT Flocify Artha Indonesia · Bandung, Jawa Barat</p>
              </div>
              <div className="about-story__info-row">
                <span className="about-story__info-icon">🌐</span>
                <p className="about-story__info-detail">www.tunafy.id</p>
              </div>
              <div className="about-story__info-row">
                <span className="about-story__info-icon">✉️</span>
                <p className="about-story__info-detail">contact@tunafy.id</p>
              </div>
            </div>
          </div>
          <div className="about-story__visual">
            <img src={storyPhoto} alt="Flocify Story" className="about-story__photo-img" />
          </div>
        </div>
      </section>

      {/* ── [3] VISI & MISI ───────────────────────────────────────────── */}
      <section
        ref={visiRef}
        className={`about-visimisi ${visiVisible ? 'about-section--visible' : 'about-section--hidden'}`}
      >
        {/* Visi */}
        <div className="about-visimisi__visi">
          <span className="about-label about-label--gold">VISI KAMI</span>
          <h2 className="about-visimisi__visi-title">
            Menjadi jembatan utama yang membawa produk perikanan terbaik dari Indonesia ke pasar nasional dan global.
          </h2>
          <div className="about-visimisi__visi-divider" />
          <p className="about-visimisi__visi-desc">
            Melalui ekosistem perdagangan yang transparan, efisien, dan berstandar profesional — kami hadir untuk mengangkat nilai komoditas perikanan Indonesia.
          </p>
        </div>

        {/* Misi — Pill Cards 2×2 */}
        <div className="about-visimisi__misi">
          <div className="about-misi-header">
            <span className="about-label about-label--gold">MISI KAMI</span>
            <h3 className="about-visimisi__misi-subtitle">Empat Pilar yang Menggerakkan Kami</h3>
            <div className="about-section-divider" />
          </div>
          {/* Row 1 */}
          <div className="about-misi-row">
            <MisiPill mission={missions[0]} side="left"  bg={heroBg} />
            <MisiPill mission={missions[1]} side="right" bg={heroBg} />
          </div>
          {/* Row 2 */}
          <div className="about-misi-row">
            <MisiPill mission={missions[2]} side="left"  bg={heroBg} />
            <MisiPill mission={missions[3]} side="right" bg={heroBg} />
          </div>
        </div>
      </section>

      {/* ── [4] JANGKAUAN OPERASIONAL HEADER ─────────────────────────── */}
      <section
        ref={nilaiRef}
        className={`about-jangkauan-header ${nilaiVisible ? 'about-section--visible' : 'about-section--hidden'}`}
      >
        <div className="about-jangkauan-header__inner">
          <span className="about-label about-label--gold">JANGKAUAN OPERASIONAL</span>
          <h2 className="about-jangkauan-header__title">Dari Laut Maluku ke Industri Jawa</h2>
          <p className="about-jangkauan-header__desc">
            Flocify beroperasi dengan dua titik utama yang saling terhubung — sumber tangkapan di perairan Maluku dan kantor operasional di Bandung, Jawa Barat.
          </p>
          <div className="about-section-divider" />
        </div>
      </section>

      {/* ── [5] PETA ─────────────────────────────────────────────────── */}
      <section
        ref={petaRef}
        className={`about-peta ${petaVisible ? 'about-section--visible' : 'about-section--hidden'}`}
      >
        <img src={mapIndo} alt="Peta operasional Flocify — dari Maluku ke Jawa" className="about-peta__map-img" />
      </section>

      {/* ── [6] TIM ───────────────────────────────────────────────────── */}
      <section
        ref={timRef}
        className={`about-tim ${timVisible ? 'about-section--visible' : 'about-section--hidden'}`}
      >
        <div className="about-tim__inner">
          <div className="about-tim__header">
            <span className="about-label about-label--gold">TIM KAMI</span>
            <h2 className="about-tim__title">Orang-Orang di Balik Flocify</h2>
            <p className="about-tim__desc">
              Tim kecil yang bergerak cepat — dengan pengalaman di bidang perdagangan, teknologi, dan industri perikanan Indonesia.
            </p>
            <div className="about-section-divider" />
          </div>
          <div className="about-tim__grid">
            {team.map((member, i) => (
              <div key={i} className="about-tim-card">
                <div className="about-tim-card__photo">
                  <span className="about-tim-card__initials">{member.initials}</span>
                </div>
                <h3 className="about-tim-card__name">{member.name}</h3>
                <span className="about-tim-card__role">{member.role}</span>
                <p className="about-tim-card__desc">{member.desc}</p>
                <button className="about-tim-card__linkedin" aria-label="LinkedIn">
                  <IconLinkedIn /> LinkedIn
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── [7] CTA ───────────────────────────────────────────────────── */}
      <section
        ref={ctaRef}
        className={`about-cta ${ctaVisible ? 'about-section--visible' : 'about-section--hidden'}`}
      >
        <div className="about-cta__inner">
          <span className="about-label about-label--gold">SIAP BERMITRA?</span>
          <h2 className="about-cta__title">Mari Wujudkan Kerjasama yang Saling Menguntungkan</h2>
          <p className="about-cta__desc">
            Kami terbuka untuk berdiskusi soal kebutuhan pasokan tuna bisnis Anda — tanpa komitmen awal, cukup ceritakan kebutuhan Anda.
          </p>
          <div className="about-cta__btns">
            <button className="about-cta__btn-primary" onClick={handleContact}>Hubungi Kami Sekarang</button>
            <Link to="/products" className="about-cta__btn-secondary">Lihat Produk Kami</Link>
          </div>
          <p className="about-cta__trust">
            ✓ Respons dalam 24 jam &nbsp;·&nbsp; ✓ Diskusi tanpa komitmen &nbsp;·&nbsp; ✓ Tim siap membantu
          </p>
        </div>
      </section>

      <Footer />
      {import.meta.env.DEV && <Agentation />}
    </>
  );
}
