import React, { useState, useCallback, useRef } from 'react'
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
import TodayInsightCheckin from './components/TodayInsightCheckin'
import HealthPulseCard from './components/HealthPulseCard'
import HealthPulseSheet from './components/HealthPulseSheet'
import SponsorBanner from './components/SponsorBanner'
import TodayCard from './components/TodayCard'
import InsightCard from './components/InsightCard'
import CareTeamCard from './components/CareTeamCard'
import ProgressCard from './components/ProgressCard'
import ProgramCard from './components/ProgramCard'
import AskAI from './components/AskAI'
import ConditionStrip from './components/ConditionStrip'
import DashboardRow from './components/DashboardRow'
import ForYouNow from './components/ForYouNow'
import SwipeLearn from './components/SwipeLearn'
import Breathe from './components/Breathe'
import QuickAnswers from './components/QuickAnswers'
import DupixentAd from './components/DupixentAd'
import WatchNow from './components/WatchNow'
import MyRituals from './components/MyRituals'
import CommunityPoll from './components/CommunityPoll'
import AutumnTravelCard from './components/AutumnTravelCard'
import MyRecipesCard from './components/MyRecipesCard'
import BHGCard from './components/BHGCard'
import OnesToWatch from './components/OnesToWatch'
import PeerStories from './components/PeerStories'
import StoriesSection from './components/StoriesSection'
import LearnPage from './components/LearnPage'
import EatingWellSection from './components/EatingWellSection'
import NutritionBuildingBlocksSection from './components/NutritionBuildingBlocksSection'
import VeryWellSection from './components/VeryWellSection'
import InStyleSection from './components/InStyleSection'
import ParentsCaregiverSupportSection from './components/ParentsCaregiverSupportSection'
import TrackPage from './components/TrackPage'
import PreparePage from './components/PreparePage'
import BottomNav from './components/BottomNav'

function readProfile() {
  try {
    const raw = localStorage.getItem('cardiometabolicProfile')
    return raw ? JSON.parse(raw) : {}
  } catch (_) { return {} }
}

function writeProfile(p) {
  try { localStorage.setItem('cardiometabolicProfile', JSON.stringify(p)) } catch (_) {}
}

function ArchivedSection({ children }) {
  const [open, setOpen] = useState(false)
  return (
    <section className="archived-section">
      <button
        className="archived-section__title"
        onClick={() => setOpen(o => !o)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}
      >
        Archived
        <span style={{ fontSize: 10, opacity: 0.5 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && children}
    </section>
  )
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
  const [ritualsKey, setRitualsKey]   = useState(0)   // bumps after onboarding to force MyRituals remount
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
        setCheckinTick(t => t + 1)
        setRitualsKey(k => k + 1)   // always forces MyRituals to remount with fresh profile
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
          storageKey="cardiometabolicNotifications"
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
          storageKey="cardiometabolicAccount"
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
              1 hero · 2 AI · 3 daily check-in · 4 quick answers ·
              5 tips for you · 6 peer stories · 7 watch now ·
              8 interests · 9 swipe learn */}

          {/* My Numbers now lives on the Track tab only — see TrackPage.jsx */}

          {/* AI insight + daily check-in — combined into one card. New users
              get a single compact check-in card with the insight folded in
              as a pill; established users get the full insight and the
              check-in entry point as two sections of the same card. */}
          <TodayInsightCheckin onOpenCheckin={() => setShowCheckin(true)} tick={checkinTick} />
          {showBreathe && <Breathe onClose={() => setShowBreathe(false)} />}

          <MyRituals key={ritualsKey} />

          {/* Nutrition Building Blocks — EatingWell featured content */}
          <NutritionBuildingBlocksSection />

          <div className="sponsor-card-wrap">
            <SponsorBanner variant="card" />
          </div>

          <StoriesSection onNavigate={target => { setActivePage(target); window.scrollTo(0, 0) }} />

          {/* 8 — EatingWell featured content */}
          <EatingWellSection />

          {/* 7 — Watch Now: video for deeper learning */}
          <WatchNow />

          {/* 9 — VeryWell Health + Mind */}
          <VeryWellSection />

          {/* 10 — InStyle featured content */}
          <InStyleSection />

          {/* 9 — Swipe Learn */}
          <SwipeLearn onLearnClick={() => { setActivePage('Learn'); window.scrollTo(0, 0) }} onStartBreathe={() => setShowBreathe(true)} />
          <SponsorBanner />

          {/* Archived — collapsed by default */}
          <ArchivedSection>
            <ParentsCaregiverSupportSection />
            <PeerStories />
            <QuickAnswers />
            <ConditionStrip />
            <ForYouNow onStartBreathe={() => setShowBreathe(true)} />
          </ArchivedSection>
        </main>
      )}

      <BottomNav activePage={activePage} setActivePage={setActivePage} />
    </>
  )
}
