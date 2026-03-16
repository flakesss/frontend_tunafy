import { useNavigate } from 'react-router-dom'
import './ProductCard.css'

/**
 * ProductCard
 * Matches the Figma design spec:
 * - 318 × 463 white card with 16px radius
 * - Top image 189px with dark gradient overlay
 * - Blue badge tags (species, form, grade)
 * - Product name + location in blue
 * - Price per kg
 * - Yellow "Buy" button with cart icon
 */

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6C3.5 9.25 8 14.5 8 14.5C8 14.5 12.5 9.25 12.5 6C12.5 3.515 10.485 1.5 8 1.5ZM8 7.75C7.034 7.75 6.25 6.966 6.25 6C6.25 5.034 7.034 4.25 8 4.25C8.966 4.25 9.75 5.034 9.75 6C9.75 6.966 8.966 7.75 8 7.75Z"
      fill="#0273FF"
    />
  </svg>
)

const ShoppingCartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2 2H3.74001C4.82001 2 5.67 2.93 5.58 4L4.75 13.96C4.61 15.59 5.89999 16.99 7.53999 16.99H18.19C19.63 16.99 20.89 15.81 21 14.38L21.54 6.88C21.66 5.22 20.4 3.87 18.73 3.87H5.82001"
      stroke="white"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.25 22C16.9404 22 17.5 21.4404 17.5 20.75C17.5 20.0596 16.9404 19.5 16.25 19.5C15.5596 19.5 15 20.0596 15 20.75C15 21.4404 15.5596 22 16.25 22Z"
      stroke="white"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.25 22C8.94036 22 9.5 21.4404 9.5 20.75C9.5 20.0596 8.94036 19.5 8.25 19.5C7.55964 19.5 7 20.0596 7 20.75C7 21.4404 7.55964 22 8.25 22Z"
      stroke="white"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 8H21"
      stroke="white"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/**
 * @param {Object} props
 * @param {number} props.id          - Product ID for navigation
 * @param {string} props.image       - URL/path for product image
 * @param {string} props.name        - Product name e.g. "Bluefin Loin"
 * @param {string} props.location    - e.g. "Maluku, ID"
 * @param {string[]} props.tags      - e.g. ["Bluefin Tuna", "Loin (Skin-on)", "A+"]
 * @param {number} props.price       - Price in IDR per kg e.g. 24000
 */
const ProductCard = ({ id, image, name, location, tags = [], price }) => {
  const navigate = useNavigate()
  const formattedPrice = price?.toLocaleString('id-ID') ?? '0'

  const handleOrderNow = () => {
    navigate(`/product/${id}`)
  }

  return (
    <div className="product-card">
      {/* ── Image Area ── */}
      <div className="product-card__image-wrap">
        <img src={image} alt={name} className="product-card__image" />
        <div className="product-card__gradient" />
      </div>

      {/* ── Body ── */}
      <div className="product-card__body">
        {/* Name & Location */}
        <div className="product-card__info">
          <span className="product-card__name">{name}</span>
          <span className="product-card__location">
            <LocationIcon />
            {location}
          </span>
        </div>

        {/* Tags - di bawah nama dan lokasi */}
        <div className="product-card__tags">
          {tags.map((tag) => (
            <span key={tag} className="product-card__tag">
              {tag}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="product-card__price-wrap">
          <div className="product-card__price">
            <span className="product-card__price-currency">Rp</span>
            <span className="product-card__price-amount">{formattedPrice}</span>
          </div>
          <span className="product-card__price-label">Price per kg</span>
        </div>

        {/* Order Now Button */}
        <button className="product-card__buy-btn" onClick={handleOrderNow}>
          <ShoppingCartIcon />
          <span>Order Now</span>
        </button>
      </div>
    </div>
  )
}

export default ProductCard
