import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useOnboarding } from '../onboarding/OnboardingContext.jsx'
import { useHabits } from '../habits/HabitsContext.jsx'
import { getDemoProfile } from './profiles.js'

// Path-based twin of DemoSeeder's ?profile=<id> query param — lets a demo
// profile be linked as e.g. /today/newuser or /today/7days instead,
// which reads more like a normal shareable URL than a query string. Same
// seed-then-redirect behavior: resolve the id (or alias — see
// PROFILE_URL_ALIASES in profiles.js) from the :demoProfile path segment,
// seed the onboarding answers + habits into the in-memory contexts, then
// replace the URL with the plain /today everything else links to. An
// unrecognized slug just redirects to plain /today with nothing seeded,
// same "fail quiet" behavior DemoSeeder uses for an unknown ?profile=.
function DemoProfileRoute() {
  const { demoProfile } = useParams()
  const navigate = useNavigate()
  const { loadAnswers } = useOnboarding()
  const { seedHabits } = useHabits()

  useEffect(() => {
    const profile = getDemoProfile(demoProfile)
    if (!profile) {
      console.warn(`[demo] Unknown profile "${demoProfile}" in /today/:demoProfile — ignoring.`)
      navigate('/today', { replace: true })
      return
    }

    const { answers, habits, slotCount } = profile.build()
    loadAnswers(answers)
    seedHabits(habits, slotCount)
    navigate('/today', { replace: true })
    // Runs once per mount (a fresh navigation to this route each time) —
    // no need to react to anything changing afterward.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default DemoProfileRoute
