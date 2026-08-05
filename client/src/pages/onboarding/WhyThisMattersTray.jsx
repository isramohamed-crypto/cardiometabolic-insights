import { useEffect, useState } from 'react'
import './WhyThisMattersTray.css'

// Three pages of real per-habit copy now exist (see recommendedHabits.js:
// justification / evidence / expectation), so the paginated mini-carousel
// from Figma node 1214:4722 (Back/Next + dots) is wired up for real instead
// of left out — dot count matches the actual number of pages (3) rather
// than the design's placeholder 5.
const PAGES = [
  { key: 'justification', heading: 'Why this matters' },
  { key: 'evidence', heading: 'The evidence' },
  { key: 'expectation', heading: 'What to expect' },
]

/**
 * Bottom sheet shown when "Why this one?" is tapped on a habit card.
 * Adapted from Figma node 1214:4722.
 */
function WhyThisMattersTray({ open, habit, gradient, onClose, onAdd, onAnother }) {
  const [page, setPage] = useState(0)

  // Reset to page 1 every time the tray opens or the habit underneath it
  // changes (e.g. after "Show me another"), so it never reopens mid-carousel.
  useEffect(() => {
    if (open) setPage(0)
  }, [open, habit?.id])

  const current = PAGES[page]

  return (
    <div className={`why-tray-overlay${open ? ' why-tray-overlay--open' : ''}`}>
      <button
        type="button"
        className="why-tray-overlay__backdrop"
        aria-label="Close"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      <div className={`why-tray${open ? ' why-tray--open' : ''}`}>
        <div className="why-tray__handle" />

        {habit && (
          <>
            <div className="why-tray__thumb" style={{ backgroundImage: gradient }} />

            <h2 className="why-tray__heading">{current.heading}</h2>

            <p className="why-tray__body">{habit[current.key]}</p>

            <div className="why-tray__pagination">
              <button
                type="button"
                className="why-tray__page-arrow"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                aria-label="Previous"
              >
                ←
              </button>

              <div className="why-tray__dots">
                {PAGES.map((p, i) => (
                  <span
                    key={p.key}
                    className={`why-tray__dot${i === page ? ' why-tray__dot--active' : ''}`}
                  />
                ))}
              </div>

              <button
                type="button"
                className="why-tray__page-arrow"
                onClick={() => setPage((p) => Math.min(PAGES.length - 1, p + 1))}
                disabled={page === PAGES.length - 1}
                aria-label="Next"
              >
                →
              </button>
            </div>
          </>
        )}

        <button type="button" className="why-tray__add" onClick={onAdd}>
          Add this habit
        </button>

        <button type="button" className="why-tray__another" onClick={onAnother}>
          Show me another
        </button>
      </div>
    </div>
  )
}

export default WhyThisMattersTray
