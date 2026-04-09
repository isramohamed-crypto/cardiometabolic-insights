import React, { useState } from 'react'

/* ─── Video data ─────────────────────────────────────────────────────────── */
const VIDEOS = [
  {
    id: 1,
    tag: 'Expert Explainer',
    title: 'How the Immune System Drives Eczema \u2014 and What\u2019s Being Done About It',
    src: 'Dr. Sarah Kim \u00b7 Verywell Health',
    dur: '4:32',
    bg: 'linear-gradient(150deg,rgba(58,30,90,0.85),rgba(93,45,230,0.6))',
  },
  {
    id: 2,
    tag: 'Science Explained',
    title: 'What Is OX40L? A Simple Explanation',
    src: 'Verywell Health \u00b7 Sanofi',
    dur: '3:18',
    bg: 'linear-gradient(150deg,rgba(6,74,85,0.85),rgba(13,124,143,0.6))',
  },
  {
    id: 3,
    tag: 'Patient Story',
    title: 'Marcus\u2019s Story: Why I Joined a Clinical Trial',
    src: 'Patient Story \u00b7 Sanofi',
    dur: '5:47',
    bg: 'linear-gradient(150deg,rgba(74,42,16,0.85),rgba(212,120,50,0.6))',
  },
  {
    id: 4,
    tag: 'Preparing for Your Visit',
    title: 'Preparing to Talk About Newer Treatments',
    src: 'Verywell Health \u00b7 Sanofi',
    dur: '2:55',
    bg: 'linear-gradient(150deg,rgba(20,48,36,0.85),rgba(60,130,90,0.6))',
  },
]

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function WatchNow() {
  const [activeVideo, setActiveVideo] = useState(null)

  return (
    <>
      {/* ── Understanding Your Eczema ───────────────────────────────────── */}
      <section className="watch-now watch-now--edu">
        <div className="watch-head">
          <div>
            <span className="watch-badge">Paid Content for Sanofi</span>
            <h2 className="watch-title">Understanding Your Eczema</h2>
            <p className="watch-subtitle">Videos and expert insights</p>
          </div>
        </div>

        <div className="edu-carousel">
          {VIDEOS.map(video => (
            <div
              key={video.id}
              className="edu-card"
              onClick={() => setActiveVideo(video)}
            >
              <div className="edu-card__bg" style={{ background: video.bg }}>
                <div className="edu-card__play">
                  <div className="edu-card__play-tri" />
                </div>
                <div className="edu-card__dur">{video.dur}</div>
                <div className="edu-card__meta">
                  <div className="edu-card__tag">{video.tag}</div>
                  <div className="edu-card__title">{video.title}</div>
                  <div className="edu-card__src">{video.src}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="edu-disclaimer">
          <strong>Sponsored content.</strong> Amlitelimab is an investigational medicine currently in clinical trials for atopic dermatitis. It has not been approved by any regulatory authority. Videos produced in partnership with Sanofi by Verywell Health.
        </div>
      </section>

      {/* ── Video overlay ─────────────────────────────────────────────── */}
      {activeVideo && (
        <div className="video-overlay" onClick={() => setActiveVideo(null)}>
          <button
            className="video-overlay__close"
            onClick={() => setActiveVideo(null)}
          >
            \u2715
          </button>
          <div
            className="edu-video-mock"
            style={{ background: activeVideo.bg }}
            onClick={e => e.stopPropagation()}
          >
            <div className="edu-video-mock__play">
              <div className="edu-card__play-tri" />
            </div>
            <div className="edu-video-mock__meta">
              <div className="edu-card__tag">{activeVideo.tag}</div>
              <div className="edu-video-mock__title">{activeVideo.title}</div>
              <div className="edu-card__src">{activeVideo.src}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Patient Stories (commented out) ─────────────────────────── */}
      {/*
      <section className="watch-now">
        <div className="watch-head">
          <div>
            <h2 className="watch-title">Patient stories</h2>
          </div>
          <a className="watch-saved" href="#">Saved</a>
        </div>
        <div className="chip-row"> ... </div>
        <div className="reel-carousel"> ... </div>
      </section>
      */}
    </>
  )
}
