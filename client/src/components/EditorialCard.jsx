import { useState } from 'react'
import ContentModal from './ContentModal.jsx'
import BookmarkIcon from './BookmarkIcon.jsx'
import { useFavorites } from '../content/FavoritesContext.jsx'
import { useReactions } from '../content/ReactionsContext.jsx'
import { getBrandLogo } from '../domain/brandLogos.js'
import { pullQuote, attributionFor } from '../domain/editorialPicks.js'
import './EditorialCard.css'

// Editorial treatment for the Today page's "Living healthy" feed: a photo,
// a pull-quote attributed to its publication, and a "mark as tried" action.
// Replaces the thumbnail-and-headline link card — the feed is a magazine
// package now, not a list of links.
//
// The pull-quote is derived from the item's own summary copy and attributed
// to the publication rather than to a named editor; see the sourcing note at
// the top of domain/editorialPicks.js for why there are no editor names or
// headshots here. The avatar slot shows the brand's logo instead, which is a
// real asset we have.
export function EditorialCard({ item, thumbnail }) {
  const [open, setOpen] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isTried, toggleTried } = useReactions()
  const saved = isFavorite(item.id)
  const tried = isTried(item.id)
  const logo = getBrandLogo(item.brand)
  const background = item.image || thumbnail

  return (
    <>
      <article className="editorial-card">
        <button
          type="button"
          className="editorial-card__image"
          style={{ backgroundImage: background }}
          onClick={() => setOpen(true)}
          aria-label={item.title}
        >
          <span className="editorial-card__image-scrim" />
          <span className="editorial-card__headline">{item.title}</span>
        </button>

        <button
          type="button"
          className={`editorial-card__save${saved ? ' editorial-card__save--on' : ''}`}
          onClick={() => toggleFavorite(item)}
          aria-pressed={saved}
          aria-label={saved ? 'Remove from saved' : 'Save for later'}
        >
          <BookmarkIcon filled={saved} />
        </button>

        <div className="editorial-card__quote-block">
          {logo && <img className="editorial-card__avatar" src={logo} alt="" />}
          <div className="editorial-card__quote-text">
            <p className="editorial-card__quote">“{pullQuote(item)}”</p>
            <p className="editorial-card__author">— {attributionFor(item)}</p>
          </div>
        </div>

        <div className="editorial-card__try-row">
          <button
            type="button"
            className={`try-btn${tried ? ' try-btn--tried' : ''}`}
            onClick={() => toggleTried(item.id)}
            aria-pressed={tried}
          >
            {tried ? '✓ Tried' : '+ Mark as tried'}
          </button>
        </div>
      </article>

      {open && <ContentModal content={{ ...item, thumbnail: background }} onClose={() => setOpen(false)} />}
    </>
  )
}

// Text-forward cover story that opens the row. No pull-quote block and no
// try action — a cover is the invitation into the package, not a tip to act
// on. Its quote (when the entry has a real sourced one) runs as the standout
// line instead.
export function EditorialCover({ item }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <article
        className="editorial-cover"
        style={item.image ? { backgroundImage: item.image } : undefined}
      >
        <button
          type="button"
          className="editorial-cover__tap"
          onClick={() => setOpen(true)}
          aria-label={item.title}
        >
          <span className="editorial-cover__scrim" />
          <span className="editorial-cover__content">
            <span className="editorial-cover__brand">{item.brand}</span>
            <span className="editorial-cover__title">{item.title}</span>
            {item.quote ? (
              <span className="editorial-cover__quote">“{item.quote}”</span>
            ) : (
              <span className="editorial-cover__sub">{item.standfirst}</span>
            )}
            <span className="editorial-cover__cue">Read the story →</span>
          </span>
        </button>
      </article>

      {open && (
        <ContentModal
          content={{ ...item, body: item.standfirst, fullBody: item.standfirst }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
