import { createContext, useContext, useState } from 'react'

const OwnedChecklistContext = createContext(null)

// Tracks which of the "habits I own" (the foundation habits brought in
// from onboarding — see domain/foundationHabits.js) have been ticked off
// on a given day.
//
// Keyed by local date string rather than a flat list, for two reasons:
// the checklist is a daily affirmation, so it has to come back empty
// tomorrow; and keying by date means no reset timer or midnight listener
// is needed — the key simply stops matching. Local date, not ISO/UTC, so
// "today" flips at the user's midnight and not at 8pm.
//
// Lives here rather than in HabitsContext because these aren't habits in
// the domain sense — they have no id in the catalog, no trial, no
// ownership state, no log. They're onboarding answers being celebrated.
function localDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function OwnedChecklistProvider({ children }) {
  const [byDate, setByDate] = useState({})
  const today = localDateKey()
  const checkedToday = byDate[today] || []

  const isChecked = (key) => checkedToday.includes(key)

  const toggle = (key) => {
    setByDate((prev) => {
      const current = prev[today] || []
      return {
        ...prev,
        [today]: current.includes(key)
          ? current.filter((item) => item !== key)
          : [...current, key],
      }
    })
  }

  // "I did all of these" — set rather than merge, so the same control can
  // be used to clear the day back out again (see the checklist's toggle-all
  // button, which passes an empty list when everything is already ticked).
  const setAll = (keys) => {
    setByDate((prev) => ({ ...prev, [today]: [...keys] }))
  }

  return (
    <OwnedChecklistContext.Provider value={{ checkedToday, isChecked, toggle, setAll }}>
      {children}
    </OwnedChecklistContext.Provider>
  )
}

export function useOwnedChecklist() {
  const ctx = useContext(OwnedChecklistContext)
  if (!ctx) throw new Error('useOwnedChecklist must be used within an OwnedChecklistProvider')
  return ctx
}
