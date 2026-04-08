import React from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import StatusStrip from './components/StatusStrip'
import DailyCheckin from './components/DailyCheckin'
import TodayCard from './components/TodayCard'
import InsightCard from './components/InsightCard'
import CareTeamCard from './components/CareTeamCard'
import ProgressCard from './components/ProgressCard'
import ProgramCard from './components/ProgramCard'
import SwipeLearn from './components/SwipeLearn'
import QuickAnswers from './components/QuickAnswers'
import DupixentAd from './components/DupixentAd'
import WatchNow from './components/WatchNow'
import BottomNav from './components/BottomNav'

export default function App() {
  return (
    <>
      <Nav />
      <main className="main">
        <Hero />
        <DailyCheckin />
        <div className="today-wrap">
          <TodayCard />
        </div>
        <SwipeLearn />
        <QuickAnswers />
        <DupixentAd />
        <WatchNow />
      </main>
      <BottomNav />
    </>
  )
}
