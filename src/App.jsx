import React, { useState, useCallback } from 'react'
import Nav from './components/Nav'
import Registration from './components/Registration'
import Onboarding from './components/Onboarding'
import AccountDrawer from './components/AccountDrawer'
import ProfilePage, { computeCompletion } from './components/ProfilePage'
import SettingsPage, { ACCOUNT_SECTIONS, NOTIFICATION_SECTIONS } from './components/SettingsPage'
import SavedItemsPage from './components/SavedItemsPage'
import SkinCheckinSheet from './components/SkinCheckinSheet'
import Hero from './components/Hero'
import StatusStrip from './components/StatusStrip'
import DailyCheckin from './components/DailyCheckin'
import HealthPulseCard from './components/HealthPulseCard'
import HealthPulseSheet from './components/HealthPulseSheet'
import SponsorBanner from './components/SponsorBanner'
import TodayCard from './components/TodayCard'
import InsightCard from './components/InsightCard'
import CareTeamCard from './components/CareTeamCard'
import ProgressCard from './components/ProgressCard'
import ProgramCard from './components/ProgramCard'
import AskAI from './components/AskAI'
import ForYouNow from './components/ForYouNow'
import SwipeLearn from './components/SwipeLearn'
import Breathe from './components/Breathe'
import QuickAnswers from './components/QuickAnswers'
import DupixentAd from './components/DupixentAd'
import WatchNow from './components/WatchNow'
import InsightSection from './components/InsightSection'
import CommunityPoll from './components/CommunityPoll'
import AutumnTravelCard from './components/AutumnTravelCard'
import OnesToWatch from './components/OnesToWatch'
import PeerStories from './components/PeerStories'
import LearnPage from './components/LearnPage'
import TrackPage from './components/TrackPage'
import PreparePage from './components/PreparePage'
import BottomNav from './components/BottomNav'

function readProfile() {
  try {
    const raw = localStorage.getItem('skinsightsProfile')
    return raw ? JSON.parse(raw) : {}
  } catch (_) { return {} }
}

function writeProfile(p) {
  try { localStorage.setItem('skinsightsProfile', JSON.stringify(p)) } catch (_) {}
}

export default function App() {
  const [activePage, setActivePage] = useState('Today')
  const [showBreathe, setShowBreathe] = useState(false)
  const [showRegistration, setShowRegistration] = useState(false)
  const [onboarding, setOnboarding] = useState(null)
  const [showDrawer, setShowDrawer] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showSavedItems, setShowSavedItems] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [showCheckin, setShowCheckin] = useState(false)
  const [checkinTick, setCheckinTick] = useState(0)   // bumps after a check-in is logged
  const [showPulse, setShowPulse] = useState(false)
  const [pulseTick, setPulseTick]   = useState(0)   // bumps after a Health Pulse is logged
  const [profile, setProfile] = useState(() => readProfile())

  const refreshProfile = useCallback(() => setProfile(readProfile()), [])

  function startOnboarding(name = '') {
    setShowRegistration(false)
    setOnboarding({ name })
  }

  function handleAvatarClick() {
    refreshProfile()
    setShowDrawer(true)
  }

  function handleAvatarChange(dataUrl) {
    setProfile(p => {
      const next = { ...p, avatarUrl: dataUrl, updatedAt: new Date().toISOString() }
      writeProfile(next)
      return next
    })
  }

  function handleDrawerSelect(itemId) {
    setShowDrawer(false)
    if (itemId === 'profile')        { setShowProfile(true); return }
    if (itemId === 'savedItems')     { setShowSavedItems(true); return }
    if (itemId === 'notifications')  { setShowNotifications(true); return }
    if (itemId === 'settings')       { setShowAccount(true); return }
    if (itemId === 'help' || itemId === 'signout') {
      // Stub for now.
      return
    }
  }

  function closeOverlay(closer) {
    return () => { closer(false); refreshProfile() }
  }

  const completion = computeCompletion(profile)
  const firstName = (profile?.name || '').trim().split(' ')[0]
  const avatarInitial = firstName ? firstName.charAt(0).toUpperCase() : 'C'
  const avatarUrl = profile?.avatarUrl || ''

  return (
    <>
      <Nav
        activePage={activePage}
        setActivePage={setActivePage}
        onLogoClick={() => setShowRegistration(true)}
        onAvatarClick={handleAvatarClick}
        avatarInitial={avatarInitial}
        avatarUrl={avatarUrl}
      />
      {showRegistration && <Registration onClose={() => setShowRegistration(false)} onStartOnboarding={startOnboarding} />}
      {onboarding && <Onboarding name={onboarding.name} onClose={() => {
        setOnboarding(null)
        refreshProfile()
        // Onboarding clears check-in storage — bump the tick so the home-feed
        // card and Track banner re-read and reflect the empty state.
        setCheckinTick(t => t + 1)
      }} />}

      {showDrawer && (
        <AccountDrawer
          profile={profile}
          completionPct={completion.pct}
          strengthLabel={completion.label}
          onClose={() => setShowDrawer(false)}
          onSelect={handleDrawerSelect}
          onAvatarChange={handleAvatarChange}
        />
      )}

      {showProfile && (
        <ProfilePage
          onClose={closeOverlay(setShowProfile)}
          onAskAI={() => {
            // TODO: hand prefilled prompt to AskAI once teammate's AI work lands.
            setShowProfile(false)
            setActivePage('Today')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      )}

      {showSavedItems && (
        <SavedItemsPage onClose={() => setShowSavedItems(false)} />
      )}

      {showNotifications && (
        <SettingsPage
          title="Notifications"
          storageKey="skinsightsNotifications"
          sections={NOTIFICATION_SECTIONS}
          onClose={closeOverlay(setShowNotifications)}
          onNavigate={target => {
            if (target === 'account') {
              setShowNotifications(false)
              setShowAccount(true)
            }
          }}
        />
      )}

      {showAccount && (
        <SettingsPage
          title="Account settings"
          storageKey="skinsightsAccount"
          sections={ACCOUNT_SECTIONS}
          onClose={closeOverlay(setShowAccount)}
          onNavigate={target => {
            if (target === 'notifications') {
              setShowAccount(false)
              setShowNotifications(true)
            }
          }}
        />
      )}

      {/* Skin check-in sheet — mounted at App level so any page can open it */}
      <SkinCheckinSheet
        open={showCheckin}
        onClose={() => setShowCheckin(false)}
        onComplete={() => setCheckinTick(t => t + 1)}
        onViewTrack={() => {
          setShowCheckin(false)
          setActivePage('Track')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />

      {/* Weekly Health Pulse — DLQI + POEM. Mounted at App level. */}
      {showPulse && (
        <HealthPulseSheet
          onClose={() => setShowPulse(false)}
          onComplete={() => setPulseTick(t => t + 1)}
        />
      )}

      {activePage === 'Learn' ? (
        <LearnPage />
      ) : activePage === 'Track' ? (
        <TrackPage onOpenCheckin={() => setShowCheckin(true)} checkinTick={checkinTick} />
      ) : activePage === 'Prepare' ? (
        <PreparePage />
      ) : (
        <main className="main">
          <div className="hero-wrap">
            <Hero firstName={firstName} />
            <AskAI />
            {/* <div className="today-wrap">
              <TodayCard />
            </div> */}
          </div>
          {/* Today screen section order:
              1 hero · 2 quick wins · 3 travel+leisure · 4 skin check ·
              5 ones to watch · 6 eczema in real life · 7 stress-skin ·
              8 real stories · 9 expert advice · 10 weekly health pulse */}
          {/* 'Tips for you' — the Real Simple carousel above and the
              daily Skin Diary card below visually belong to the same
              section (single section heading via ForYouNow). */}
          <ForYouNow onStartBreathe={() => setShowBreathe(true)} />
          <DailyCheckin onOpen={() => setShowCheckin(true)} tick={checkinTick} />
          {showBreathe && <Breathe onClose={() => setShowBreathe(false)} />}

          {/* "Based on your interests…" — Travel + Leisure and Ones to
              Watch sit side-by-side in a horizontal scroll carousel. */}
          <section className="interests-row">
            <h2 className="interests-row__heading">Based on your interests</h2>
            <div className="interests-row__scroll">
              <div className="interests-row__item"><OnesToWatch /></div>
              <div className="interests-row__item"><AutumnTravelCard /></div>
            </div>
          </section>

          <QuickAnswers />
          <SponsorBanner />
          <SwipeLearn onLearnClick={() => { setActivePage('Learn'); window.scrollTo(0, 0) }} onStartBreathe={() => setShowBreathe(true)} />
          <PeerStories />
          <WatchNow />
          <SponsorBanner />
          {/* <DupixentAd /> — removed from Today order. Restore here if needed. */}
          {/* <InsightSection /> */}
        </main>
      )}

      <BottomNav activePage={activePage} setActivePage={setActivePage} />
    </>
  )
}
