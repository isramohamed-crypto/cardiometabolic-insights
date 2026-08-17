import { useState } from 'react'
import ContentModal from './ContentModal.jsx'
import HeartIcon from './HeartIcon.jsx'
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
// Two save affordances, one store. By default the card shows the corner
// heart it always had. Pass `actions` (the Today page's "New for you"
// feed) to swap it for a bottom row of thumbs-up / thumbs-down / bookmark
// instead: on a recommendation feed the useful gesture is telling the app
// whether the pick landed, and a heart sitting next to a thumbs-up would
// read as two likes. The bookmark writes to the same FavoritesContext the
// heart does, so anything saved from either place shows up under Learn.
// A thumbs-down is only recorded here — it's the feed that acts on it, by
// dropping the card and pulling in the next candidate (see Routine.jsx).
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

        {actions ? (
          <div className="content-card__actions">
            <button
              type="button"
              className={`content-card__action${liked ? ' content-card__action--liked' : ''}`}
              onClick={() => toggleLike(id)}
              aria-pressed={liked}
              aria-label={liked ? 'Undo more like this' : 'More like this'}
            >
              <ThumbIcon direction="up" filled={liked} />
            </button>

            <button
              type="button"
              className={`content-card__action${disliked ? ' content-card__action--disliked' : ''}`}
              onClick={() => toggleDislike(id)}
              aria-pressed={disliked}
              aria-label={disliked ? 'Undo less like this' : 'Less like this'}
            >
              <ThumbIcon direction="down" filled={disliked} />
            </button>

            <button
              type="button"
              className={`content-card__action content-card__action--save${
                saved ? ' content-card__action--saved' : ''
              }`}
              onClick={() => toggleFavorite(item)}
              aria-pressed={saved}
              aria-label={saved ? 'Remove from saved' : 'Save to Learn'}
            >
              <BookmarkIcon filled={saved} />
              <span className="content-card__action-label">{saved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={`content-card__heart${saved ? ' content-card__heart--active' : ''}`}
            onClick={() => toggleFavorite(item)}
            aria-pressed={saved}
            aria-label={saved ? 'Remove from saved' : 'Save for later'}
          >
            <HeartIcon filled={saved} />
          </button>
        )}
      </div>

      {open && <ContentModal content={item} onClose={() => setOpen(false)} />}
    </>
  )
}

export default ContentCard
