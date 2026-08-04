import { useState } from 'react'
import ContentModal from './ContentModal.jsx'
import './ContentCard.css'

// White content-teaser card: a small thumbnail (a photo, once that
// pipeline exists — currently a gradient placeholder like everywhere else
// in the app) next to a brand + title. Shared by the Routine page's daily
// content teaser and the Read tab so both look identical. Tapping it opens
// ContentModal, where it can be saved to Favorites — `id` must be stable
// and globally unique across everywhere a piece of content is rendered.
function ContentCard({ id, thumbnail, brand, title }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" className="content-card" onClick={() => setOpen(true)}>
        <div className="content-card__thumb" style={{ backgroundImage: thumbnail }} />
        <div className="content-card__body">
          {brand && <span className="content-card__brand">{brand}</span>}
          <span className="content-card__title">{title}</span>
        </div>
      </button>

      {open && (
        <ContentModal
          content={{ id, thumbnail, brand, title }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

export default ContentCard
