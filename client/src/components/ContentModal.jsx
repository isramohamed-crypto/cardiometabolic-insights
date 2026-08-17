import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { useFavorites } from '../content/FavoritesContext.jsx'
import { useReactions } from '../content/ReactionsContext.jsx'
import BookmarkIcon from './BookmarkIcon.jsx'
import ThumbIcon from './ThumbIcon.jsx'
import BrandLogo from './BrandLogo.jsx'
import './ContentModal.css'

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
  const { isLiked, isDisliked, toggleLike, toggleDislike } = useReactions()
  const liked = isLiked(content.id)
  const disliked = isDisliked(content.id)

  if (!content) return null
  const saved = isFavorite(content.id)

  // Keep the reader in-experience: instead of an external "Read the full
  // article" link that leaves the app, point to the Read tab. Worded "See
  // more in Read" rather than "Read more on Read", which the tab's rename
  // turned into a stutter — and it matches the Today page's link to the
  // same place.
  const readMoreButton = (
    <Link
      to="/read"
      onClick={onClose}
      className="content-modal__fallback-link content-modal__fallback-link--primary"
    >
      See more in Read →
    </Link>
  )

  // Rendered into document.body rather than in place. Its trigger now lives
  // inside the Today page's horizontally-scrolling carousel — a scroll
  // container with overflow: hidden and its own stacking context — which
  // clipped the reader and buried it under the rest of the feed on scroll.
  // A portal takes it out of that subtree entirely; position: fixed then
  // means what it says.
  return createPortal(
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
            <BookmarkIcon filled={saved} />
          </button>
        </div>

        <div className="content-modal__bar-title">
          <BrandLogo brand={content.brand} className="content-modal__brand" />
          <span className="content-modal__title">{content.title}</span>
        </div>

        {/* Never iframe the source — many publishers refuse to be embedded
            (X-Frame-Options / CSP), which showed up as "refused to connect".
            We keep readers in-app: show the in-app copy (or a short default),
            with "See more in Read" as the way onward. */}
        <div className="content-modal__fallback">
          <div className="content-modal__thumb" style={{ backgroundImage: content.thumbnail }} />
          <p className="content-modal__text">
            {content.fullBody ||
              content.body ||
              `A quick read from ${content.brand || 'our editors'}. Explore more like this in Read.`}
          </p>
          {/* Labelled here, icon-only on the card. In the reader there's room
              for words, and "more/less like this" says what the thumbs
              actually do — they tune what gets surfaced, they aren't a rating
              of the article. Same store as the card's icons, so a reaction
              made in either place shows in both. */}
          <div className="content-modal__reactions">
            <button
              type="button"
              className={`content-modal__reaction${liked ? ' content-modal__reaction--liked' : ''}`}
              onClick={() => toggleLike(content.id)}
              aria-pressed={liked}
            >
              <ThumbIcon direction="up" filled={liked} />
              More like this
            </button>
            <button
              type="button"
              className={`content-modal__reaction${
                disliked ? ' content-modal__reaction--disliked' : ''
              }`}
              onClick={() => toggleDislike(content.id)}
              aria-pressed={disliked}
            >
              <ThumbIcon direction="down" filled={disliked} />
              Less like this
            </button>
          </div>

          {readMoreButton}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default ContentModal
