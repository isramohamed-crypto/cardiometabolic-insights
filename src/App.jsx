import React, { useState } from 'react'
import Nav from './components/Nav'
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
import BottomNav from './components/BottomNav'

export default function App() {
  const [activePage, setActivePage] = useState('Today')
  const [showBreathe, setShowBreathe] = useState(false)

  return (
    <>
      <Nav activePage={activePage} setActivePage={setActivePage} />

      {activePage === 'Learn' ? (
        <LearnPage />
      ) : (
        <main className="main">
          <div className="hero-wrap">
            <Hero />
            <AskAI />
            <DailyCheckin />
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
          <PeerStories />
          {/* <InsightSection /> */}
        </main>
      )}

      <BottomNav activePage={activePage} setActivePage={setActivePage} />
    </>
  )
}
