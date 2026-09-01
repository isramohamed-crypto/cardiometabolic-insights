import { useEffect, useState } from 'react'
import App from '../App.jsx'
import PreviewShell from './PreviewShell.jsx'

// Desktop-reviewer convenience: on a wide, mouse-driven screen, show the
// app inside a phone-shaped frame with a nav tray beside it (see
// PreviewShell) instead of full-bleed — mirrors how
// vitalist.brightinsight.app presents this same kind of prototype.
//
// Two escape hatches keep this from ever affecting a real phone:
//   1. `(pointer: fine)` — a touch-primary device (any real phone/tablet,
//      any width, any orientation) never matches, regardless of width.
//   2. Being inside the frame's own <iframe> — window.self !== window.top
//      — always renders the plain App with no shell, so the framed copy
//      isn't itself wrapped in another frame.
const DESKTOP_QUERY = '(min-width: 860px) and (pointer: fine)'

function isFramed() {
  try {
    return window.self !== window.top
  } catch {
    // Cross-origin parent (shouldn't happen for this same-origin iframe,
    // but a thrown access check means "assume framed" is the safer guess).
    return true
  }
}

function usePreviewEligible() {
  const [eligible, setEligible] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches
  )

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY)
    const onChange = (e) => setEligible(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return eligible
}

function PreviewGate() {
  const desktopEligible = usePreviewEligible()

  if (isFramed() || !desktopEligible) {
    return <App />
  }

  return <PreviewShell />
}

export default PreviewGate
