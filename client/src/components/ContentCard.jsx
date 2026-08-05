import { useState } from 'react'
import ContentModal from './ContentModal.jsx'
import { useFavorites } from '../content/FavoritesContext.jsx'
import './ContentCard.css'

// White content-teaser card. Default (large) layout: a full-width
// thumbnail on its own row at the top, brand + title stacked below it —
// used by the Read tab's Favorites/habit-grouped/More reading lists. Pass
// `compact` for the smaller previous layout (small square thumbnail
// beside the text in one row) — used by Routine's per-habit "drip" pick,
// where it sits right under a full-size RoutineHabitCard. Tapping the
// card opens ContentModal full-screen (an iframe onto the real article
// when there's a url, not a bottom tray anymore), where it can also be
// saved to Favorites; the heart doubles as an inline toggle so saving
// doesn't require opening the reader first. `id` must be stable and
// globally unique across everywhere a piece of content is rendered.
function ContentCard({ id, thumbnail, brand, title, body, url, compact }) {
  const [open, setOpen] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()
  const saved = isFavorite(id)

  return (
    <>
      <div className={`content-card${compact ? ' content-card--compact' : ''}`}>
        <button type="button" className="content-card__tap" onClick={() => setOpen(true)}>
          <div className="content-card__thumb" style={{ backgroundImage: thumbnail }} />
          <div className="content-card__body">
            {brand && <span className="content-card__brand">{brand}</span>}
            <span className="content-card__title">{title}</span>
          </div>
        </button>

        <button
          type="button"
          className={`content-card__heart${saved ? ' content-card__heart--active' : ''}`}
          onClick={() => toggleFavorite({ id, thumbnail, brand, title, body, url })}
          aria-pressed={saved}
          aria-label={saved ? 'Remove from Favorites' : 'Save to Favorites'}
        >
          {saved ? '♥' : '♡'}
        </button>
      </div>

      {open && (
        <ContentModal
          content={{ id, thumbnail, brand, title, body, url }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

export default ContentCard
