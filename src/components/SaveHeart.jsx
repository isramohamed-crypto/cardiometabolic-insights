import React from 'react'
import { useSavedItems } from '../context/SavedItemsContext'
import './SaveHeart.css'

// Save-for-later heart, shared by every place a piece of content is shown.
// Ids share the `read:` namespace with the Read tab, so anything hearted
// anywhere in the app shows up in Read > Favorites.

// Pillar icons — used for the Favorites thumbnail, since habit-side pieces
// carry no icon of their own (Read-tab articles do).
export const GOAL_ICON = {
  move:    'fa-solid fa-person-walking',
  strong:  'fa-solid fa-dumbbell',
  eat:     'fa-solid fa-carrot',
  sleep:   'fa-solid fa-moon',
  stress:  'fa-solid fa-spa',
  connect: 'fa-solid fa-users',
  water:   'fa-solid fa-droplet',
}

export function slugify(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export function savedIdForPiece(goalId, piece) {
  return `read:${goalId}-${slugify(piece && piece.hed)}`
}

/**
 * piece  — { hed, source?, read?, dek?, body?, tag? }
 * goalId — pillar the piece belongs to; picks the Favorites icon
 * bg     — gradient for the Favorites thumbnail
 * variant— 'art' | 'panel' | 'hero'  (placement styling)
 */
export default function SaveHeart({ piece, goalId, bg, source, variant = 'art' }) {
  const { isMarked, toggle } = useSavedItems()
  if (!piece || !piece.hed) return null

  const id = savedIdForPiece(goalId, piece)
  const saved = isMarked(id)

  return (
    <button
      className={`save save--${variant}${saved ? ' on' : ''}`}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${piece.hed} from favorites` : `Save ${piece.hed} for later`}
      onClick={e => {
        e.stopPropagation()
        toggle({
          id,
          title: piece.hed,
          source: piece.source || source,
          variant: 'save',
          article: {
            id,
            hed: piece.hed,
            source: piece.source || source,
            readTime: piece.read ? `${piece.read} read` : '',
            dek: piece.dek,
            body: piece.body,
            bg,
            icon: GOAL_ICON[goalId] || 'fa-solid fa-newspaper',
          },
        })
      }}
    >
      <i className={saved ? 'fa-solid fa-heart' : 'fa-regular fa-heart'} aria-hidden="true" />
    </button>
  )
}
