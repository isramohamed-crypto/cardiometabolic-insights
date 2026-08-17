import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useOnboarding } from '../onboarding/OnboardingContext.jsx'
import { useHabits } from '../habits/HabitsContext.jsx'
import { getDemoProfile } from './profiles.js'

// Demo-only shortcut: reads ?profile=<id> from the URL and, if it matches
// a known entry in profiles.js, seeds that persona's onboarding answers
// and habits straight into the in-memory contexts, then drops the visitor
// directly into the app shell — skipping the real onboarding flow
// entirely. Renders nothing; it's a side-effect-only component mounted
// once near the top of the app (see App.jsx).
//
// Safe to leave in permanently: it only ever acts when `profile` is
// present in the URL and recognized, so it's invisible to a normal visitor
// clicking "Get started."
function DemoSeeder() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { loadAnswers } = useOnboarding()
  const { seedHabits } = useHabits()
  const seededFor = useRef(null)

  const profileId = searchParams.get('profile')

  useEffect(() => {
    if (!profileId || seededFor.current === profileId) return

    const profile = getDemoProfile(profileId)
    if (!profile) {
      console.warn(`[demo] Unknown profile "${profileId}" in ?profile= — ignoring.`)
      return
    }

    const { answers, habits, slotCount } = profile.build()
    loadAnswers(answers)
    seedHabits(habits, slotCount)
    seededFor.current = profileId
    navigate('/today', { replace: true })
    // Only re-run when the URL's profile id actually changes — loadAnswers/
    // seedHabits/navigate are stable enough for this and re-including them
    // isn't needed to react to a new ?profile= value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId])

  return null
}

export default DemoSeeder
