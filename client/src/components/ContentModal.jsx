import { useFavorites } from '../content/FavoritesContext.jsx'
import './ContentModal.css'

// Full-screen article reader opened by tapping a ContentCard — no longer a
// bottom tray. Same "card floating over a dimmed scene" language as
// HabitDetail's flip-card (content-modal-scene/content-modal here vs.
// flip-card-scene/flip-card there): inset from the top so the dark scene
// shows through above it, rounded top corners, and a drop shadow marking
// where the card lifts off the backdrop — white background since this is
// the one place actual content (the article, not just app chrome) fills
// the overlay. When the content carries a real source url (every "More
// reading" article does; a handful of older CONTENT_POOL/day-script
// entries that predate real links don't yet), the actual article loads in
// an iframe below a slim header bar, so the reader gets the real page —
// hero image, full text, byline — instead of Vitalist's own condensed
// teaser. Content without a url falls back to the old thumbnail + body
// summary view so nothing renders blank.
//
// Some publishers set X-Frame-Options/CSP that refuse to be framed —
// there's no reliable way to detect that from this side once it happens
// (cross-origin iframes give the parent page no signal), so the "Open in
// browser" link under the frame is the fallback for when a site won't
// embed.
function ContentModal({ content, onClose }) {
  const { isFavorite, toggleFavorite } = useFavorites()

  if (!content) return null
  const saved = isFavorite(content.id)

  return (
    <div className="content-modal-scene">
      <div className="content-modal">
        <div className="content-modal__bar">
          <button type="button" className="content-modal__close" onClick={onClose}>
            <span aria-hidden="true">←</span> Back
          </button>

          <div className="content-modal__bar-title">
            {content.brand && <span className="content-modal__brand">{content.brand}</span>}
            <span className="content-modal__title">{content.title}</span>
          </div>

          <button
            type="button"
            className={`content-modal__save${saved ? ' content-modal__save--active' : ''}`}
            onClick={() => toggleFavorite(content)}
            aria-pressed={saved}
            aria-label={saved ? 'Remove from Favorites' : 'Save to Favorites'}
          >
            {saved ? '♥' : '♡'}
          </button>
        </div>

        {content.url ? (
          <>
            <iframe src={content.url} title={content.title} className="content-modal__frame" />
            <a
              href={content.url}
              target="_blank"
              rel="noreferrer"
              className="content-modal__fallback-link"
            >
              Not loading? Open in browser ↗
            </a>
          </>
        ) : (
          <div className="content-modal__fallback">
            <div className="content-modal__thumb" style={{ backgroundImage: content.thumbnail }} />
            {content.body && <p className="content-modal__text">{content.body}</p>}
          </div>
        )}
      </div>
    </div>
  )
}

export default ContentModal
