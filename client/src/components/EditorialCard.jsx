import { useEffect, useState } from 'react'
import ContentModal from './ContentModal.jsx'
import BookmarkIcon from './BookmarkIcon.jsx'
import BrandLogo from './BrandLogo.jsx'
import ThumbIcon from './ThumbIcon.jsx'
import { useFavorites } from '../content/FavoritesContext.jsx'
import { useReactions } from '../content/ReactionsContext.jsx'
import './EditorialCard.css'

// One card shape for every story in the Today page's "Living healthy" row —
// the lead piece included. Full-bleed photo, brand, headline, a "Read more"
// cue, and like / dislike / save in the corner.
//
// Tapping anywhere on the card opens the reader. The three icons sit above
// that tap layer so they act on their own; the text block below sits above
// it too but is pointer-events: none, so a tap on the headline still opens
// the story rather than doing nothing.
//
// The reader gets the item's `body` rather than its `fullBody`: this is a
// short read in a phone-sized sheet, not the whole article, with a link
// onward to Read. See domain/editorialPicks.js for how quotes in that copy
// are sourced.
// How long the "we'll show you less like this" confirmation sits on the card
// before the dismissal is committed and the card gives way to the next one.
// Long enough to read, short enough not to feel like a wait.
const DISMISS_MS = 1100

function EditorialCard({ item, thumbnail }) {
  const [open, setOpen] = useState(false)
  const [dismissing, setDismissing] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isLiked, isDisliked, toggleLike, toggleDislike } = useReactions()
  const saved = isFavorite(item.id)
  const liked = isLiked(item.id)
  const disliked = isDisliked(item.id)
  const background = item.image || thumbnail

  // The dislike is recorded only once the confirmation has been shown —
  // recording it immediately would unmount this card mid-message, since the
  // feed filters on exactly that state.
  useEffect(() => {
    if (!dismissing) return
    const timer = setTimeout(() => toggleDislike(item.id), DISMISS_MS)
    return () => clearTimeout(timer)
  }, [dismissing, item.id, toggleDislike])

  return (
    <>
      <article className="story-card" style={{ backgroundImage: background }}>
        <span className="story-card__scrim" />

        <button
          type="button"
          className="story-card__tap"
          onClick={() => setOpen(true)}
          aria-label={`Read: ${item.title}`}
        />

        <div className="story-card__actions">
          <button
            type="button"
            className={`story-card__icon${liked ? ' story-card__icon--liked' : ''}`}
            onClick={() => toggleLike(item.id)}
            aria-pressed={liked}
            aria-label={liked ? 'Undo more like this' : 'More like this'}
          >
            <ThumbIcon direction="up" filled={liked} />
          </button>
          <button
            type="button"
            className={`story-card__icon${disliked ? ' story-card__icon--disliked' : ''}`}
            onClick={() => setDismissing(true)}
            aria-pressed={disliked}
            aria-label={disliked ? 'Undo less like this' : 'Less like this'}
          >
            <ThumbIcon direction="down" filled={disliked || dismissing} />
          </button>
          <button
            type="button"
            className={`story-card__icon${saved ? ' story-card__icon--saved' : ''}`}
            onClick={() => toggleFavorite(item)}
            aria-pressed={saved}
            aria-label={saved ? 'Remove from saved' : 'Save for later'}
          >
            <BookmarkIcon filled={saved} />
          </button>
        </div>

        {dismissing && (
          <div className="story-card__dismissed" role="status">
            <ThumbIcon direction="down" filled />
            <span>We’ll show you less like this</span>
          </div>
        )}

        <div className="story-card__content">
          {/* Real masthead, same component every other surface uses — the
              uppercase brand string this replaced was the one place in the
              app that spelled a brand out instead of showing its logo. */}
          <BrandLogo brand={item.brand} className="story-card__brand" />
          <span className="story-card__title">{item.title}</span>
          <span className="story-card__cta">Read more →</span>
        </div>
      </article>

      {open && (
        <ContentModal
          content={{ ...item, thumbnail: background, fullBody: null }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

export default EditorialCard
