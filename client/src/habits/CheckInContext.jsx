import { createContext, useContext, useState } from 'react'

const CheckInContext = createContext(null)

// What the person said they want help with today. One answer per day, kept
// in memory like every other bit of state in this prototype.
//
// Keyed by local date so it resets on its own overnight — same approach as
// OwnedChecklistContext, and for the same reason: no timer, no listener, the
// key just stops matching.
function localDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function CheckInProvider({ children }) {
  const [byDate, setByDate] = useState({})
  const today = localDateKey()
  const checkIn = byDate[today] || null

  // `spoken` carries the raw transcript when the answer came from the
  // microphone, so the sheet can show what it heard rather than silently
  // reinterpreting it. Null for a tapped answer.
  const setCheckIn = (needId, spoken = null) =>
    setByDate((prev) => ({ ...prev, [today]: { needId, spoken } }))

  const clearCheckIn = () => setByDate((prev) => ({ ...prev, [today]: null }))

  return (
    <CheckInContext.Provider value={{ checkIn, setCheckIn, clearCheckIn }}>
      {children}
    </CheckInContext.Provider>
  )
}

export function useCheckIn() {
  const ctx = useContext(CheckInContext)
  if (!ctx) throw new Error('useCheckIn must be used within a CheckInProvider')
  return ctx
}
