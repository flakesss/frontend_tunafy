import { useState } from 'react'
import './MarketplaceFilter.css'

/**
 * MarketplaceFilter
 * Sidebar filter kiri untuk halaman Marketplace.
 * Sections: Species, Product Form, Grade
 */

const ChevronIcon = ({ open }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={`filter-arrow ${open ? 'open' : ''}`}
  >
    <path
      d="M6 9L12 15L18 9"
      stroke="#292D32"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const CheckboxItem = ({ label, checked, onChange }) => (
  <label className="filter-checkbox-item">
    <span className={`filter-checkbox ${checked ? 'checked' : ''}`}>
      {checked && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6L5 9L10 3"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
    <span className="filter-checkbox-label">{label}</span>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="filter-checkbox-input"
    />
  </label>
)

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="filter-section">
      <button className="filter-section-header" onClick={() => setOpen(!open)}>
        <span className="filter-section-title">{title}</span>
        <ChevronIcon open={open} />
      </button>
      {open && <div className="filter-section-body">{children}</div>}
    </div>
  )
}

const MarketplaceFilter = ({ filters, onChange }) => {
  return (
    <aside className="marketplace-filter">
      <h3 className="filter-heading">Filters</h3>

      {/* Species */}
      <FilterSection title="Species">
        <CheckboxItem
          label="All"
          checked={filters.species.includes('all')}
          onChange={() => onChange('species', 'all')}
        />
        <CheckboxItem
          label="Bluefin Tuna"
          checked={filters.species.includes('bluefin')}
          onChange={() => onChange('species', 'bluefin')}
        />
        <CheckboxItem
          label="Yellowfin Tuna"
          checked={filters.species.includes('yellowfin')}
          onChange={() => onChange('species', 'yellowfin')}
        />
        <CheckboxItem
          label="Bigeye Tuna"
          checked={filters.species.includes('bigeye')}
          onChange={() => onChange('species', 'bigeye')}
        />
      </FilterSection>

      {/* Product Form */}
      <FilterSection title="Product Form">
        <CheckboxItem
          label="All"
          checked={filters.form.includes('all')}
          onChange={() => onChange('form', 'all')}
        />
        <CheckboxItem
          label="Loin (Skin-on)"
          checked={filters.form.includes('loin')}
          onChange={() => onChange('form', 'loin')}
        />
        <CheckboxItem
          label="Whole Round"
          checked={filters.form.includes('whole')}
          onChange={() => onChange('form', 'whole')}
        />
      </FilterSection>

      {/* Grade */}
      <FilterSection title="Grade">
        <CheckboxItem
          label="All"
          checked={filters.grade.includes('all')}
          onChange={() => onChange('grade', 'all')}
        />
        <CheckboxItem
          label="A"
          checked={filters.grade.includes('A')}
          onChange={() => onChange('grade', 'A')}
        />
        <CheckboxItem
          label="B+"
          checked={filters.grade.includes('B+')}
          onChange={() => onChange('grade', 'B+')}
        />
        <CheckboxItem
          label="B"
          checked={filters.grade.includes('B')}
          onChange={() => onChange('grade', 'B')}
        />
        <CheckboxItem
          label="C"
          checked={filters.grade.includes('C')}
          onChange={() => onChange('grade', 'C')}
        />
      </FilterSection>
    </aside>
  )
}

export default MarketplaceFilter
