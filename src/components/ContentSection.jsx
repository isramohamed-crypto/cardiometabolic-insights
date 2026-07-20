import React, { useMemo } from 'react'
import './ContentSection.css'
import { HABIT_CONTENT as CONTENT } from '../data/habitContent'

// ── Source logo abbreviation ───────────────────────────────────────────────────
const TYPE_ICONS = { article: '📄', recipe: '🍽️', video: '▶' }

function readHabitIds() {
  try { return JSON.parse(localStorage.getItem('vitalistMyRituals2') || '[]') } catch { return [] }
}
function readConditions() {
  try {
    const p = JSON.parse(localStorage.getItem('cardiometabolicProfile') || '{}')
    return Array.isArray(p.condition) ? p.condition : []
  } catch { return [] }
}

function scoreContent(item, habitIds, conditions) {
  if (item.alwaysShow) return 1
  const habitMatch = item.habitIds.some(id => habitIds.includes(id))
  const condMatch  = item.conditions.some(c => conditions.includes(c))
  return (habitMatch ? 2 : 0) + (condMatch ? 1 : 0)
}

function ContentCard({ item }) {
  const isVideo  = item.type === 'video'
  const isRecipe = item.type === 'recipe'

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className={`cs-card cs-card--${item.type}`}
    >
      <div className="cs-card__thumb">
        <img src={item.image} alt="" className="cs-card__img" />
        {isVideo && (
          <div className="cs-card__play-wrap">
            <div className="cs-card__play">▶</div>
          </div>
        )}
        <span className="cs-card__type-tag" style={{ background: item.sourceColor }}>{item.tag}</span>
      </div>
      <div className="cs-card__body">
        <span className="cs-card__source" style={{ color: item.sourceColor }}>{item.source}</span>
        <p className="cs-card__title">{item.title}</p>
      </div>
    </a>
  )
}

export default function ContentSection() {
  const habitIds  = useMemo(() => readHabitIds(), [])
  const conditions = useMemo(() => readConditions(), [])

  const ranked = useMemo(() => {
    const scored = CONTENT.map(item => ({ item, score: scoreContent(item, habitIds, conditions) }))
    scored.sort((a, b) => b.score - a.score)
    // Deduplicate by type — keep variety: max 3 recipes, rest articles/videos
    const seen = new Set()
    const result = []
    const recipeCap = { recipe: 0 }
    for (const { item } of scored) {
      if (seen.has(item.id)) continue
      if (item.type === 'recipe' && recipeCap.recipe >= 2) continue
      seen.add(item.id)
      if (item.type === 'recipe') recipeCap.recipe++
      result.push(item)
      if (result.length >= 8) break
    }
    return result
  }, [habitIds, conditions])

  return (
    <section className="cs-section">
      <div className="cs-header">
        <div>
          <p className="cs-eyebrow">For you</p>
          <h2 className="cs-title">Based on your habits</h2>
        </div>
      </div>

      <div className="cs-scroll">
        {ranked.map(item => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
