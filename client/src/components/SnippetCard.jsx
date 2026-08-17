import BrandLogo from './BrandLogo.jsx'
import BookmarkIcon from './BookmarkIcon.jsx'
import ThumbIcon from './ThumbIcon.jsx'
import { useFavorites } from '../content/FavoritesContext.jsx'
import { useReactions } from '../content/ReactionsContext.jsx'
import './SnippetCard.css'

// One takeaway card: a claim, who it came from, and the three reactions.
// Pulled out of SnippetDeck so the daily check-in can show the same cards
// inline instead of opening a second sheet on top of itself — one component,
// so the two surfaces can't drift apart.
//
// Saving stores the underlying article, so it lands in Read's Saved list as
// one item rather than as a fragment.
function SnippetCard({ snippet }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isLiked, isDisliked, toggleLike, toggleDislike } = useReactions()
  const liked = isLiked(snippet.id)
  const disliked = isDisliked(snippet.id)
  const saved = isFavorite(snippet.id)

  return (
    <article className="snippet">
      {snippet.image && (
        <div className="snippet__image" style={{ backgroundImage: snippet.image }} />
      )}
      <div className="snippet__body">
        <BrandLogo brand={snippet.brand} className="snippet__brand" />
        <p className="snippet__text">{snippet.text}</p>
        <p className="snippet__source">{snippet.sourceTitle}</p>
      </div>

      <div className="snippet__actions">
        <button
          type="button"
          className={`snippet__action${liked ? ' snippet__action--liked' : ''}`}
          onClick={() => toggleLike(snippet.id)}
          aria-pressed={liked}
          aria-label={liked ? 'Undo more like this' : 'More like this'}
        >
          <ThumbIcon direction="up" filled={liked} />
        </button>
        <button
          type="button"
          className={`snippet__action${disliked ? ' snippet__action--disliked' : ''}`}
          onClick={() => toggleDislike(snippet.id)}
          aria-pressed={disliked}
          aria-label={disliked ? 'Undo less like this' : 'Less like this'}
        >
          <ThumbIcon direction="down" filled={disliked} />
        </button>
        <button
          type="button"
          className={`snippet__action snippet__action--save${
            saved ? ' snippet__action--saved' : ''
          }`}
          onClick={() => toggleFavorite(snippet.item)}
          aria-pressed={saved}
        >
          <BookmarkIcon filled={saved} />
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>
    </article>
  )
}

export default SnippetCard
