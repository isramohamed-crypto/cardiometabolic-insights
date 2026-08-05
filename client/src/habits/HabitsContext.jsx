import { createContext, useContext, useState } from 'react'
import { OWNERSHIP_STATE, LOG_STATUS, LOG_METHOD } from '../domain/habit.js'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

const HabitsContext = createContext(null)

// In-memory habit store — no backend yet (see domain/habit.js). Holds every
// habit instance the user has started, each carrying a subset of the full
// Habit shape (title/subtitle/pillarId/tier/moment/remindersOn) plus an
// ownershipState that the rest of the app reads to group/display habits.
export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState([])

  // How many habits can be active at once. Starts at 1 — a fresh habit
  // graduating out of its trial (kept or downsized, not let go) unlocks
  // the next slot. Locked-slot placeholders on Routine/Collection read
  // this directly.
  const [slotCount, setSlotCount] = useState(1)
  const unlockSlot = () => setSlotCount((n) => n + 1)

  // New habits always enter at TRIALED (tier one — actively trying it out),
  // per the ownership state machine in domain/habit.js. `startedAt` anchors
  // the 7-day tracker on the Routine card (HabitDayTracker); `log` holds
  // HabitLogEntry rows once daily check-in exists — empty until then.
  const addHabit = (habit) => {
    setHabits((prev) => [
      ...prev,
      {
        ownershipState: OWNERSHIP_STATE.TRIALED,
        startedAt: new Date().toISOString(),
        log: [],
        ...habit,
      },
    ])
  }

  const updateHabitState = (id, ownershipState) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ownershipState } : h)),
    )
  }

  // Generic patch for editing an existing habit — e.g. tier, moment, or
  // remindersOn from the full-screen habit detail view.
  const updateHabit = (id, patch) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...patch } : h)))
  }

  // Manual daily check-in — toggles a DONE HabitLogEntry for today on/off.
  // Feeds HabitDayTracker directly since it just reads `log`.
  const toggleTodayDone = (id) => {
    const key = todayKey()
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h
        const log = h.log || []
        const alreadyDone = log.some(
          (entry) => entry.date === key && entry.status === LOG_STATUS.DONE,
        )
        const nextLog = alreadyDone
          ? log.filter((entry) => entry.date !== key)
          : [...log, { date: key, status: LOG_STATUS.DONE, method: LOG_METHOD.MANUAL }]
        return { ...h, log: nextLog }
      }),
    )
  }

  // Replaces the whole habit list (and, optionally, slotCount) in one
  // shot — used by the demo seeder (see src/demo) to drop in a persona's
  // habits pre-populated at whatever maturity level it represents,
  // bypassing the real add-a-habit flow entirely.
  const seedHabits = (nextHabits, nextSlotCount) => {
    setHabits(nextHabits)
    if (typeof nextSlotCount === 'number') setSlotCount(nextSlotCount)
  }

  return (
    <HabitsContext.Provider
      value={{
        habits,
        addHabit,
        updateHabitState,
        updateHabit,
        toggleTodayDone,
        slotCount,
        unlockSlot,
        seedHabits,
      }}
    >
      {children}
    </HabitsContext.Provider>
  )
}

export function useHabits() {
  const ctx = useContext(HabitsContext)
  if (!ctx) throw new Error('useHabits must be used within a HabitsProvider')
  return ctx
}
