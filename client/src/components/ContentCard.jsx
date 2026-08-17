import { useState } from 'react'
import ContentModal from './ContentModal.jsx'
import ThumbIcon from './ThumbIcon.jsx'
import BookmarkIcon from './BookmarkIcon.jsx'
import BrandLogo from './BrandLogo.jsx'
import { useFavorites } from '../content/FavoritesContext.jsx'
import { useReactions } from '../content/ReactionsContext.jsx'
import './ContentCard.css'

// White content-teaser card. Default (large) layout: a full-width
// thumbnail on its own row at the top, brand + title stacked below it —
// used by the Read tab's Saved/habit-grouped/More reading lists. Pass
// `compact` for the smaller previous layout (small square thumbnail
// beside the text in one row) — used by Routine's per-habit "drip" pick,
// where it sits right under a full-size RoutineHabitCard. Tapping the
// card opens ContentModal full-screen (an iframe onto the real article
// when there's a url, not a bottom tray anymore), where it can also be
// saved. `id` must be stable and globally unique across everywhere a
// piece of content is rendered.
// `body` is the short teaser shown on the card itself; pass `fullBody` too
// once a longer version of the copy exists — ContentModal shows that
// instead of iframing, with `url` (if set) as a "Read the full article"
// link-out rather than an embed (see ContentModal.jsx).
//
// `actions` (the Today page's "New for you" feed) adds thumbs-up and
// thumbs-down beside the save control. Everything else about the card is
// unchanged: same corner cluster position, no labels, no extra row.
//
// Save is a bookmark, not a heart — filing an article to read later isn't
// the same gesture as liking it, and on the feed the thumbs now carry the
// liking. Both surfaces write to the same FavoritesContext, so anything
// saved anywhere shows up under Read. A thumbs-down is only recorded here;
// it's the feed that acts on it.
function ContentCard({ id, thumbnail, brand, title, body, fullBody, url, compact, actions }) {
  const [open, setOpen] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isLiked, isDisliked, toggleLike, toggleDislike } = useReactions()
  const saved = isFavorite(id)
  const liked = isLiked(id)
  const disliked = isDisliked(id)
  const item = { id, thumbnail, brand, title, body, fullBody, url }

  return (
    <>
      <div className={`content-card${compact ? ' content-card--compact' : ''}`}>
        <button type="button" className="content-card__tap" onClick={() => setOpen(true)}>
          <div className="content-card__thumb" style={{ backgroundImage: thumbnail }} />
          <div className="content-card__body">
            <BrandLogo brand={brand} className="content-card__brand" />
            <span className="content-card__title">{title}</span>
          </div>
        </button>

        {/* Save stays in the top-right corner, where the heart has always
            been. The two reactions get their own cluster at the bottom
            instead of joining it — three glyphs in one corner squeezed the
            headline down to ~110px on a carousel-width card. */}
        <div className="content-card__icons">
          <button
            type="button"
            className={`content-card__icon${saved ? ' content-card__icon--saved' : ''}${
              actions ? ' content-card__icon--bookmark' : ''
            }`}
            onClick={() => toggleFavorite(item)}
            aria-pressed={saved}
            aria-label={saved ? 'Remove from saved' : 'Save for later'}
          >
            <BookmarkIcon filled={saved} />
          </button>
        </div>

        {actions && (
          <div className="content-card__reactions">
            <button
              type="button"
              className={`content-card__icon${liked ? ' content-card__icon--liked' : ''}`}
              onClick={() => toggleLike(id)}
              aria-pressed={liked}
              aria-label={liked ? 'Undo more like this' : 'More like this'}
            >
              <ThumbIcon direction="up" filled={liked} />
            </button>

            <button
              type="button"
              className={`content-card__icon${disliked ? ' content-card__icon--disliked' : ''}`}
              onClick={() => toggleDislike(id)}
              aria-pressed={disliked}
              aria-label={disliked ? 'Undo less like this' : 'Less like this'}
            >
              <ThumbIcon direction="down" filled={disliked} />
            </button>
          </div>
        )}

      </div>

      {open && <ContentModal content={item} onClose={() => setOpen(false)} />}
    </>
  )
}

export default ContentCard
