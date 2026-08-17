import { useState } from 'react'
import MicIcon from './MicIcon.jsx'
import CheckInSheet from './CheckInSheet.jsx'
import { useCheckIn } from '../habits/CheckInContext.jsx'
import './CheckIn.css'

// Floating check-in button, mounted once in AppLayout so it rides above
// every tab rather than belonging to one screen. Sits clear of the footer
// nav (see .checkin-fab's bottom offset, which is derived from
// --footer-height so the two can't drift apart).
//
// Shows a dot once the day's check-in is answered — enough to say "done"
// without a badge count, since there's only ever one answer a day.
function CheckInFab() {
  const [open, setOpen] = useState(false)
  const { checkIn } = useCheckIn()

  return (
    <>
      <button
        type="button"
        className={`checkin-fab${checkIn ? ' checkin-fab--answered' : ''}`}
        onClick={() => setOpen(true)}
        aria-label={checkIn ? 'Today’s check-in' : 'Start your daily check-in'}
      >
        <MicIcon />
        {checkIn && <span className="checkin-fab__dot" aria-hidden="true" />}
      </button>

      {open && <CheckInSheet onClose={() => setOpen(false)} />}
    </>
  )
}

export default CheckInFab
