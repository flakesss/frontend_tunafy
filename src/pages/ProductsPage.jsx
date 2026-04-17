import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Agentation } from 'agentation';
import heroBg from '../assets/images/Tangkapan-Tuna-di-Perairan-Maluku-Utara.-Foto-USAID-for-Kieraha.com_.jpg';
import './ProductsPage.css';

import imgY1 from '../assets/images/aset foto ikan/aset yellowfin (2).jpeg';
import imgY2 from '../assets/images/aset foto ikan/aset yellowfin (3).jpeg';
import imgY3 from '../assets/images/aset foto ikan/aset yellowfin (4).jpeg';
import imgB1 from '../assets/images/aset foto ikan/aset baby tuna.jpeg';
import imgB2 from '../assets/images/aset foto ikan/aset baby tuna (2).jpeg';
import imgC1 from '../assets/images/aset foto ikan/aset yellowfin.jpeg'; // fallback

// ─── SVG Icons ────────────────────────────────────────────────────────────
const IconClipboard = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0273FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="2" width="6" height="4" rx="1"/>
    <path d="M9 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2h-3"/>
    <path d="M9 12h6M9 16h4"/>
  </svg>
);
const IconChat = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0273FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
);
const IconDocument = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0273FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="9" y1="13" x2="15" y2="13"/>
    <line x1="9" y1="17" x2="13" y2="17"/>
  </svg>
);
const IconTruck = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0273FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="M16 8h4l3 4v5h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const IconWhatsApp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// ─── Data Produk ───────────────────────────────────────────────────────────
const products = [
  {
    id: 'yellowfin',
    images: [imgY1, imgY2, imgY3],
    anchor: 'yellowfin',
    badge: '🐟 YELLOWFIN TUNA',
    name: 'Yellowfin Tuna Whole Round',
    nameLatin: 'Tuna Sirip Kuning',
    sub: 'Tuna Sirip Kuning — Sumber: Perairan Maluku',
    desc: 'Yellowfin Tuna (Thunnus albacares) merupakan jenis tuna paling populer untuk industri pengolahan — baik untuk produk loin, steak, maupun kaleng. Ditangkap dari perairan Maluku menggunakan metode handline dan pole & line yang menjaga kualitas daging tetap optimal.',
    specs: [
      { label: 'Nama Latin',       value: 'Thunnus albacares' },
      { label: 'Bentuk Produk',    value: 'Whole Round (WR)' },
      { label: 'Ukuran',           value: '10–60 kg per ekor' },
      { label: 'Kondisi',          value: 'Segar / Fresh Chilled' },
      { label: 'Asal Tangkapan',   value: 'Perairan Maluku, Indonesia' },
      { label: 'Metode Tangkap',   value: 'Handline & Pole and Line' },
      { label: 'Kapasitas Supply', value: 'Tersedia — hubungi kami' },
      { label: 'MOQ',              value: 'Hubungi tim kami' },
    ],
    tags: ['Tuna Loin', 'Tuna Steak', 'Tuna Kaleng', 'Sashimi Grade', 'Saku'],
  },
  {
    id: 'cakalang',
    images: [imgY1, imgY2, imgY3],
    anchor: 'cakalang',
    badge: '🐠 CAKALANG / SKIPJACK',
    name: 'Cakalang Whole Round',
    nameLatin: 'Skipjack Tuna',
    sub: 'Skipjack Tuna — Sumber: Perairan Maluku',
    desc: 'Cakalang (Katsuwonus pelamis) atau Skipjack Tuna merupakan bahan baku utama untuk produksi tuna kaleng dan produk olahan seafood skala industri. Dikenal dengan cita rasa yang kuat dan kandungan protein tinggi, cakalang dari Maluku menjadi pilihan utama pabrik pengolahan di seluruh Jawa.',
    specs: [
      { label: 'Nama Latin',       value: 'Katsuwonus pelamis' },
      { label: 'Bentuk Produk',    value: 'Whole Round (WR)' },
      { label: 'Ukuran',           value: '1–5 kg per ekor' },
      { label: 'Kondisi',          value: 'Segar / Fresh Chilled' },
      { label: 'Asal Tangkapan',   value: 'Perairan Maluku, Indonesia' },
      { label: 'Metode Tangkap',   value: 'Pole and Line' },
      { label: 'Kapasitas Supply', value: 'Tersedia — hubungi kami' },
      { label: 'MOQ',              value: 'Hubungi tim kami' },
    ],
    tags: ['Tuna Kaleng', 'Katsuobushi', 'Frozen Loin', 'Produk Olahan', 'Surimi'],
  },
  {
    id: 'baby-tuna',
    images: [imgB1, imgB2, imgB1],
    anchor: 'baby-tuna',
    badge: '🐟 BABY TUNA',
    name: 'Baby Tuna Whole Round',
    nameLatin: 'Tuna Kecil',
    sub: 'Tuna Kecil — Sumber: Perairan Maluku',
    desc: 'Baby Tuna merupakan tuna muda berukuran kecil yang menjadi pilihan ekonomis namun tetap berkualitas untuk industri pengolahan. Cocok untuk produksi tuna kaleng, produk olahan seafood, serta kebutuhan pakan berbasis ikan laut.',
    specs: [
      { label: 'Nama Latin',       value: 'Thunnus spp. (juvenile)' },
      { label: 'Bentuk Produk',    value: 'Whole Round (WR)' },
      { label: 'Ukuran',           value: '0.5–3 kg per ekor' },
      { label: 'Kondisi',          value: 'Segar / Fresh Chilled' },
      { label: 'Asal Tangkapan',   value: 'Perairan Maluku, Indonesia' },
      { label: 'Metode Tangkap',   value: 'Pole and Line / Handline' },
      { label: 'Kapasitas Supply', value: 'Tersedia — hubungi kami' },
      { label: 'MOQ',              value: 'Hubungi tim kami' },
    ],
    tags: ['Tuna Kaleng', 'Produk Olahan', 'Pakan Ikan', 'Frozen Whole'],
  },
];

const steps = [
  { num: '①', icon: <IconClipboard />, title: 'Kirim Inquiry', desc: 'Isi form atau hubungi kami via WhatsApp dengan detail kebutuhan Anda' },
  { num: '②', icon: <IconChat />,      title: 'Diskusi & Penawaran Harga', desc: 'Tim kami akan menghubungi Anda dalam 1×24 jam untuk diskusi lebih lanjut' },
  { num: '③', icon: <IconDocument />,  title: 'Konfirmasi & Pembayaran', desc: 'Setuju? Kami siapkan dokumen dan proses pembayaran' },
  { num: '④', icon: <IconTruck />,     title: 'Pengiriman', desc: 'Produk dikirim dari Maluku ke lokasi Anda di Jawa' },
];

// ─── Komponen ProductCard (Overview Grid) ──────────────────────────────────
const ProductCard = ({ product, onDetailClick }) => (
  <div
    className="produk-card"
    onClick={() => onDetailClick(product.anchor)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onDetailClick(product.anchor)}
  >
    <div className="produk-card__img-wrap">
      {product.images && product.images[0] ? (
        <img src={product.images[0]} alt={product.nameLatin} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div className="produk-card__img-placeholder">
          <span className="produk-card__img-icon">🐟</span>
          <span className="produk-card__img-label">Foto segera tersedia</span>
        </div>
      )}
    </div>

    <div className="produk-card__body">

      <h3 className="produk-card__name">{product.nameLatin}</h3>
      <p className="produk-card__desc">{product.desc.slice(0, 100)}…</p>

      <div className="produk-card__divider" />

      <div className="produk-card__info">
        <span className="produk-card__info-item">
          <span className="produk-card__info-dot" /> Kapasitas: Tersedia
        </span>
        <span className="produk-card__info-item">
          <span className="produk-card__info-dot" /> Bentuk: Whole Round
        </span>
      </div>

      <button className="produk-card__cta" onClick={(e) => { e.stopPropagation(); onDetailClick(product.anchor); }}>
        Lihat Detail →
      </button>
    </div>
  </div>
);

// ─── Komponen ProductDetail (Expanded Section) ────────────────────────────
const ProductDetail = ({ product, bgWhite }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const handleInquiry = () => {
    const subject = encodeURIComponent(`Inquiry Produk: ${product.name}`);
    const body = encodeURIComponent(`Halo Tim Flocify,\n\nSaya tertarik dengan produk ${product.name}.\n\nMohon informasi mengenai:\n- Harga per kg\n- Ketersediaan stok\n- Minimum order\n\nTerima kasih.`);
    window.location.href = `mailto:contact@flocify.id?subject=${subject}&body=${body}`;
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Halo Flocify, saya tertarik dengan produk ${product.name}. Boleh minta info harga dan ketersediaan?`);
    window.open(`https://wa.me/6281234567890?text=${msg}`, '_blank');
  };

  return (
    <section id={product.anchor} className={`produk-detail ${bgWhite ? 'produk-detail--white' : 'produk-detail--gray'}`}>
      <div className="produk-detail__inner">
        {/* Kiri — Visual */}
        <div className="produk-detail__visual">
          <div className="produk-detail__photo-main">
            {product.images && product.images.length > 0 ? (
              <img src={product.images[activeIdx]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
            ) : (
              <div className="produk-detail__photo-placeholder">
                <span className="produk-detail__photo-icon">🐟</span>
                <span className="produk-detail__photo-label">Foto Produk Segera Tersedia</span>
              </div>
            )}
          </div>
          <div className="produk-detail__thumbnails">
            {product.images && product.images.length > 0 ? (
              product.images.map((imgUrl, i) => (
                <div
                  key={i}
                  className={`produk-detail__thumb ${i === activeIdx ? 'produk-detail__thumb--active' : ''}`}
                  onClick={() => setActiveIdx(i)}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={imgUrl} alt={`Foto ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                </div>
              ))
            ) : (
              [0, 1, 2].map((i) => (
                <div key={i} className={`produk-detail__thumb ${i === activeIdx ? 'produk-detail__thumb--active' : ''}`}>
                  <span style={{ fontSize: '1.4rem' }}>🐟</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Kanan — Detail */}
        <div className="produk-detail__info">
          <h2 className="produk-detail__title">{product.name}</h2>

          <p className="produk-detail__desc">{product.desc}</p>

          <div className="produk-detail__divider" />

          {/* Tabel Spesifikasi */}
          <div className="produk-detail__spec-wrap">
            <table className="produk-detail__spec-table">
              <tbody>
                {product.specs.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'produk-detail__spec-row--even' : 'produk-detail__spec-row--odd'}>
                    <td className="produk-detail__spec-label">{row.label}</td>
                    <td className="produk-detail__spec-value">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tags */}
          <div className="produk-detail__tags-section">
            <span className="produk-detail__tags-label">Cocok untuk:</span>
            <div className="produk-detail__tags">
              {product.tags.map((tag) => (
                <span key={tag} className="produk-detail__tag">{tag}</span>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="produk-detail__cta-group">
            <button className="produk-detail__btn-primary" onClick={handleInquiry}>
              Tanya Ketersediaan & Harga
            </button>
            <button className="produk-detail__btn-secondary" onClick={handleWhatsApp}>
              <IconWhatsApp /> Chat via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Main Page Component ───────────────────────────────────────────────────
export default function ProductsPage() {

  const detailSectionRef = useRef(null);

  // Scroll effects
  useEffect(() => {
    document.body.style.backgroundColor = '#ffffff';
    document.documentElement.style.backgroundColor = '#ffffff';
    return () => {
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, []);



  const scrollToProduct = (anchor) => {
    const el = document.getElementById(anchor);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };



  const handleInquiryForm = () => {
    const subject = encodeURIComponent('Inquiry Produk Flocify');
    const body = encodeURIComponent('Halo Tim Flocify,\n\nSaya tertarik bermitra dengan Flocify.\n\nNama:\nPerusahaan:\nProduk yang dibutuhkan:\nVolume per bulan:\n\nTerma kasih.');
    window.location.href = `mailto:contact@flocify.id?subject=${subject}&body=${body}`;
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent('Halo Flocify, saya ingin mendapatkan penawaran harga produk tuna untuk kebutuhan industri kami.');
    window.open(`https://wa.me/6281234567890?text=${msg}`, '_blank');
  };

  return (
    <>
      <Navbar scrollYProgress={null} contentRef={null} alwaysVisible />

      {/* ── [1] PAGE HEADER ──────────────────────────────────── */}
      <header className="produk-header">
        {/* Background image */}
        <div className="produk-header__bg" style={{ backgroundImage: `url(${heroBg})` }} />
        {/* Blue overlay */}
        <div className="produk-header__overlay" />

        {/* Content */}
        <div className="produk-header__content">
          <span className="produk-header__label">PRODUK KAMI</span>
          <h1 className="produk-header__title">Tuna Premium dari Perairan Maluku</h1>
          <p className="produk-header__desc">
            Tiga produk unggulan dalam bentuk Whole Round, bersumber langsung dari nelayan Maluku untuk kebutuhan industri pengolahan skala besar.
          </p>
        </div>

        {/* Wave divider */}
        <div className="produk-header__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#F8FAFC"/>
          </svg>
        </div>
      </header>



      {/* ── [2] PRODUCT OVERVIEW ─────────────────────────────────── */}
      <section id="produk-overview" className="produk-overview">
        <div className="produk-overview__inner">
          <div className="produk-overview__header">
            <span className="produk-overview__label">PILIH PRODUK</span>
            <h2 className="produk-overview__title">Apa yang Anda Butuhkan?</h2>
            <p className="produk-overview__desc">Klik produk untuk melihat spesifikasi lengkap dan informasi pemesanan.</p>
          </div>

          <div className="produk-overview__grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onDetailClick={scrollToProduct} />
            ))}
          </div>
        </div>
      </section>

      {/* ── [3] PRODUCT DETAIL ───────────────────────────────────── */}
      <div ref={detailSectionRef}>
        {products.map((p, idx) => (
          <ProductDetail key={p.id} product={p} bgWhite={idx % 2 === 0} />
        ))}
      </div>



      {/* ── [6] CTA INQUIRY ──────────────────────────────────────── */}
      <section className="produk-cta">
        <div className="produk-cta__inner">
          <span className="produk-cta__label">SIAP BERMITRA?</span>
          <h2 className="produk-cta__title">Dapatkan Penawaran Harga Sesuai Kebutuhan Anda</h2>
          <p className="produk-cta__desc">
            Ceritakan produk dan volume yang Anda butuhkan. Tim Flocify akan merespons dalam 1×24 jam dengan penawaran harga yang kompetitif.
          </p>

          <div className="produk-cta__btns">
            <button className="produk-cta__btn-primary" onClick={handleInquiryForm}>
              Isi Form Inquiry
            </button>
            <button className="produk-cta__btn-secondary" onClick={handleWhatsApp}>
              <IconWhatsApp /> Chat via WhatsApp
            </button>
          </div>

          <p className="produk-cta__trust">
            ✓ Respons 24 jam &nbsp;·&nbsp; ✓ Tanpa komitmen awal &nbsp;·&nbsp; ✓ Harga sesuai volume
          </p>
        </div>
      </section>

      <Footer />



      {import.meta.env.DEV && <Agentation />}
    </>
  );
}
