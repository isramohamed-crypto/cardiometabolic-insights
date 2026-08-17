import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import BrandLogo from './BrandLogo.jsx'
import BookmarkIcon from './BookmarkIcon.jsx'
import ThumbIcon from './ThumbIcon.jsx'
import { useFavorites } from '../content/FavoritesContext.jsx'
import { useReactions } from '../content/ReactionsContext.jsx'
import './SnippetDeck.css'

// Swipeable overlay of short takeaways, opened from an insight on the Today
// page. Deliberately not a reader: these are single claims to react to, so
// each card carries its own like / dislike / save and the deck is horizontal
// rather than a scrolling page.
//
// Portalled to document.body for the same reason ContentModal is — its
// trigger sits inside a section that has its own stacking and scroll
// contexts, and position: fixed can't escape those from the inside.
//
// Saving a snippet saves the underlying article, so it lands in Read's Saved
// list as one item rather than as a fragment.
function SnippetDeck({ snippets, onClose, title = 'Worth knowing' }) {
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isLiked, isDisliked, toggleLike, toggleDislike } = useReactions()

  // Escape closes, and the page behind doesn't scroll while this is open —
  // otherwise swiping the deck on a phone drags the feed underneath it.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  const handleScroll = () => {
    const track = trackRef.current
    if (!track) return
    const card = track.firstElementChild
    if (!card) return
    const step = card.getBoundingClientRect().width + 12
    setIndex(Math.round(track.scrollLeft / step))
  }

  const goTo = (i) => {
    const track = trackRef.current
    const card = track?.children?.[i]
    if (card) track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' })
  }

  if (snippets.length === 0) return null

  return createPortal(
    <div className="snippet-deck">
      <button
        type="button"
        className="snippet-deck__backdrop"
        onClick={onClose}
        aria-label="Close"
      />

      <div className="snippet-deck__sheet" role="dialog" aria-label={title}>
        <div className="snippet-deck__bar">
          <p className="snippet-deck__title">{title}</p>
          <span className="snippet-deck__count">
            {Math.min(index + 1, snippets.length)}/{snippets.length}
          </span>
          <button
            type="button"
            className="snippet-deck__close"
            onClick={onClose}
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="snippet-deck__track" ref={trackRef} onScroll={handleScroll}>
          {snippets.map((snippet) => {
            const liked = isLiked(snippet.id)
            const disliked = isDisliked(snippet.id)
            const saved = isFavorite(snippet.id)
            return (
              <article className="snippet" key={snippet.id}>
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
          })}
        </div>

        {snippets.length > 1 && (
          <div className="snippet-deck__dots">
            {snippets.map((snippet, i) => (
              <button
                key={snippet.id}
                type="button"
                className={`snippet-deck__dot${i === index ? ' snippet-deck__dot--on' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to ${i + 1} of ${snippets.length}`}
                aria-current={i === index}
              />
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

export default SnippetDeck
