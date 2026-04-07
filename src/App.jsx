import React from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import StatusStrip from './components/StatusStrip'
import TodayCard from './components/TodayCard'
import InsightCard from './components/InsightCard'
import CareTeamCard from './components/CareTeamCard'
import ProgressCard from './components/ProgressCard'
import ProgramCard from './components/ProgramCard'
import QuickAnswers from './components/QuickAnswers'
import WatchNow from './components/WatchNow'
import BottomNav from './components/BottomNav'

export default function App() {
  return (
    <>
      <Nav />
      <main className="main">
        <Hero />
        <div className="today-wrap">
          <TodayCard />
        </div>
        <QuickAnswers />
        <section className="grid">
          <InsightCard />
          <ProgramCard />
        </section>
        <WatchNow />
      </main>
      <BottomNav />
    </>
  )
}
