import React, { useState, useEffect, useRef } from 'react'
import { reels } from '../data/reels'

const CHIPS = ['For You', 'Heart Health', 'Nutrition', 'Movement', 'Stress', 'Medication']

function formatTime(progress, secs) {
  const elapsed = Math.round((progress / 100) * secs)
  const m = Math.floor(elapsed / 60)
  const s = elapsed % 60
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

export default function WatchNow() {
  const [activeChip, setActiveChip]     = useState('For You')
  const [openReel, setOpenReel]         = useState(null)
  const [playing, setPlaying]           = useState(false)
  const [progress, setProgress]         = useState(0)
  const [thumbVote, setThumbVote]       = useState(null) // 'up' | 'down' | null
  const [toastMsg, setToastMsg]         = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const timerRef = useRef(null)

  // ── Timer ──────────────────────────────────────────────────
  useEffect(() => {
    if (!playing || !openReel) return
    timerRef.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + 100 / (openReel.secs * 10)
        if (next >= 100) {
          clearInterval(timerRef.current)
          setPlaying(false)
          return 100
        }
        return next
      })
    }, 100)
    return () => clearInterval(timerRef.current)
  }, [playing, openReel])

  // ── Helpers ────────────────────────────────────────────────
  function showToast(msg) {
    setToastMsg(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2200)
  }

  function openModal(reel) {
    clearInterval(timerRef.current)
    setOpenReel(reel)
    setPlaying(false)
    setProgress(0)
    setThumbVote(null)
  }

  function closeModal() {
    clearInterval(timerRef.current)
    setPlaying(false)
    setOpenReel(null)
  }

  function togglePlay() {
    setPlaying(p => !p)
  }

  function seekTo(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    clearInterval(timerRef.current)
    setPlaying(false)
    setProgress(pct)
  }

  function handleThumb(vote) {
    if (thumbVote === vote) {
      setThumbVote(null)
    } else {
      setThumbVote(vote)
      showToast(vote === 'up' ? 'Got it — more like this' : 'Got it — we\'ll show less of this')
    }
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    <>
      <section className="watch-now">
        {/* Chip row */}
        <div className="chip-row">
          {CHIPS.map(chip => (
            <button
              key={chip}
              className={`chip${activeChip === chip ? ' chip--active' : ''}`}
              onClick={() => setActiveChip(chip)}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Section header */}
        <div className="watch-head">
          <div>
            <h2 className="watch-title">Watch <em>now</em></h2>
          </div>
          <a
            className="watch-saved"
            href="#"
            onClick={e => { e.preventDefault(); showToast('Opening saved reels…') }}
          >
            Saved
          </a>
        </div>

        {/* Carousel */}
        <div className="reel-carousel">
          {reels.map(reel => (
            <div key={reel.id} className="reel-card" onClick={() => openModal(reel)}>
              <div className="reel-bg" style={{ background: reel.bg }}>
                <div className="reel-badge">
                  <div className="reel-views">
                    <div className="reel-play-tri-sm" />
                    <span>{reel.views}</span>
                  </div>
                </div>
                <div className="reel-dur">{reel.dur}</div>
                <div className="reel-play-btn">
                  <div className="reel-play-tri" />
                </div>
                <div className="reel-meta">
                  <div className="reel-tag">{reel.tag}</div>
                  <div className="reel-title-card">{reel.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {openReel && (
        <div className="reel-modal open">
          <div className="reel-modal__video-area">
            <div className="reel-modal__bg" style={{ background: openReel.bg, width: '100%', height: '100%' }} />

            {/* Top bar */}
            <div className="reel-modal__top">
              <button className="reel-modal__close" onClick={closeModal}>
                <svg viewBox="0 0 24 24" fill="none" stroke="rgba(245,239,230,.85)" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
              <div className="reel-modal__title">{openReel.title}</div>
            </div>

            {/* Play / pause */}
            <div className="reel-modal__play" onClick={togglePlay}>
              {playing
                ? <div className="reel-pause-icon" style={{ display: 'flex' }}>
                    <div className="reel-pause-bar" /><div className="reel-pause-bar" />
                  </div>
                : <div className="reel-play-tri" />
              }
            </div>

            {/* Side actions */}
            <div className="reel-modal__actions">
              <button
                className={`reel-action-btn${thumbVote === 'up' ? ' active' : ''}`}
                onClick={() => handleThumb('up')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="rgba(245,239,230,.7)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                  <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                </svg>
                <span>More</span>
              </button>
              <button
                className={`reel-action-btn${thumbVote === 'down' ? ' active' : ''}`}
                onClick={() => handleThumb('down')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="rgba(245,239,230,.7)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/>
                  <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
                </svg>
                <span>Less</span>
              </button>
              <button className="reel-action-btn" onClick={() => showToast('Link copied')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="rgba(245,239,230,.7)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                <span>Share</span>
              </button>
              <button className="reel-action-btn" onClick={() => showToast('Saved to your reels')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="rgba(245,239,230,.7)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
                <span>Save</span>
              </button>
            </div>

            {/* Progress bar */}
            <div className="reel-modal__progress-wrap">
              <div className="reel-progress-bar" onClick={seekTo}>
                <div className="reel-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="reel-progress-times">
                <span>{formatTime(progress, openReel.secs)}</span>
                <span>{openReel.dur}</span>
              </div>
            </div>
          </div>

          {/* Caption */}
          <div className="reel-modal__caption">
            <p>{openReel.caption}</p>
          </div>

          {/* Related */}
          <div className="reel-modal__related">
            <div className="reel-related-head">
              <h3>Up next</h3>
              <span>{reels.length - 1} videos</span>
            </div>
            <div className="reel-related-row">
              {reels.filter(r => r.id !== openReel.id).map(r => (
                <div key={r.id} className="reel-related-wrap" onClick={() => openModal(r)}>
                  <div className="reel-related-thumb" style={{ background: r.bg }}>
                    <div className="reel-related-play"><div className="reel-play-tri-xs" /></div>
                    <div className="reel-related-dur">{r.dur}</div>
                  </div>
                  <div className="reel-related-label">{r.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className={`toast${toastVisible ? ' show' : ''}`}>{toastMsg}</div>
    </>
  )
}
