import './Pill.css'

// Small rounded category badge — e.g. "PHYSICAL ACTIVITY" on a habit
// recommendation card. Kept generic (icon optional) so it can be reused
// anywhere a tag/label chip is needed.
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
