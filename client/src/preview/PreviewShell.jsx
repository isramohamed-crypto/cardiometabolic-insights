import { useEffect, useMemo, useRef, useState } from 'react'
import { listDemoProfiles as getDemoProfiles } from '../demo/profiles.js'
import './PreviewShell.css'

// Chrome that surrounds the real app when PreviewGate decides we're a
// desktop reviewer, not a real phone (see PreviewGate.jsx). The app
// itself renders in an <iframe> rather than inline — an iframe is its
// own browsing context, so the many pages built on `100dvh` / sticky
// footers (AppLayout, HabitChat, HealthCheck, Onboarding, ...) measure
// the frame's own box instead of the real browser window, and just work
// without touching any of that CSS.
//
// The tray is a launcher, not a live-synced router: clicking an item
// hard-navigates the iframe to that path (remounting it via `key` so
// re-clicking the same demo profile re-seeds it instead of no-op'ing).
// We poll the iframe's own location to keep the "App" section's active
// state honest if someone navigates inside the phone itself (e.g. taps
// its bottom tab bar), since that doesn't fire any event we can listen
// to from the parent.
const APP_TAB_PATHS = ['/today', '/read', '/collection', '/me']

function buildNavSections() {
  const demoProfiles = getDemoProfiles()
  return [
    {
      heading: 'Demo profiles',
      items: demoProfiles.map((p) => ({
        key: `demo-${p.id}`,
        label: p.label,
        path: `/today/${p.id}`,
        title: p.description,
      })),
    },
    {
      heading: 'Flow',
      items: [{ key: 'onboarding', label: 'Onboarding', path: '/' }],
    },
    {
      heading: 'App',
      items: [
        { key: 'today', label: 'Today', path: '/today' },
        { key: 'read', label: 'Read', path: '/read' },
        { key: 'collection', label: 'Collection', path: '/collection' },
        { key: 'me', label: 'Me', path: '/me' },
      ],
    },
  ]
}

function initialPath() {
  return window.location.pathname + window.location.search
}

function PreviewShell() {
  const sections = useMemo(buildNavSections, [])
  const [framePath, setFramePath] = useState(initialPath)
  const [selectedPath, setSelectedPath] = useState(initialPath)
  const [frameKey, setFrameKey] = useState(0)
  const iframeRef = useRef(null)

  const navigateFrame = (path) => {
    setFramePath(path)
    setSelectedPath(path)
    setFrameKey((k) => k + 1)
    // Keep the address bar shareable without a top-level router.
    window.history.replaceState(null, '', path)
  }

  // Watch the iframe's own navigation so the "App" section highlights
  // correctly even when someone taps around inside the phone itself
  // instead of using the tray.
  useEffect(() => {
    const id = window.setInterval(() => {
      try {
        const win = iframeRef.current?.contentWindow
        const path = win?.location?.pathname
        if (path && APP_TAB_PATHS.includes(path) && path !== selectedPath) {
          setSelectedPath(path)
        }
      } catch {
        // Ignore — same-origin in practice, but never let a transient
        // access error break the interval.
      }
    }, 600)
    return () => window.clearInterval(id)
  }, [selectedPath])

  return (
    <div className="preview-shell">
      <nav className="preview-shell__tray" aria-label="Preview navigation">
        <p className="preview-shell__brand">Vitalist</p>
        {sections.map((section) => (
          <div className="preview-shell__section" key={section.heading}>
            <p className="preview-shell__heading">{section.heading}</p>
            {section.items.map((item) => (
              <button
                key={item.key}
                type="button"
                title={item.title}
                className={
                  'preview-shell__item' +
                  (selectedPath === item.path ? ' preview-shell__item--active' : '')
                }
                onClick={() => navigateFrame(item.path)}
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="preview-shell__frame">
        <iframe
          key={frameKey}
          ref={iframeRef}
          className="preview-shell__iframe"
          src={framePath}
          title="Vitalist preview"
        />
        <div className="preview-shell__home-indicator" aria-hidden="true" />
      </div>
    </div>
  )
}

export default PreviewShell
