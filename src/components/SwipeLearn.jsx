import React, { useState } from 'react'

export default function SwipeLearn({ onLearnClick }) {
  // phase: 'cards' | 'completing' | 'next' | 'completing2' | 'next2'
  const [phase, setPhase] = useState('next')
  const [showVideo, setShowVideo] = useState(false)
  const [videoWatched, setVideoWatched] = useState(false)
  const [showVideo2, setShowVideo2] = useState(false)
  const [video2Watched, setVideo2Watched] = useState(false)

  return (
    <>
      <section className="swipe-learn">
        <div className="swipe-learn__head">
          <h2 className="swipe-learn__title">The stress-heart connection, explained</h2>
          <p className="swipe-learn__sub">3 short lessons · Complete each to unlock the next</p>
          <a
            href="#"
            className="swipe-learn__link"
            onClick={e => { e.preventDefault(); onLearnClick && onLearnClick() }}
          >View full journey</a>
        </div>

        {phase === 'next2' ? (
          <div className="swipe-learn__wrap swipe-learn__wrap--next">
            <div className="swipe-learn__next-card swipe-learn__next-card--placeholder">
              <div className="swipe-learn__next-emoji">📊</div>
              <h2 className="swipe-learn__next-title">How lifestyle factors impact cardiometabolic risk</h2>
              <p className="swipe-learn__next-body">
                An expert explains how stress, diet, sleep, and activity interact to accelerate or reduce cardiovascular and metabolic risk — and what the evidence says about each.
              </p>
              <button className="swipe-learn__next-cta" onClick={() => setShowVideo2(true)}>
                {video2Watched ? 'Complete & next lesson →' : 'Start now →'}
              </button>
              <p className="swipe-learn__next-src">
                <span className="brand-pill">Health.com</span>
                <span>Ask an Expert Series</span>
              </p>
            </div>
          </div>
        ) : phase === 'completing2' ? (
          <div className="swipe-learn__wrap">
            <div className="swipe-learn__card" style={{ background: 'linear-gradient(150deg,#1a2e3a,#0d1c26)' }}>
              <div className="swipe-learn__complete-overlay">
                <div className="swipe-learn__complete-check">✓</div>
                <p className="swipe-learn__complete-label">Activity complete</p>
              </div>
            </div>
          </div>
        ) : phase === 'next' ? (
          <div className="swipe-learn__wrap swipe-learn__wrap--next">
            <div className="swipe-learn__next-card">
              <div className="swipe-learn__next-emoji">🫀</div>
              <h2 className="swipe-learn__next-title">3-minute breathing reset for blood pressure</h2>
              <p className="swipe-learn__next-body">
                Slow, controlled breathing activates the parasympathetic nervous system and measurably lowers blood pressure in minutes. Used in cardiac rehab programs.
              </p>
              <button className="swipe-learn__next-cta" onClick={() => {
                if (videoWatched) {
                  setPhase('completing2')
                  setTimeout(() => setPhase('next2'), 1800)
                } else {
                  setShowVideo(true)
                }
              }}>
                {videoWatched ? 'Complete & next lesson →' : 'Start now →'}
              </button>
              <p className="swipe-learn__next-src">
                <span className="brand-pill">Verywell Health</span>
                <span>Clinical evidence</span>
              </p>
            </div>
          </div>
        ) : phase === 'completing' ? (
          <div className="swipe-learn__wrap">
            <div className="vwm-completing-card">
              <div className="swipe-learn__complete-overlay">
                <div className="swipe-learn__complete-check">✓</div>
                <p className="swipe-learn__complete-label">Activity complete</p>
              </div>
            </div>
          </div>
        ) : (
          /* phase === 'cards' (default) — Verywell Mind single-image scroll */
          <>
            <div className="vwm-scroll-row">
              <div className="vwm-scroll-viewport">
                <div className="vwm-scroll-track">
                  <div
                    style={{ background: 'linear-gradient(135deg, #0E8C7F 0%, #4FC3B5 60%, #C2673A 100%)', height: '220px', borderRadius: '16px' }}
                  />
                </div>
              </div>
            </div>
            <div className="vwm-scroll-cta-wrap">
              <button
                type="button"
                className="vwm-scroll-cta"
                onClick={() => {
                  setPhase('completing')
                  setTimeout(() => setPhase('next'), 1800)
                }}
              >
                Keep learning →
              </button>
            </div>
          </>
        )}
      </section>

      {showVideo && (
        <div className="video-overlay" onClick={() => { setShowVideo(false); setVideoWatched(true) }}>
          <button className="video-overlay__close" onClick={() => { setShowVideo(false); setVideoWatched(true) }}>✕</button>
          <img
            className="video-overlay__img"
            src="/video-placeholder.png"
            alt="3-Minute Video Meditation"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      {showVideo2 && (
        <div className="video-overlay" onClick={() => { setShowVideo2(false); setVideo2Watched(true) }}>
          <button className="video-overlay__close" onClick={() => { setShowVideo2(false); setVideo2Watched(true) }}>✕</button>
          <img
            className="video-overlay__img"
            src="/video-placeholder-2.png"
            alt="Ask an Expert: Environmental & Lifestyle Factors"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
