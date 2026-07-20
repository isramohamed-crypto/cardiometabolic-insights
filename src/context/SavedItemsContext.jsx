import React, { createContext, useContext, useEffect, useState } from 'react'

/**
 * Shared store for "saved / tried / found helpful" items across the app.
 *
 * Items are persisted to localStorage so they survive a page refresh.
 * Item shape:
 *   {
 *     id:       string,    unique across the app; convention: "<source-slug>:<item-slug>"
 *     title:    string,    user-readable label
 *     source:   string,    where the item came from (e.g. "Quick wins")
 *     variant:  string,    'try' | 'save' | 'helpful'
 *     markedAt: number,    Date.now() at the moment it was marked
 *   }
 */
const STORAGE_KEY = 'cardiometabolic.savedItems.v1'

const SavedItemsContext = createContext(null)

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (_) {
    return []
  }
}

function saveToStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (_) { /* ignore quota / privacy mode */ }
}

export function SavedItemsProvider({ children }) {
  const [items, setItems] = useState(loadFromStorage)

  useEffect(() => { saveToStorage(items) }, [items])

  function isMarked(id) {
    if (!id) return false
    return items.some(it => it.id === id)
  }

  function toggle(item) {
    if (!item?.id) return
    setItems(prev => {
      if (prev.some(it => it.id === item.id)) {
        return prev.filter(it => it.id !== item.id)
      }
      return [...prev, { ...item, markedAt: Date.now() }]
    })
  }

  function remove(id) {
    setItems(prev => prev.filter(it => it.id !== id))
  }

  return (
    <SavedItemsContext.Provider value={{ items, isMarked, toggle, remove }}>
      {children}
    </SavedItemsContext.Provider>
  )
}

export function useSavedItems() {
  const ctx = useContext(SavedItemsContext)
  if (!ctx) {
    // Fail soft for components that may render outside the provider
    return { items: [], isMarked: () => false, toggle: () => {}, remove: () => {} }
  }
  return ctx
}
