import { useState } from 'react'
import ContentModal from './ContentModal.jsx'
import { useFavorites } from '../content/FavoritesContext.jsx'
import './ContentCard.css'

// White content-teaser card: a small thumbnail (a photo, once that
// pipeline exists — currently a gradient placeholder like everywhere else
// in the app) next to a brand + title. Shared by the Routine page's daily
// content teaser and the Read tab so both look identical. Tapping the card
// opens ContentModal, where it can be saved to Favorites; the heart in the
// corner is the same binary toggle but inline, so saving doesn't require
// opening the modal first. `id` must be stable and globally unique across
// everywhere a piece of content is rendered.
function ContentCard({ id, thumbnail, brand, title, body }) {
  const [open, setOpen] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()
  const saved = isFavorite(id)

  return (
    <>
      <div className="content-card">
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
          onClick={() => toggleFavorite({ id, thumbnail, brand, title, body })}
          aria-pressed={saved}
          aria-label={saved ? 'Remove from Favorites' : 'Save to Favorites'}
        >
          {saved ? '♥' : '♡'}
        </button>
      </div>

      {open && (
        <ContentModal
          content={{ id, thumbnail, brand, title, body }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

export default ContentCard
