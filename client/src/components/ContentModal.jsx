import { useFavorites } from '../content/FavoritesContext.jsx'
import './ContentModal.css'

// Full-screen-ish overlay opened by tapping a ContentCard. The heart is a
// plain binary toggle — saved state lives in FavoritesContext, and shows
// up in the Read tab's "Favorites" section.
function ContentModal({ content, onClose }) {
  const { isFavorite, toggleFavorite } = useFavorites()

  if (!content) return null
  const saved = isFavorite(content.id)

  return (
    <div className="content-modal__backdrop" onClick={onClose}>
      <div className="content-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="content-modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="content-modal__thumb" style={{ backgroundImage: content.thumbnail }} />

        <div className="content-modal__body">
          {content.brand && <span className="content-modal__brand">{content.brand}</span>}
          <h2 className="content-modal__title">{content.title}</h2>

          <button
            type="button"
            className={`content-modal__save${saved ? ' content-modal__save--active' : ''}`}
            onClick={() => toggleFavorite(content)}
            aria-pressed={saved}
          >
            <span className="content-modal__heart" aria-hidden="true">
              {saved ? '♥' : '♡'}
            </span>
            {saved ? 'Saved to Favorites' : 'Save to Favorites'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContentModal
