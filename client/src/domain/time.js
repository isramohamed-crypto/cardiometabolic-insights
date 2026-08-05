// Shared by every screen that lets someone pick a specific time for a
// habit (onboarding's CustomizeHabit, HabitEdit, and HabitDetail's inline
// "When" chips) — converts a <input type="time"> value ("19:30") into the
// "7:30 PM" display format habits store in `moment`.
export function formatTime(value) {
  if (!value) return ''
  const [hours, minutes] = value.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 || 12
  return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`
}
