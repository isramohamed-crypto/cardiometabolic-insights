import React, { useState } from 'react'
import MarkAsTried from './MarkAsTried'

/* ─── Video data ─────────────────────────────────────────────────────────── */
const VIDEOS = [
  {
    id: 1,
    tag: 'Expert Explainer',
    title: 'How the Immune System Drives Eczema \u2014 and What\u2019s Being Done About It',
    src: 'Dr. Sarah Kim \u00b7 Verywell Health',
    dur: '4:32',
    thumb: '/video-thumb-1.jpg',
  },
  {
    id: 2,
    tag: 'Celebrity Health Story',
    title: 'After Years of Struggling with Severe Eczema, Abby Tai Has Found Healing Through Helping Others \u2018Conquer\u2019 Theirs',
    src: 'People',
    dur: '3:18',
    thumb: '/abby-tai-eczema.webp',
  },
  {
    id: 3,
    tag: 'Patient Story',
    title: 'Dermatologists Say This Is the Best Way to Treat Eczema on Your Face',
    src: 'Byrdie',
    dur: '5:47',
    thumb: '/ellefanning.webp',
  },
  {
    id: 4,
    tag: 'Preparing for Your Visit',
    title: 'Preparing to Talk About Newer Treatments',
    src: 'Verywell Health',
    dur: '2:55',
    thumb: '/video-thumb-4.jpg',
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
            <span className="watch-badge">Paid content for Brand</span>
            <h2 className="watch-title">Expert advice</h2>
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
              <div className="edu-card__bg" style={{ background: `linear-gradient(to top,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.2) 50%,transparent 100%), url(${video.thumb}) center/cover no-repeat` }}>
                <div className="edu-card__play">
                  <div className="edu-card__play-tri" />
                </div>
                <div className="edu-card__dur">{video.dur}</div>
                <div className="edu-card__save">
                  <MarkAsTried
                    id={`expert-advice:${video.id}`}
                    title={video.title}
                    source="Expert advice"
                    variant="save"
                    className="try-btn--overlay"
                  />
                </div>
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
          <strong>Sponsored content.</strong> Videos and content produced in partnership with Brand.
        </div>
      </section>

      {/* ── Video overlay ─────────────────────────────────────────────── */}
      {activeVideo && (
        <div className="video-overlay" onClick={() => setActiveVideo(null)}>
          <button
            className="video-overlay__close"
            onClick={() => setActiveVideo(null)}
          >
            ✕
          </button>
          <div
            className="edu-video-mock"
            style={{ background: `linear-gradient(to top,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.15) 50%,transparent 100%), url(${activeVideo.thumb}) center/cover no-repeat` }}
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
