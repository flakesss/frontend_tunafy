import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { Agentation } from 'agentation';
import heroBg from '../assets/images/webp/Tangkapan-Tuna-di-Perairan-Maluku-Utara.-Foto-USAID-for-Kieraha.com_.webp';
import './HubungiKamiPage.css';

/* ─── FAQ Data ─────────────────────────────────────────── */
const faqData = [
  {
    q: 'Berapa minimum order (MOQ) untuk pembelian?',
    a: 'Kami terbuka untuk mendiskusikan volume sesuai kebutuhan bisnis Anda. Hubungi tim kami untuk mendapatkan informasi MOQ yang spesifik per produk.',
  },
  {
    q: 'Bagaimana sistem pengiriman dari Maluku ke Jawa?',
    a: 'Pengiriman dilakukan menggunakan jalur laut dan udara tergantung volume dan urgensi. Detail biaya dan waktu pengiriman akan diinformasikan saat diskusi penawaran.',
  },
  {
    q: 'Apakah tersedia sample produk sebelum pembelian?',
    a: 'Kebijakan sample dapat didiskusikan langsung dengan tim kami tergantung volume dan jenis kerjasama yang diinginkan.',
  },
  {
    q: 'Berapa lama proses dari inquiry hingga produk diterima?',
    a: 'Setelah inquiry masuk, tim kami akan merespons dalam 1x24 jam. Proses selanjutnya bergantung pada kesepakatan harga, volume, dan jadwal pengiriman.',
  },
  {
    q: 'Produk apa saja yang tersedia saat ini?',
    a: 'Saat ini kami menyediakan Yellowfin Tuna Whole Round, Cakalang (Skipjack) Whole Round, dan Baby Tuna Whole Round — semuanya bersumber dari perairan Maluku.',
  },
];

/* ─── Trust Signals Data ────────────────────────────────── */
const trustSignals = [
  {
    icon: '⏱',
    title: '1×24 Jam',
    desc: 'Waktu respons tim kami setelah form inquiry diterima.',
  },
  {
    icon: '📋',
    title: 'Tanpa Komitmen Awal',
    desc: 'Anda bebas bertanya tanpa harus langsung deal.',
  },
  {
    icon: '💬',
    title: 'Diskusi Fleksibel',
    desc: 'Volume, jadwal, dan harga bisa didiskusikan sesuai kebutuhan.',
  },
];

/* ─── Social Media ─────────────────────────────────────── */
const socials = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/tunafy.id',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://tiktok.com',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
  },
];

/* ─── FAQ Item ─────────────────────────────────────────── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`hk-faq-item${open ? ' open' : ''}`}>
      <button className="hk-faq-header" onClick={() => setOpen((v) => !v)}>
        <span>{q}</span>
        <svg
          className={`hk-faq-chevron${open ? ' open' : ''}`}
          width="20" height="20" viewBox="0 0 24 24" fill="none"
        >
          <path d="M8 10L12 14L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="hk-faq-body">
        <p>{a}</p>
      </div>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────── */
export default function HubungiKamiPage() {
  /* ── Form state ── */
  const [form, setForm] = useState({
    nama: '',
    perusahaan: '',
    jabatan: '',
    whatsapp: '',
    produk: [],
    volume: '',
    lokasi: '',
    pesan: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const formRef = useRef(null);

  const WA_NUMBER = '628211041731'; // Nomor WA resmi Flocify
  const WA_LINK = `https://wa.me/${WA_NUMBER}?text=Halo+Flocify%2C+saya+ingin+bertanya...`;

  /* ── Produk list ── */
  const produkList = [
    'Yellowfin Tuna Whole Round',
    'Cakalang (Skipjack) Whole Round',
    'Baby Tuna Whole Round',
    'Semua Produk / Belum Tahu',
  ];

  /* ── Validation ── */
  const validate = (data) => {
    const e = {};
    if (!data.nama || data.nama.trim().length < 3) e.nama = 'Nama lengkap wajib diisi (min 3 karakter)';
    if (!data.perusahaan || data.perusahaan.trim().length < 3) e.perusahaan = 'Nama perusahaan wajib diisi';
    if (!data.whatsapp) {
      e.whatsapp = 'Nomor WhatsApp wajib diisi';
    } else if (!/^\d{10,15}$/.test(data.whatsapp)) {
      e.whatsapp = 'Masukkan nomor WhatsApp yang valid (contoh: 081234567890)';
    }
    if (!data.produk || data.produk.length === 0) e.produk = 'Pilih minimal satu produk yang dibutuhkan';
    if (!data.volume) e.volume = 'Pilih estimasi volume per bulan';
    if (!data.lokasi) e.lokasi = 'Pilih lokasi pengiriman';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const newErrors = validate({ ...form, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validate(form);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
  };

  const handleProdukChange = (item) => {
    setForm((prev) => {
      const already = prev.produk.includes(item);
      const updated = already ? prev.produk.filter((p) => p !== item) : [...prev.produk, item];
      if (touched.produk) {
        const newErrors = validate({ ...prev, produk: updated });
        setErrors((e) => ({ ...e, produk: newErrors.produk }));
      }
      return { ...prev, produk: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = { nama: true, perusahaan: true, whatsapp: true, produk: true, volume: true, lokasi: true };
    setTouched(allTouched);
    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setStatus('loading');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          timestamp: new Date().toISOString(),
          source: 'website-hubungi-kami',
        }),
      });
      if (!res.ok) throw new Error('Server error');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  /* ── Input classname helper ── */
  const inputClass = (field) => {
    if (errors[field] && touched[field]) return 'hk-input error';
    if (touched[field] && form[field] && !errors[field]) return 'hk-input valid';
    return 'hk-input';
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        'name': 'Tunafy — PT Flocify Artha Indonesia',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Nuansa Indah I No.4, Cipamokolan',
          'addressLocality': 'Kota Bandung',
          'addressRegion': 'Jawa Barat',
          'addressCountry': 'ID',
        },
        'email': 'hatta@flocify.id',
        'url': 'https://www.flocify.id',
        'openingHours': ['Mo-Fr 08:00-17:00', 'Sa 08:00-13:00'],
      }) }} />

      <Navbar alwaysVisible={true} />

      {/* ════════════════════════════ [1] PAGE HEADER ════════════════════════════ */}
      <header className="hk-header">
        {/* Background image */}
        <div className="hk-header__bg" style={{ backgroundImage: `url(${heroBg})` }} />
        {/* Blue overlay */}
        <div className="hk-header__overlay" />

        <div className="hk-header-content">
          <p className="hk-header-label">HUBUNGI KAMI</p>
          <h1 className="hk-header-title">Ada yang Bisa Kami Bantu?</h1>
          <p className="hk-header-sub">
            Tim Tunafy siap berdiskusi soal kebutuhan pasokan tuna bisnis Anda.
            Isi form di bawah atau langsung chat via WhatsApp.
          </p>
        </div>

        {/* Wave SVG divider */}
        <div className="hk-header-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#FFFFFF"/>
          </svg>
        </div>
      </header>

      {/* ════════════════════════════ [2] MAIN CONTENT ═══════════════════════════ */}
      <section className="hk-main">
        <div className="hk-main-container">

          {/* ── [2a] Form Inquiry ── */}
          <div className="hk-form-col">
            <div className="hk-form-card">

              {/* Success State */}
              {status === 'success' ? (
                <div className="hk-success">
                  <div className="hk-success-check">✓</div>
                  <h3>Inquiry Terkirim! 🎉</h3>
                  <p>
                    Terima kasih sudah menghubungi Tunafy. Tim kami akan menghubungi
                    Anda via WhatsApp dalam 1×24 jam kerja.
                  </p>
                  <p className="hk-success-note">Sambil menunggu, Anda bisa melihat detail produk kami:</p>
                  <Link to="/products" className="hk-btn-gold">Lihat Produk Kami</Link>
                </div>
              ) : (
                <>
                  {/* Form Header */}
                  <div className="hk-form-header">
                    <h2 className="hk-form-title">Kirim Inquiry</h2>
                    <p className="hk-form-sub">
                      Isi form berikut dan tim kami akan menghubungi Anda dalam 1×24 jam.
                    </p>
                  </div>

                  <div className="hk-form-body">
                  {/* Error Banner */}
                  {status === 'error' && (
                    <div className="hk-error-banner">
                      ⚠ Terjadi kesalahan. Silakan coba lagi atau{' '}
                      <a href={WA_LINK} target="_blank" rel="noopener noreferrer">langsung chat via WhatsApp</a>.
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate ref={formRef}>
                    {/* Nama Lengkap */}
                    <div className="hk-field">
                      <label htmlFor="hk-nama">Nama Lengkap <span className="req">*</span></label>
                      <input
                        id="hk-nama"
                        name="nama"
                        type="text"
                        placeholder="Bapak/Ibu [Nama Anda]"
                        className={inputClass('nama')}
                        value={form.nama}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.nama && touched.nama && (
                        <span className="hk-error-msg">⚠ {errors.nama}</span>
                      )}
                    </div>

                    {/* Nama Perusahaan */}
                    <div className="hk-field">
                      <label htmlFor="hk-perusahaan">Nama Perusahaan <span className="req">*</span></label>
                      <input
                        id="hk-perusahaan"
                        name="perusahaan"
                        type="text"
                        placeholder="PT. Nama Perusahaan"
                        className={inputClass('perusahaan')}
                        value={form.perusahaan}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.perusahaan && touched.perusahaan && (
                        <span className="hk-error-msg">⚠ {errors.perusahaan}</span>
                      )}
                    </div>

                    {/* Row: Jabatan + WA */}
                    <div className="hk-field-row">
                      <div className="hk-field">
                        <label htmlFor="hk-jabatan">Jabatan</label>
                        <input
                          id="hk-jabatan"
                          name="jabatan"
                          type="text"
                          placeholder="contoh: Manager Pengadaan"
                          className="hk-input"
                          value={form.jabatan}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="hk-field">
                        <label htmlFor="hk-whatsapp">Nomor WhatsApp <span className="req">*</span></label>
                        <input
                          id="hk-whatsapp"
                          name="whatsapp"
                          type="tel"
                          placeholder="08xxxxxxxxxx"
                          className={inputClass('whatsapp')}
                          value={form.whatsapp}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <span className="hk-field-note">Kami akan menghubungi via nomor ini</span>
                        {errors.whatsapp && touched.whatsapp && (
                          <span className="hk-error-msg">⚠ {errors.whatsapp}</span>
                        )}
                      </div>
                    </div>

                    {/* Produk */}
                    <div className="hk-field">
                      <label>Produk yang Dibutuhkan <span className="req">*</span></label>
                      <div className="hk-checkbox-group">
                        {produkList.map((item) => (
                          <label key={item} className="hk-checkbox-label">
                            <input
                              type="checkbox"
                              className="hk-checkbox"
                              checked={form.produk.includes(item)}
                              onChange={() => handleProdukChange(item)}
                            />
                            <span className="hk-checkbox-custom" />
                            {item}
                          </label>
                        ))}
                      </div>
                      {errors.produk && touched.produk && (
                        <span className="hk-error-msg">⚠ {errors.produk}</span>
                      )}
                    </div>

                    {/* Volume */}
                    <div className="hk-field">
                      <label htmlFor="hk-volume">Estimasi Volume per Bulan <span className="req">*</span></label>
                      <div className="hk-select-wrap">
                        <select
                          id="hk-volume"
                          name="volume"
                          className={inputClass('volume')}
                          value={form.volume}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option value="" disabled>Pilih estimasi volume...</option>
                          <option value="Di bawah 5 ton">Di bawah 5 ton</option>
                          <option value="5 – 15 ton">5 – 15 ton</option>
                          <option value="15 – 30 ton">15 – 30 ton</option>
                          <option value="Di atas 30 ton">Di atas 30 ton</option>
                          <option value="Belum tahu / Fleksibel">Belum tahu / Fleksibel</option>
                        </select>
                        <svg className="hk-select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M8 10L12 14L16 10" stroke="#0273FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="hk-field-note">Volume ini untuk estimasi awal, bisa didiskusikan lebih lanjut</span>
                      {errors.volume && touched.volume && (
                        <span className="hk-error-msg">⚠ {errors.volume}</span>
                      )}
                    </div>

                    {/* Lokasi */}
                    <div className="hk-field">
                      <label htmlFor="hk-lokasi">Lokasi Pengiriman <span className="req">*</span></label>
                      <div className="hk-select-wrap">
                        <select
                          id="hk-lokasi"
                          name="lokasi"
                          className={inputClass('lokasi')}
                          value={form.lokasi}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option value="" disabled>Pilih lokasi...</option>
                          <option value="Jakarta & sekitarnya">Jakarta &amp; sekitarnya</option>
                          <option value="Jawa Barat (Bandung, Bekasi, dll)">Jawa Barat (Bandung, Bekasi, dll)</option>
                          <option value="Jawa Tengah">Jawa Tengah</option>
                          <option value="Jawa Timur (Surabaya, Sidoarjo, dll)">Jawa Timur (Surabaya, Sidoarjo, dll)</option>
                          <option value="Luar Jawa">Luar Jawa</option>
                          <option value="Belum ditentukan">Belum ditentukan</option>
                        </select>
                        <svg className="hk-select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M8 10L12 14L16 10" stroke="#0273FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      {errors.lokasi && touched.lokasi && (
                        <span className="hk-error-msg">⚠ {errors.lokasi}</span>
                      )}
                    </div>

                    {/* Pesan */}
                    <div className="hk-field">
                      <label htmlFor="hk-pesan">Pesan atau Kebutuhan Khusus</label>
                      <textarea
                        id="hk-pesan"
                        name="pesan"
                        rows={4}
                        placeholder="Ceritakan lebih detail kebutuhan bisnis Anda di sini... (opsional)"
                        className="hk-input hk-textarea"
                        value={form.pesan}
                        onChange={handleChange}
                        maxLength={500}
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className={`hk-btn-submit${status === 'loading' ? ' loading' : ''}`}
                      disabled={status === 'loading'}
                      id="hk-submit-btn"
                    >
                      {status === 'loading' ? (
                        <>
                          <span className="hk-spinner" />
                          Mengirim...
                        </>
                      ) : 'Kirim Inquiry →'}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="hk-divider">
                    <span />
                    <small>atau</small>
                    <span />
                  </div>

                  {/* WA Alternatif */}
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hk-btn-wa"
                    id="hk-wa-alt-btn"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Chat Langsung via WhatsApp
                  </a>
                  </div>{/* end hk-form-body */}
                </>
              )}
            </div>
          </div>

          {/* ── [2b] Info Kontak ── */}
          <aside className="hk-contact-col">

            {/* WhatsApp Card */}
            <div className="hk-card hk-card-wa">
              <div className="hk-card-icon" style={{ color: '#25D366', fontSize: 36 }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <span className="hk-card-badge">PALING CEPAT</span>
              <h3>Chat via WhatsApp</h3>
              <p>Respons langsung dari tim kami. Biasanya dibalas dalam beberapa menit di jam kerja.</p>
              <a href={`tel:+${WA_NUMBER}`} className="hk-wa-number">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.7 9.5a19.79 19.79 0 01-3.07-8.67 2 2 0 012-2.18h3.06a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7a2 2 0 011.72 2.03z"/></svg>
                0821-1041-731
              </a>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="hk-btn-wa-card">
                Mulai Chat →
              </a>
            </div>

            {/* Email Card */}
            <div className="hk-card hk-card-email">
              <div className="hk-card-icon" style={{ color: '#0273FF', fontSize: 36 }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h3>Kirim Email</h3>
              <p>Untuk inquiry formal atau yang membutuhkan dokumen pendukung.</p>
              <a href="mailto:hatta@flocify.id" className="hk-email-link">hatta@flocify.id</a>
              <span className="hk-card-note">Dibalas dalam 1×24 jam kerja</span>
            </div>

            {/* Office Card */}
            <div className="hk-card hk-card-office">
              <div className="hk-card-icon" style={{ color: '#0273FF' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h3>Kantor Kami</h3>
              <address className="hk-address">
                Nuansa Indah I No.4, Cipamokolan,<br/>
                Kec. Rancasari Bandung
              </address>
              <a
                href="https://share.google/Y27u9mA3KLNfXx1bb"
                target="_blank"
                rel="noopener noreferrer"
                className="hk-maps-link"
              >
                Buka di Google Maps →
              </a>
            </div>

            {/* Jam Operasional */}
            <div className="hk-jam-ops">
              <h4>Jam Operasional</h4>
              <table className="hk-jam-table">
                <tbody>
                  <tr><td>Senin – Jumat</td><td>08.00 – 17.00 WIB</td></tr>
                  <tr><td>Sabtu</td><td>08.00 – 13.00 WIB</td></tr>
                  <tr><td>Minggu</td><td className="hk-libur">Libur</td></tr>
                </tbody>
              </table>
              <p className="hk-jam-note">Di luar jam kerja? Kirim WA — kami akan balas saat jam kerja dimulai.</p>
            </div>

            {/* Sosial Media */}
            <div className="hk-social">
              <span className="hk-social-label">Ikuti Kami:</span>
              <div className="hk-social-icons">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hk-social-icon"
                    aria-label={s.name}
                    title={s.name}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </section>

      {/* ════════════════════════════ [3] INFO OPERASIONAL ═══════════════════════ */}
      <section className="hk-info">
        <div className="hk-info-container">
          <p className="hk-section-label">YANG PERLU ANDA TAHU</p>
          <h2 className="hk-section-title">Pertanyaan yang Sering Ditanyakan</h2>

          {/* Trust Signals */}
          <div className="hk-trust-grid">
            {trustSignals.map((ts) => (
              <div key={ts.title} className="hk-trust-card">
                <span className="hk-trust-icon">{ts.icon}</span>
                <h4>{ts.title}</h4>
                <p>{ts.desc}</p>
              </div>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="hk-faq-list">
            {faqData.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════ [4] PETA LOKASI ════════════════════════════ */}
      <section className="hk-map-section">
        <div className="hk-map-container">
          <div className="hk-map-info">
            <p className="hk-section-label">LOKASI KANTOR</p>
            <h2>Kunjungi Kami di Bandung</h2>

            <div className="hk-map-detail">
              <span>📍</span>
              <div>
                <strong>Alamat</strong>
                <p>Nuansa Indah I No.4, Cipamokolan,<br/>Kec. Rancasari Bandung</p>
              </div>
            </div>

            <div className="hk-map-detail">
              <span>🕐</span>
              <div>
                <strong>Jam Buka</strong>
                <p>Senin – Jumat: 08.00 – 17.00 WIB<br/>Sabtu: 08.00 – 13.00 WIB</p>
              </div>
            </div>

            <div className="hk-map-detail">
              <span>✉️</span>
              <div>
                <strong>Email</strong>
                <p><a href="mailto:hatta@flocify.id">hatta@flocify.id</a></p>
              </div>
            </div>

            <div className="hk-map-detail">
              <span>🌐</span>
              <div>
                <strong>Website</strong>
                <p><a href="https://www.flocify.id" target="_blank" rel="noopener noreferrer">www.flocify.id</a></p>
              </div>
            </div>

            <a
              href="https://share.google/Y27u9mA3KLNfXx1bb"
              target="_blank"
              rel="noopener noreferrer"
              className="hk-btn-gold"
              style={{ marginTop: '24px', display: 'inline-block' }}
            >
              Buka di Google Maps →
            </a>
            <p className="hk-map-note">Disarankan membuat janji terlebih dahulu sebelum berkunjung.</p>
          </div>

          <div className="hk-map-embed">
            <iframe
              title="Lokasi Kantor Flocify"
              src="https://maps.google.com/maps?q=Nuansa+Indah+I+No.4,+Cipamokolan,+Kec.+Rancasari,+Bandung&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=&amp;output=embed"
              width="100%"
              height="360"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
      {import.meta.env.DEV && <Agentation />}
    </>
  );
}
