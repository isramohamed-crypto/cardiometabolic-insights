import { createContext, useContext, useState } from 'react'

const OwnedChecklistContext = createContext(null)

// Every owned habit is in one of three states on a given day: unmarked,
// done, or explicitly "not today". The third one matters — it's the
// difference between "hasn't got round to it" and "consciously not doing
// this today", and only the person can tell you which. Both marked states
// feed the insights section (see domain/ownedInsights.js); neither is
// treated as a failure anywhere.
export const OWNED_MARK = {
  DONE: 'done',
  NOT_TODAY: 'not-today',
}

// Marks are stored as an ordered array per day rather than a key->value
// map, because "what did they just mark?" is load-bearing: the insights
// section leads with the most recently marked habit. Re-marking a habit
// moves it to the end of the array, so the order is always
// least-to-most-recent.
//
// Keyed by local date string so the day resets on its own — no timer, no
// midnight listener, the key simply stops matching. Local rather than
// ISO/UTC so "today" flips at the user's midnight, not at 8pm.
function localDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function OwnedChecklistProvider({ children }) {
  const [byDate, setByDate] = useState({})
  const today = localDateKey()
  const marks = byDate[today] || []

  const getMark = (key) => marks.find((mark) => mark.key === key)?.state

  // Tapping the state a habit is already in clears it, so a mis-tap is
  // always undoable and there's no third button to reach for.
  const setMark = (key, state) => {
    setByDate((prev) => {
      const current = prev[today] || []
      const existing = current.find((mark) => mark.key === key)
      const without = current.filter((mark) => mark.key !== key)
      return {
        ...prev,
        [today]: existing?.state === state ? without : [...without, { key, state }],
      }
    })
  }

  const setAll = (keys, state) => {
    setByDate((prev) => ({ ...prev, [today]: keys.map((key) => ({ key, state })) }))
  }

  return (
    <OwnedChecklistContext.Provider value={{ marks, getMark, setMark, setAll }}>
      {children}
    </OwnedChecklistContext.Provider>
  )
}

export function useOwnedChecklist() {
  const ctx = useContext(OwnedChecklistContext)
  if (!ctx) throw new Error('useOwnedChecklist must be used within an OwnedChecklistProvider')
  return ctx
}
