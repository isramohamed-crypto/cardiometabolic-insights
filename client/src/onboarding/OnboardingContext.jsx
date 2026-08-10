import { createContext, useContext, useState } from 'react'

const OnboardingContext = createContext(null)

export function OnboardingProvider({ children }) {
  // Keyed by step id, e.g. answers.habitsWorking = ['moving-more', 'sleep']
  const [answers, setAnswers] = useState({})

  const setAnswer = (stepId, value) => {
    setAnswers((prev) => ({ ...prev, [stepId]: value }))
  }

  // Replaces the whole answers object in one shot — used by the demo
  // seeder (see src/demo) to drop in a persona's onboarding answers
  // without walking through the real onboarding screens.
  const loadAnswers = (nextAnswers) => {
    // Demo profiles seed everything EXCEPT the name — so a real onboarding
    // name the user typed carries through a profile switch. Callers that
    // truly want to clear it (Restart onboarding) pass an explicit `name`.
    setAnswers((prev) =>
      'name' in nextAnswers ? nextAnswers : { ...nextAnswers, name: prev.name },
    )
  }

  return (
    <OnboardingContext.Provider value={{ answers, setAnswer, loadAnswers }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error('useOnboarding must be used within an OnboardingProvider')
  return ctx
}
