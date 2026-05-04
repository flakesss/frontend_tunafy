import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductsSection.css';
import imgY1 from '../../assets/images/aset foto ikan/webp/aset yellowfin (2).webp';
import imgC1 from '../../assets/images/aset foto ikan/webp/aset yellowfin.webp';
import imgB1 from '../../assets/images/aset foto ikan/webp/aset baby tuna.webp';

const products = [
  {
    id: 'yellowfin',
    name: 'Yellowfin Tuna Whole Round',
    description: 'Tuna sirip kuning premium, tangkapan langsung dari perairan Banda Maluku.',
    cta: 'Tanya Ketersediaan & Harga →',
    size: 'large',
    ctaStyle: 'btn',
  },
  {
    id: 'skipjack',
    name: 'Cakalang (Skipjack) Whole Round',
    description: 'Cakalang segar berkualitas tinggi, bahan baku andalan industri pengolahan.',
    cta: 'Tanya Ketersediaan & Harga →',
    size: 'small',
    ctaStyle: 'link',
  },
  {
    id: 'baby-tuna',
    name: 'Baby Tuna Whole Round',
    description: 'Ukuran kecil, kualitas terjaga pilihan ekonomis untuk produksi skala besar.',
    cta: 'Tanya Ketersediaan & Harga →',
    size: 'small',
    ctaStyle: 'link',
  },
];

const ProductsSection = () => {
  const navigate = useNavigate();

  return (
    <section className="products-section">
      <div className="products-inner">

        {/* Heading text block */}
        <div className="products-text">
          <p className="products-label">PRODUK KAMI</p>
          <h2 className="products-heading">
            Tiga Produk Unggulan dari Perairan Maluku
          </h2>
          <p className="products-body">
            Semua produk bersumber langsung dari nelayan Maluku, tersedia dalam bentuk Whole Round untuk kebutuhan pengolahan skala industri.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="products-bento">

          {/* Large card — Yellowfin */}
          <div className="product-card product-card--large">
            <img src={imgY1} alt="Yellowfin Tuna" className="product-card__img" />
            <div className="product-card__overlay product-card__overlay--bottom" />
            <div className="product-card__content product-card__content--large">
              <h3 className="product-card__name product-card__name--large">
                Yellowfin Tuna Whole Round
              </h3>
              <p className="product-card__desc product-card__desc--large">
                Tuna sirip kuning premium, tangkapan langsung dari perairan Banda Maluku.
              </p>
              <button className="product-card__btn" onClick={() => navigate('/products')}>
                Tanya Ketersediaan &amp; Harga →
              </button>
            </div>
          </div>

          {/* Right column — two stacked small cards */}
          <div className="products-bento-right">

            {/* Top: Cakalang */}
            <div className="product-card product-card--small">
              <img src={imgC1} alt="Cakalang Skipjack" className="product-card__img" />
              <div className="product-card__overlay product-card__overlay--top" />
              <div className="product-card__content product-card__content--small">
                <h3 className="product-card__name product-card__name--small">
                  Cakalang (Skipjack) Whole Round
                </h3>
                <p className="product-card__desc product-card__desc--small">
                  Cakalang segar berkualitas tinggi, bahan baku andalan industri pengolahan.
                </p>
                <span className="product-card__link" onClick={() => navigate('/products')}>
                  Tanya Ketersediaan &amp; Harga →
                </span>
              </div>
            </div>

            {/* Bottom: Baby Tuna */}
            <div className="product-card product-card--small">
              <img src={imgB1} alt="Baby Tuna" className="product-card__img" />
              <div className="product-card__overlay product-card__overlay--top" />
              <div className="product-card__content product-card__content--small">
                <h3 className="product-card__name product-card__name--small">
                  Baby Tuna Whole Round
                </h3>
                <p className="product-card__desc product-card__desc--small">
                  Ukuran kecil, kualitas terjaga pilihan ekonomis untuk produksi skala besar.
                </p>
                <span className="product-card__link" onClick={() => navigate('/products')}>
                  Tanya Ketersediaan &amp; Harga →
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default ProductsSection;
