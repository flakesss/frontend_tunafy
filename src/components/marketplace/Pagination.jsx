import './Pagination.css'

/**
 * Pagination component for marketplace page
 * Matches Figma spec with:
 * - Left/Right arrow buttons
 * - Page numbers with active state (blue background)
 * - Ellipsis for truncated pages
 */
const Pagination = ({ currentPage = 1, totalPages = 6, onPageChange }) => {
  const handlePageClick = (page) => {
    if (page !== '...' && onPageChange) {
      onPageChange(page)
    }
  }

  const handlePrevClick = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNextClick = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1)
    }
  }

  // Generate page numbers array with ellipsis
  const getPageNumbers = () => {
    const pages = []
    
    if (totalPages <= 5) {
      // Show all pages if 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      if (currentPage > 3) {
        pages.push('...')
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...')
      }
      
      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      {/* Left Arrow */}
      <button
        className="pagination__arrow pagination__arrow--left"
        onClick={handlePrevClick}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15 19L8 12L15 5"
            stroke={currentPage === 1 ? '#999999' : '#0273FF'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Page Numbers */}
      <div className="pagination__pages">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            className={`pagination__page ${page === currentPage ? 'pagination__page--active' : ''} ${page === '...' ? 'pagination__page--ellipsis' : ''}`}
            onClick={() => handlePageClick(page)}
            disabled={page === '...'}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        className="pagination__arrow pagination__arrow--right"
        onClick={handleNextClick}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9 5L16 12L9 19"
            stroke={currentPage === totalPages ? '#999999' : '#0273FF'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </nav>
  )
}

export default Pagination
