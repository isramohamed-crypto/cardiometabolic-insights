import { useFavorites } from '../content/FavoritesContext.jsx'
import HeartIcon from './HeartIcon.jsx'
import BrandLogo from './BrandLogo.jsx'
import './ContentModal.css'

// Real article URL missing? Fall back to the publisher's homepage rather
// than showing no way out at all — covers every brand currently used
// anywhere in habitContent.js (CONTENT_POOL, COMPANION_CONTENT, DAY_SCRIPTS).
// Add a brand here whenever a new one shows up in the content data.
const BRAND_HOMEPAGES = {
  Allrecipes: 'https://www.allrecipes.com',
  Byrdie: 'https://www.byrdie.com',
  EatingWell: 'https://www.eatingwell.com',
  'Food & Wine': 'https://www.foodandwine.com',
  Health: 'https://www.health.com',
  'Martha Stewart': 'https://www.marthastewart.com',
  Parents: 'https://www.parents.com',
  'Real Simple': 'https://www.realsimple.com',
  'Simply Recipes': 'https://www.simplyrecipes.com',
  'The Spruce': 'https://www.thespruce.com',
  'Verywell Health': 'https://www.verywellhealth.com',
  'Verywell Mind': 'https://www.verywellmind.com',
}

// Full-screen article reader opened by tapping a ContentCard — no longer a
// bottom tray. Same "card floating over a dimmed scene" language as
// HabitDetail's flip-card (content-modal-scene/content-modal here vs.
// flip-card-scene/flip-card there): inset from the top so the dark scene
// shows through above it, rounded top corners, and a drop shadow marking
// where the card lifts off the backdrop — white background since this is
// the one place actual content (the article, not just app chrome) fills
// the overlay. The top row is just Back + the save heart, at opposite
// ends — brand/title get their own full-width row underneath rather than
// squeezing in between, so the title doesn't have to truncate.
//
// Three ways the body of the reader can render, in priority order:
//
// 1. `fullBody` set — Vitalist's own longer-form copy (the "Additional
//    notes" pass on the content inventory) is the reading experience
//    itself: thumbnail, then the long copy, then a "Read the full
//    article" link out to the source. Deliberately NOT an iframe here —
//    once real long-form copy exists, an unreliable embed isn't worth the
//    risk of a blank frame; the source is one tap away instead of being
//    the only way to read it.
// 2. No `fullBody`, but `url` set — the actual article loads in an
//    iframe, so the reader gets the real page (hero image, full text,
//    byline) instead of just Vitalist's short teaser. This is still how
//    the walk-after-meal companion podcast plays inline, for example. A
//    "Read the full article" button still sits below the frame, since some
//    publishers set X-Frame-Options/CSP that refuse to be framed — there's
//    no reliable way to detect that from this side once it happens
//    (cross-origin iframes give the parent page no signal).
// 3. Neither — falls back to thumbnail + the short teaser `body`.
//
// All three paths end in the same link-out button. When there's a real
// `url` it points there; when there isn't (path 1 or 3 with no `url`), it
// falls back to the publisher's homepage via BRAND_HOMEPAGES so there's
// always somewhere to go read more — labeled "Read more from {brand}"
// instead of "Read the full article" in that case, since a homepage isn't
// the article itself. No button at all only if there's neither a url nor
// a recognized brand.
function ContentModal({ content, onClose }) {
  const { isFavorite, toggleFavorite } = useFavorites()

  if (!content) return null
  const saved = isFavorite(content.id)

  const readMoreUrl = content.url || (content.brand && BRAND_HOMEPAGES[content.brand]) || null
  const readMoreLabel = content.url ? 'Read the full article ↗' : `Read more from ${content.brand} ↗`
  const readMoreButton = readMoreUrl && (
    <a
      href={readMoreUrl}
      target="_blank"
      rel="noreferrer"
      className="content-modal__fallback-link content-modal__fallback-link--primary"
    >
      {readMoreLabel}
    </a>
  )

  return (
    <div className="content-modal-scene">
      <div className="content-modal">
        <div className="content-modal__bar">
          <button type="button" className="content-modal__close" onClick={onClose}>
            <span aria-hidden="true">←</span> Back
          </button>

          <button
            type="button"
            className={`content-modal__save${saved ? ' content-modal__save--active' : ''}`}
            onClick={() => toggleFavorite(content)}
            aria-pressed={saved}
            aria-label={saved ? 'Remove from Favorites' : 'Save to Favorites'}
          >
            <HeartIcon filled={saved} />
          </button>
        </div>

        <div className="content-modal__bar-title">
          <BrandLogo brand={content.brand} className="content-modal__brand" />
          <span className="content-modal__title">{content.title}</span>
        </div>

        {content.fullBody ? (
          <div className="content-modal__fallback">
            <div className="content-modal__thumb" style={{ backgroundImage: content.thumbnail }} />
            <p className="content-modal__text">{content.fullBody}</p>
            {readMoreButton}
          </div>
        ) : content.url ? (
          <>
            <iframe src={content.url} title={content.title} className="content-modal__frame" />
            {readMoreButton}
          </>
        ) : (
          <div className="content-modal__fallback">
            <div className="content-modal__thumb" style={{ backgroundImage: content.thumbnail }} />
            {content.body && <p className="content-modal__text">{content.body}</p>}
            {readMoreButton}
          </div>
        )}
      </div>
    </div>
  )
}

export default ContentModal
