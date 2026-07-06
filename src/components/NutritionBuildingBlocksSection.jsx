import React from 'react'
import './NutritionBuildingBlocksSection.css'

const BLOCKS = [
  {
    id: 'protein',
    image: '/images/ew2/protein.jpg',
    heading: 'Pack In Protein',
    body: 'Protein can help prevent blood sugar spikes by promoting slower digestion while your body builds muscle to offset tissue loss. Opt for lower-fat cooking.',
  },
  {
    id: 'fiber',
    image: '/images/ew2/fiber.jpg',
    heading: 'Lead With Fiber',
    body: 'Fiber can make you feel full to aid in maintaining a healthy weight. Swap refined grains to whole options, and add veggies to help promote heart health.',
  },
  {
    id: 'vitamins',
    image: '/images/ew2/vitamins.jpg',
    heading: 'Sneak In Vitamins',
    body: 'Hitting the recommended daily values can help mitigate hormone shifts and bone density changes. Grab leafy greens, seeds, and fatty fish.',
  },
]

export default function NutritionBuildingBlocksSection() {
  return (
    <section className="nbb-section">
      <div className="nbb-title-row">
        <img src="/images/ew2/logo-color.svg" alt="EatingWell" className="nbb-title-row__logo" />
        <span className="nbb-title-row__divider" />
        <span className="nbb-title-row__title">Nutrition Building Blocks</span>
      </div>

      <div className="nbb-scroll">
        {/* Intro card */}
        <div className="nbb-intro">
          <div className="nbb-intro__photo-wrap">
            <img src="/images/ew2/intro.jpg" alt="" className="nbb-intro__photo" />
          </div>
          <div className="nbb-intro__panel">
            <img src="/images/ew2/logo-color.svg" alt="EatingWell" className="nbb-intro__logo" />
            <h3 className="nbb-intro__headline">Healthy Habits To<br />Build Up Your Diet</h3>
            <p className="nbb-intro__sub">Creating a nutrition routine doesn&rsquo;t have to be complicated</p>
          </div>
        </div>

        {/* Building block cards */}
        {BLOCKS.map(block => (
          <div key={block.id} className="nbb-card">
            <div className="nbb-card__photo-wrap">
              <img src={block.image} alt="" className="nbb-card__photo" />
            </div>
            <div className="nbb-card__panel">
              <h3 className="nbb-card__heading">{block.heading}</h3>
              <p className="nbb-card__body">{block.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
