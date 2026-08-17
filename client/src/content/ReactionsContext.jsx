import { createContext, useContext, useState } from 'react'

const ReactionsContext = createContext(null)

// In-memory like/dislike store for content cards — same no-backend
// pattern as FavoritesContext and HabitsContext. Kept separate from
// Favorites on purpose: a save is a "come back to this" action that has
// its own destination (the Learn tab), whereas a like/dislike is a
// feedback signal about the recommendation itself. Only ids are held, not
// whole items, since nothing renders a list of liked content yet — a
// dislike's only current job is to pull that card out of the Today feed
// and let the next candidate take its place (see Routine.jsx).
//
// Liking and disliking are mutually exclusive: reacting one way clears
// the other, so a card can't be counted as both.
export function ReactionsProvider({ children }) {
  const [liked, setLiked] = useState([])
  const [disliked, setDisliked] = useState([])

  const isLiked = (id) => liked.includes(id)
  const isDisliked = (id) => disliked.includes(id)

  const toggleLike = (id) => {
    setDisliked((prev) => prev.filter((item) => item !== id))
    setLiked((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const toggleDislike = (id) => {
    setLiked((prev) => prev.filter((item) => item !== id))
    setDisliked((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <ReactionsContext.Provider
      value={{
        liked,
        disliked,
        isLiked,
        isDisliked,
        toggleLike,
        toggleDislike,
      }}
    >
      {children}
    </ReactionsContext.Provider>
  )
}

export function useReactions() {
  const ctx = useContext(ReactionsContext)
  if (!ctx) throw new Error('useReactions must be used within a ReactionsProvider')
  return ctx
}
