import React, { createContext, useContext, useEffect, useState } from 'react'

/**
 * Demo-only "profile stage" toggle — lets us show the app as it would look
 * for a brand-new user (empty states, onboarding prompts) or an established
 * user (populated data, personalized insights) without needing real usage
 * history. Persisted to localStorage so the choice survives a refresh.
 *
 * stage: 'new' | 'mature'
 */
const STORAGE_KEY = 'cardiometabolicProfileStage'
const DEFAULT_STAGE = 'new'

const ProfileStageContext = createContext(null)

function readStage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw === 'new' || raw === 'mature' ? raw : DEFAULT_STAGE
  } catch (_) {
    return DEFAULT_STAGE
  }
}

function writeStage(stage) {
  try { localStorage.setItem(STORAGE_KEY, stage) } catch (_) { /* ignore */ }
}

export function ProfileStageProvider({ children }) {
  const [stage, setStageState] = useState(readStage)

  useEffect(() => { writeStage(stage) }, [stage])

  function setStage(next) {
    setStageState(next === 'mature' ? 'mature' : 'new')
  }

  function toggleStage() {
    setStageState(prev => (prev === 'mature' ? 'new' : 'mature'))
  }

  const value = { stage, isNew: stage === 'new', isMature: stage === 'mature', setStage, toggleStage }

  return (
    <ProfileStageContext.Provider value={value}>
      {children}
    </ProfileStageContext.Provider>
  )
}

export function useProfileStage() {
  const ctx = useContext(ProfileStageContext)
  if (!ctx) {
    // Fail soft for components rendered outside the provider (e.g. isolated previews)
    return { stage: 'new', isNew: true, isMature: false, setStage: () => {}, toggleStage: () => {} }
  }
  return ctx
}
