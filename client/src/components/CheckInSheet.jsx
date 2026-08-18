import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import CheckInPanel from './CheckInPanel.jsx'
import './CheckIn.css'

// The bottom sheet the floating mic opens. Thin wrapper: the check-in flow
// itself lives in CheckInPanel, which also renders inline on the Today page.
// See the stacking-order note at the top of SnippetDeck.css for where this
// sits relative to the app's other overlays.
function CheckInSheet({ onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  return createPortal(
    <div className="checkin">
      <button type="button" className="checkin__backdrop" onClick={onClose} aria-label="Close" />

      <div className="checkin__sheet" role="dialog" aria-label="Today’s check-in">
        <button type="button" className="checkin__close" onClick={onClose} aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>

        <CheckInPanel />
      </div>
    </div>,
    document.body,
  )
}

export default CheckInSheet
