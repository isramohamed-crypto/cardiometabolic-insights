import { createContext, useContext, useState } from 'react'

const FavoritesContext = createContext(null)

// In-memory "saved" content store — no backend yet, same pattern as
// HabitsContext. Holds full content items ({id, thumbnail, brand, title})
// so the Favorites section on Read can render them without needing to
// re-look them up anywhere.
export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([])

  const isFavorite = (id) => favorites.some((item) => item.id === id)

  const toggleFavorite = (content) => {
    setFavorites((prev) =>
      prev.some((item) => item.id === content.id)
        ? prev.filter((item) => item.id !== content.id)
        : [...prev, content],
    )
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within a FavoritesProvider')
  return ctx
}
