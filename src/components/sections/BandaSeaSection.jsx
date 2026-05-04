import React, { useState } from 'react';
import './BandaSeaSection.css';
import bgPhoto from '../../assets/images/webp/Tangkapan-Tuna-di-Perairan-Maluku-Utara.-Foto-USAID-for-Kieraha.com_.webp';

const PRODUCTS = [
  'Yellowfin Tuna Whole Round',
  'Cakalang (Skipjack) Whole Round',
  'Baby Tuna Whole Round',
  'Belum Tahu / Semua Produk',
];

const VOLUMES = [
  'Pilih estimasi volume...',
  'Di bawah 5 ton',
  '5 – 15 ton',
  '15 – 30 ton',
  'Di atas 30 ton',
  'Belum tahu / Fleksibel',
];

const BandaSeaSection = () => {
  const [form, setForm] = useState({
    nama: '',
    perusahaan: '',
    whatsapp: '',
    produk: [],
    volume: '',
    pesan: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (product) => {
    setForm((prev) => {
      const checked = prev.produk.includes(product);
      return {
        ...prev,
        produk: checked
          ? prev.produk.filter((p) => p !== product)
          : [...prev.produk, product],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent('Inquiry Flocify — ' + form.perusahaan);
    const body = encodeURIComponent(
      `Nama Lengkap: ${form.nama}\n` +
      `Perusahaan: ${form.perusahaan}\n` +
      `WhatsApp: ${form.whatsapp}\n` +
      `Produk: ${form.produk.join(', ')}\n` +
      `Volume/Bulan: ${form.volume}\n` +
      `Pesan: ${form.pesan}`
    );
    window.location.href = `mailto:hatta@flocify.id?subject=${subject}&body=${body}`;
    setSubmitted(true);
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

      {/* Two-column layout */}
      <div className="banda-content">

        {/* Left — Text */}
        <div className="banda-text">
          <p className="banda-label">MULAI KERJASAMA</p>
          <h2 className="banda-heading">
            Siap Berdiskusi Soal Kebutuhan Anda?
          </h2>
          <p className="banda-body">
            Ceritakan kebutuhan bisnis Anda, tim Flocify akan merespons dalam 1x24 jam.
          </p>
        </div>

        {/* Right — Inquiry Form */}
        <div className="banda-form-wrap">
          {submitted ? (
            <div className="banda-form-success">
              <span className="banda-form-success__icon">✅</span>
              <h3 className="banda-form-success__title">Inquiry Terkirim!</h3>
              <p className="banda-form-success__desc">
                Terima kasih! Tim Flocify akan menghubungi Anda via WhatsApp dalam 1×24 jam.
              </p>
            </div>
          ) : (
            <form className="banda-form" onSubmit={handleSubmit} noValidate>

              {/* Field 1 — Nama */}
              <div className="banda-field">
                <label className="banda-field__label">Nama Lengkap <span>*</span></label>
                <input
                  className="banda-field__input"
                  type="text"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  placeholder="Bapak/Ibu [Nama Anda]"
                  required
                />
              </div>

              {/* Field 2 — Perusahaan */}
              <div className="banda-field">
                <label className="banda-field__label">Nama Perusahaan <span>*</span></label>
                <input
                  className="banda-field__input"
                  type="text"
                  name="perusahaan"
                  value={form.perusahaan}
                  onChange={handleChange}
                  placeholder="PT. / CV. Nama Perusahaan"
                  required
                />
              </div>

              {/* Field 3 — WhatsApp */}
              <div className="banda-field">
                <label className="banda-field__label">Nomor WhatsApp <span>*</span></label>
                <input
                  className="banda-field__input"
                  type="tel"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="08xxxxxxxxxx"
                  required
                />
                <p className="banda-field__note">Kami akan follow up via nomor ini</p>
              </div>

              {/* Field 4 — Produk */}
              <div className="banda-field">
                <label className="banda-field__label">Produk yang Dibutuhkan <span>*</span></label>
                <div className="banda-checkboxes">
                  {PRODUCTS.map((product) => (
                    <label key={product} className="banda-checkbox">
                      <input
                        type="checkbox"
                        checked={form.produk.includes(product)}
                        onChange={() => handleCheckbox(product)}
                      />
                      <span className="banda-checkbox__box" />
                      <span className="banda-checkbox__label">{product}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Field 5 — Volume */}
              <div className="banda-field">
                <label className="banda-field__label">Estimasi Volume per Bulan <span>*</span></label>
                <select
                  className="banda-field__select"
                  name="volume"
                  value={form.volume}
                  onChange={handleChange}
                  required
                >
                  {VOLUMES.map((v) => (
                    <option key={v} value={v === VOLUMES[0] ? '' : v} disabled={v === VOLUMES[0]}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 6 — Pesan */}
              <div className="banda-field">
                <label className="banda-field__label">Pesan atau Kebutuhan Khusus</label>
                <textarea
                  className="banda-field__textarea"
                  name="pesan"
                  value={form.pesan}
                  onChange={handleChange}
                  placeholder="Ceritakan kebutuhan Anda lebih detail..."
                  rows={3}
                />
              </div>

              {/* Submit */}
              <button className="banda-form__submit" type="submit">
              Kirim Inquiry
              </button>

            </form>
          )}
        </div>

      </div>
    </section>
  );
};

export default BandaSeaSection;
