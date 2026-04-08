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
import ForYouNow from './components/ForYouNow'
import SwipeLearn from './components/SwipeLearn'
import Breathe from './components/Breathe'
import QuickAnswers from './components/QuickAnswers'
import DupixentAd from './components/DupixentAd'
import WatchNow from './components/WatchNow'
import InsightSection from './components/InsightSection'
import LearnPage from './components/LearnPage'
import BottomNav from './components/BottomNav'

export default function App() {
  const [activePage, setActivePage] = useState('Today')

  return (
    <>
      <Nav activePage={activePage} setActivePage={setActivePage} />

      {activePage === 'Learn' ? (
        <LearnPage />
      ) : (
        <main className="main">
          <div className="hero-wrap">
            <Hero />
            <DailyCheckin />
            {/* <div className="today-wrap">
              <TodayCard />
            </div> */}
            <ForYouNow />
          </div>
          <Breathe />
          <SwipeLearn onLearnClick={() => setActivePage('Learn')} />
          <QuickAnswers />
          <DupixentAd />
          <WatchNow />
          <InsightSection />
        </main>
      )}

      <BottomNav activePage={activePage} setActivePage={setActivePage} />
    </>
  )
}
