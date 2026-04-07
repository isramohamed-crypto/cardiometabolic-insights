import React from 'react'

export default function Hero() {
  return (
    <section className="hero">
      <p className="hero__eyebrow">Good morning, Diane</p>
      <h1 className="hero__headline">
        Before the prescription, <em>the person.</em>
      </h1>
      <p className="hero__sub">
        Lifestyle and clinical support designed to help you stay ahead — before medication becomes the answer.
      </p>
      <div className="hero__actions">
        <button className="btn btn--primary">View My Plan</button>
        <button className="btn btn--ghost">Learn More</button>
      </div>
      <div className="hero__tags">
        <span className="tag">Eczema Care</span>
        <span className="tag">Inflammation</span>
        <span className="tag">Skin Health</span>
      </div>
    </section>
  )
}
