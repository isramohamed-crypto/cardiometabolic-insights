import './Pill.css'

// Small rounded category badge — e.g. "PHYSICAL ACTIVITY" on a habit
// recommendation card. Kept generic (icon optional) so it can be reused
// anywhere a tag/label chip is needed. `icon` can be any node — every
// pillar pill (RoutineHabitCard/AlreadyYoursCard/HabitPickCard) passes a
// real ACLM icon <img>, sized by .pill__icon img in Pill.css.
function Pill({ icon, label }) {
  return (
    <span className="pill">
      {icon && (
        <span className="pill__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {label}
    </span>
  )
}

export default Pill
