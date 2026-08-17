import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../onboarding/OnboardingContext.jsx'
import { useHabits } from '../habits/HabitsContext.jsx'
import { listDemoProfiles } from './profiles.js'
import './DemoProfileMenu.css'

// Demo-only shortcut UI: a kebab menu listing every profile in
// profiles.js. Picking one is equivalent to visiting "/?profile=<id>"
// directly — this just navigates there; DemoSeeder (mounted once at the
// App level — see App.jsx) is what actually reads the query param, seeds
// the contexts, and redirects to /today. Keeping that logic centralized
// in DemoSeeder means this menu, and any future entry point, never needs
// its own copy of the seeding logic.
//
// Two placements: the default floats absolute in a corner (the onboarding
// landing page, over the hero photo — needs its own position since
// nothing there is meant to sit next to it). Pass `inline` to instead let
// it sit in normal flow next to other content (Me's title row) — the
// dropdown panel still anchors to the trigger either way since the
// wrapper stays a positioned element in both modes.
function DemoProfileMenu({ inline }) {
  const navigate = useNavigate()
  const { loadAnswers } = useOnboarding()
  const { seedHabits } = useHabits()
  const [open, setOpen] = useState(false)
  const profiles = listDemoProfiles()

  if (profiles.length === 0) return null

  const handleSelect = (id) => {
    setOpen(false)
    navigate(`/?profile=${id}`)
  }

  const handleRestart = () => {
    setOpen(false)
    // Actually reset the flow — clear onboarding answers and any seeded/
    // built habits (and the slot count) so onboarding truly starts fresh,
    // rather than just routing to '/' with the old selections still live.
    loadAnswers({ name: '' })
    seedHabits([], 1)
    navigate('/')
  }

  return (
    <div className={`demo-profile-menu${inline ? ' demo-profile-menu--inline' : ''}`}>
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
            <div className="demo-profile-menu__divider" />
            <button
              type="button"
              role="menuitem"
              className="demo-profile-menu__item"
              onClick={handleRestart}
            >
              <span className="demo-profile-menu__item-label">↺ Restart onboarding</span>
              <span className="demo-profile-menu__item-desc">Jump back to the very beginning of the flow.</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default DemoProfileMenu
