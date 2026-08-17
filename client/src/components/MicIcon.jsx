// Microphone glyph for the daily check-in button. Capsule + stand, drawn to
// sit optically centred in a round button — the stand makes the shape
// bottom-heavy, so the capsule is nudged up a touch to compensate.
function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" style={{ display: 'block' }}>
      <rect x="9" y="2.5" width="6" height="10.5" rx="3" fill="currentColor" />
      <path
        d="M5.5 11.2a6.5 6.5 0 0 0 13 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path d="M12 17.7V21" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}

export default MicIcon
