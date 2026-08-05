import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listDemoProfiles } from './profiles.js'
import './DemoProfileMenu.css'

// Demo-only shortcut UI: a kebab menu on the landing page listing every
// profile in profiles.js. Picking one is equivalent to visiting
// "/?profile=<id>" directly — this just navigates there; DemoSeeder
// (mounted once at the App level — see App.jsx) is what actually reads
// the query param, seeds the contexts, and redirects to /routine. Keeping
// that logic centralized in DemoSeeder means this menu, and any future
// entry point, never needs its own copy of the seeding logic.
function DemoProfileMenu() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const profiles = listDemoProfiles()

  if (profiles.length === 0) return null

  const handleSelect = (id) => {
    setOpen(false)
    navigate(`/?profile=${id}`)
  }

  return (
    <div className="demo-profile-menu">
      <button
        type="button"
        className="demo-profile-menu__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Demo profiles"
        onClick={() => setOpen((o) => !o)}
      >
        ⋮
      </button>

      {open && (
        <>
          {/* Full-screen transparent button behind the panel — click
              anywhere outside the panel to close it. */}
          <button
            type="button"
            className="demo-profile-menu__backdrop"
            aria-label="Close demo profile menu"
            onClick={() => setOpen(false)}
          />
          <div className="demo-profile-menu__panel" role="menu">
            <p className="demo-profile-menu__heading">Demo profiles</p>
            {profiles.map((profile) => (
              <button
                key={profile.id}
                type="button"
                role="menuitem"
                className="demo-profile-menu__item"
                onClick={() => handleSelect(profile.id)}
              >
                <span className="demo-profile-menu__item-label">{profile.label}</span>
                <span className="demo-profile-menu__item-desc">{profile.description}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default DemoProfileMenu
