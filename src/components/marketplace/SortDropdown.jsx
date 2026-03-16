import { useState } from 'react'
import './SortDropdown.css'

/**
 * SortDropdown component
 * Matches Figma spec:
 * - 170x25px dropdown with border
 * - "Sort by:" label + selected value
 * - Arrow down icon
 */
const SortDropdown = ({ options = [], value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (option) => {
    onChange(option)
    setIsOpen(false)
  }

  return (
    <div className="sort-dropdown">
      <button
        className="sort-dropdown__button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="sort-dropdown__label">Sort by:</span>
        <span className="sort-dropdown__value">{value}</span>
        <svg
          className={`sort-dropdown__arrow ${isOpen ? 'sort-dropdown__arrow--open' : ''}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="#0273FF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <ul className="sort-dropdown__menu" role="listbox">
          {options.map((option) => (
            <li
              key={option}
              className={`sort-dropdown__option ${option === value ? 'sort-dropdown__option--selected' : ''}`}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={option === value}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SortDropdown
