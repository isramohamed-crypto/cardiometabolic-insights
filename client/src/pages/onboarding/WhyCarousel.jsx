import { useEffect, useState } from 'react'
import './WhyCarousel.css'

/**
 * Full-screen "why this one" sequence for habits with real sourced content
 * (see whyCarouselContent.js) — the richer alternative to
 * WhyThisMattersTray's generic bottom sheet. Unlike that tray, this fills
 * the whole screen (same "content, not just app chrome, gets its own
 * full-bleed page" treatment as ContentModal's article reader) and moves
 * forward only, one screen at a time, ending on a "Reviewed by / Updated"
 * byline instead of another Next button.
 *
 * Callers (Recommendations.jsx, AddHabitFlow.jsx) check
 * WHY_CAROUSEL_CONTENT for the current habit first, and only render this
 * instead of WhyThisMattersTray when an entry exists.
 */
function WhyCarousel({ open, content, onClose, onAdd, onAnother }) {
  const [page, setPage] = useState(0)

  // Same reset-on-open rule as WhyThisMattersTray, so this never reopens
  // mid-sequence on a later habit.
  useEffect(() => {
    if (open) setPage(0)
  }, [open, content])

  if (!content) return null

  const { brand, footer, screens } = content
  const screen = screens[page]
  const isLast = page === screens.length - 1
  // A page count/dots row only means something once there's more than one
  // page to move through — habits with just a teaser and nothing further
  // (see buildWhyCarouselFromContentPool's 1-page case in
  // whyCarouselContent.js) would otherwise show a static "1 of 1" and a
  // single dot that never does anything.
  const hasMultiplePages = screens.length > 1

  return (
    <div className={`why-carousel-scene${open ? ' why-carousel-scene--open' : ''}`}>
      <div className="why-carousel">
        <button
          type="button"
          className="why-carousel__close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="why-carousel__top">
          <span className="why-carousel__brand">{brand}</span>
          {hasMultiplePages && (
            <span className="why-carousel__count">
              {page + 1} of {screens.length}
            </span>
          )}
        </div>

        {hasMultiplePages && (
          <div className="why-carousel__dots" aria-hidden="true">
            {screens.map((_, i) => (
              <span
                key={i}
                className={`why-carousel__dot${i === page ? ' why-carousel__dot--active' : ''}`}
              />
            ))}
          </div>
        )}

        <div className="why-carousel__body">
          {screen.image && (
            <div className="why-carousel__image" style={{ backgroundImage: screen.image }} />
          )}

          <h2 className="why-carousel__heading">{screen.heading}</h2>
          <p className="why-carousel__text">{screen.body}</p>

          {screen.highlight && <div className="why-carousel__highlight">{screen.highlight}</div>}

          {isLast && footer && (
            <div className="why-carousel__byline">
              <div
                className="why-carousel__avatar"
                style={{ backgroundImage: footer.avatar }}
                aria-hidden="true"
              />
              <div>
                <p className="why-carousel__byline-name">Reviewed by {footer.reviewer}</p>
                <p className="why-carousel__byline-meta">
                  {brand} · Updated {footer.updated}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="why-carousel__actions">
          {isLast ? (
            <>
              <button type="button" className="why-carousel__cta" onClick={onAdd}>
                Add this habit
              </button>
              <button type="button" className="why-carousel__another" onClick={onAnother}>
                Show me another
              </button>
            </>
          ) : (
            <button
              type="button"
              className="why-carousel__cta"
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default WhyCarousel
