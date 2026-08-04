import './WhyThisMattersTray.css'

/**
 * Bottom sheet shown when "Why this one?" is tapped on a habit card.
 * Adapted from Figma node 1214:4722. That design also shows a paginated
 * mini-carousel inside the tray (Back/Next + 5 dots) for multiple
 * justification pages — we only have one page of copy per habit right now,
 * so that pagination UI is left out rather than shipped non-functional.
 * Re-add it once there's real multi-page content to page through.
 */
function WhyThisMattersTray({ open, habit, gradient, onClose, onAdd, onAnother }) {
  return (
    <div className={`why-tray-overlay${open ? ' why-tray-overlay--open' : ''}`}>
      <button
        type="button"
        className="why-tray-overlay__backdrop"
        aria-label="Close"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      <div className={`why-tray${open ? ' why-tray--open' : ''}`}>
        <div className="why-tray__handle" />

        <button type="button" className="why-tray__add" onClick={onAdd}>
          Add this habit
        </button>

        <button type="button" className="why-tray__another" onClick={onAnother}>
          Show me another
        </button>

        {habit && (
          <>
            <div className="why-tray__thumb" style={{ backgroundImage: gradient }} />

            <h2 className="why-tray__heading">Why this matters</h2>

            <p className="why-tray__body">{habit.justification}</p>
          </>
        )}
      </div>
    </div>
  )
}

export default WhyThisMattersTray
