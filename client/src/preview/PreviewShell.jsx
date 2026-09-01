import { useMemo, useRef, useState } from 'react'
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
// It floats fixed over the page rather than sitting in flow next to the
// frame, so collapsing/expanding it never shifts the frame's own
// position — the frame is centered by its own independent container.
// Getting around the rest of the app (its real tabs included) happens
// inside the phone itself, same as on a real device.
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
  ]
}

// Default landing page for the frame — always the start of onboarding,
// regardless of whatever path the outer (unframed) page happened to load
// at (e.g. a bare domain hit, or a path with no matching route like
// "/routine"). A deep link into a specific screen still works once
// you're navigating via the tray — this only governs the very first
// paint.
function initialPath() {
  return '/'
}

function PreviewShell() {
  const sections = useMemo(buildNavSections, [])
  const [framePath, setFramePath] = useState(initialPath)
  const [selectedPath, setSelectedPath] = useState(initialPath)
  const [frameKey, setFrameKey] = useState(0)
  const [collapsed, setCollapsed] = useState(false)
  const iframeRef = useRef(null)

  const navigateFrame = (path) => {
    setFramePath(path)
    setSelectedPath(path)
    setFrameKey((k) => k + 1)
    // Keep the address bar shareable without a top-level router.
    window.history.replaceState(null, '', path)
  }

  return (
    <div className="preview-shell">
      <nav
        className={'preview-shell__tray' + (collapsed ? ' preview-shell__tray--collapsed' : '')}
        aria-label="Preview navigation"
      >
        <div className="preview-shell__tray-header">
          {!collapsed && <p className="preview-shell__brand">Vitalist</p>}
          <button
            type="button"
            className="preview-shell__collapse-toggle"
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
            onClick={() => setCollapsed((c) => !c)}
          >
            {collapsed ? '»' : '«'}
          </button>
        </div>

        {!collapsed &&
          sections.map((section) => (
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
