import React, { useState, useEffect, useRef } from 'react'

const PHASES = [
  { name: 'Breathe in',  secs: 4 },
  { name: 'Hold',        secs: 4 },
  { name: 'Breathe out', secs: 6 },
]
const TOTAL = 180

function fmt(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec < 10 ? '0' : ''}${sec}`
}

export default function Breathe({ onClose }) {
  const [running, setRunning]     = useState(false)
  const [done, setDone]           = useState(false)
  const [timeLeft, setTimeLeft]   = useState(TOTAL)
  const [phaseIdx, setPhaseIdx]   = useState(0)
  const [phaseTick, setPhaseTick] = useState(0)

  const intervalRef = useRef(null)
  const stateRef    = useRef({ timeLeft: TOTAL, phaseIdx: 0, phaseTick: 0 })

  function start() {
    if (running) {
      clearInterval(intervalRef.current)
      setRunning(false)
      return
    }
    setRunning(true)
    intervalRef.current = setInterval(() => {
      const s = stateRef.current
      const nextTime = s.timeLeft - 1
      let nextPhaseTick = s.phaseTick + 1
      let nextPhaseIdx  = s.phaseIdx

      if (nextPhaseTick >= PHASES[s.phaseIdx].secs) {
        nextPhaseTick = 0
        nextPhaseIdx  = (s.phaseIdx + 1) % PHASES.length
      }

      stateRef.current = { timeLeft: nextTime, phaseIdx: nextPhaseIdx, phaseTick: nextPhaseTick }
      setTimeLeft(nextTime)
      setPhaseIdx(nextPhaseIdx)
      setPhaseTick(nextPhaseTick)

      if (nextTime <= 0) {
        clearInterval(intervalRef.current)
        setRunning(false)
        setDone(true)
      }
    }, 1000)
  }

  function reset() {
    clearInterval(intervalRef.current)
    setRunning(false)
    setDone(false)
    setTimeLeft(TOTAL)
    setPhaseIdx(0)
    setPhaseTick(0)
    stateRef.current = { timeLeft: TOTAL, phaseIdx: 0, phaseTick: 0 }
  }

  function handleClose() {
    clearInterval(intervalRef.current)
    onClose()
  }

  useEffect(() => {
    stateRef.current.timeLeft  = timeLeft
    stateRef.current.phaseIdx  = phaseIdx
    stateRef.current.phaseTick = phaseTick
  }, [timeLeft, phaseIdx, phaseTick])

  useEffect(() => () => clearInterval(intervalRef.current), [])

  const phase = PHASES[phaseIdx]
  const btnLabel = done ? null : running ? 'Pause' : timeLeft < TOTAL ? 'Resume' : 'Start breathing'

  return (
    <div className="breathe-overlay">
      <div className="breathe-overlay__header">
        <button className="breathe-overlay__close" onClick={handleClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <span className="breathe-overlay__label">Micro-challenge · 3 min</span>
        <div style={{ width: 36 }} />
      </div>

      <div className="breathe-overlay__body">
        <h2 className="breathe-overlay__title">3-minute breathing reset</h2>
        <p className="breathe-overlay__sub">
          Slow breathing measurably lowers cortisol. Your skin barrier starts recovering.
        </p>

        <div className={`breathe-orb${running ? ' run' : ''}`}>
          {done
            ? <div className="breathe-phase">Done ✨</div>
            : <>
                <div className="breathe-phase">{timeLeft === TOTAL ? 'Ready' : phase.name}</div>
                <div className="breathe-time">{fmt(timeLeft)}</div>
              </>
          }
        </div>

        {!done && <div className="breathe-inst">Inhale 4s · Hold 4s · Exhale 6s</div>}

        {!done && (
          <button className="breathe-btn" onClick={start}>{btnLabel}</button>
        )}

        {done && (
          <div className="breathe-fin">
            <p>✨ Beautiful. Your cortisol just dropped. Your skin barrier thanks you.</p>
            <button className="breathe-btn" onClick={reset}>Do it again</button>
          </div>
        )}
      </div>
    </div>
  )
}
