import React, { useState } from 'react'
import Nav from './components/Nav'
import Registration from './components/Registration'
import Onboarding from './components/Onboarding'
import Hero from './components/Hero'
import StatusStrip from './components/StatusStrip'
import DailyCheckin from './components/DailyCheckin'
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
import PeerStories from './components/PeerStories'
import LearnPage from './components/LearnPage'
import TrackPage from './components/TrackPage'
import PreparePage from './components/PreparePage'
import BottomNav from './components/BottomNav'

export default function App() {
  const [activePage, setActivePage] = useState('Today')
  const [showBreathe, setShowBreathe] = useState(false)
  const [showRegistration, setShowRegistration] = useState(false)
  const [onboarding, setOnboarding] = useState(null) // null | { name }

  function startOnboarding(name = '') {
    setShowRegistration(false)
    setOnboarding({ name })
  }

  return (
    <>
      <Nav activePage={activePage} setActivePage={setActivePage} onLogoClick={() => setShowRegistration(true)} />
      {showRegistration && <Registration onClose={() => setShowRegistration(false)} onStartOnboarding={startOnboarding} />}
      {onboarding && <Onboarding name={onboarding.name} onClose={() => setOnboarding(null)} />}

      {activePage === 'Learn' ? (
        <LearnPage />
      ) : activePage === 'Track' ? (
        <TrackPage />
      ) : activePage === 'Prepare' ? (
        <PreparePage />
      ) : (
        <main className="main">
          <div className="hero-wrap">
            <Hero />
            <AskAI />
            {/* <div className="today-wrap">
              <TodayCard />
            </div> */}
          </div>
          <ForYouNow onStartBreathe={() => setShowBreathe(true)} />
          {showBreathe && <Breathe onClose={() => setShowBreathe(false)} />}
          <SwipeLearn onLearnClick={() => { setActivePage('Learn'); window.scrollTo(0, 0) }} onStartBreathe={() => setShowBreathe(true)} />
          <DupixentAd />
          <WatchNow />
          <CommunityPoll />
          <QuickAnswers />
          <DailyCheckin />
          <PeerStories />
          {/* <InsightSection /> */}
        </main>
      )}

      <BottomNav activePage={activePage} setActivePage={setActivePage} />
    </>
  )
}
