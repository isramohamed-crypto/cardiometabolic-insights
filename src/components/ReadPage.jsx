import React, { useState } from 'react'
import './ReadPage.css'

// ── Real article content keyed to habits ─────────────────────────────────
const HABIT_ARTICLES = {
  move: [
    {
      id: 'ew-walk-blood-sugar',
      source: 'EatingWell',
      sourceColor: '#2e7d32',
      eye: 'Movement & metabolism',
      hed: 'The Simple Nighttime Habit That May Balance Blood Sugar',
      dek: 'A short walk after dinner can blunt your post-meal glucose spike by up to 22% — no medication, no equipment.',
      readTime: '4 min read',
      bg: 'linear-gradient(155deg,#8a7565,#4a3b32)',
      icon: '🚶',
      match: true,
      url: 'https://www.eatingwell.com/the-simple-nighttime-habit-that-may-balance-blood-sugar',
    },
    {
      id: 'byrdie-workout-everyday',
      source: 'Byrdie',
      sourceColor: '#8a4a28',
      eye: 'Fitness',
      hed: 'Is It Bad to Work Out Every Day?',
      dek: 'The nuanced answer — and why consistency beats intensity for long-term health.',
      readTime: '3 min read',
      bg: 'linear-gradient(155deg,#7a8a70,#3a4a36)',
      icon: '🏃',
      match: true,
      url: 'https://www.byrdie.com/is-it-bad-to-work-out-every-day-1',
    },
  ],
  strong: [
    {
      id: 'vw-strength',
      source: 'Verywell Health',
      sourceColor: '#1b5e20',
      eye: 'Strength & longevity',
      hed: 'Research Shows a Certain Amount of Strength Training Every Week Can Help You Live Longer',
      dek: 'The evidence is clear: you don\'t need a gym. You need consistency and the right movements.',
      readTime: '5 min read',
      bg: 'linear-gradient(155deg,#5a6a5a,#3a4a3a)',
      icon: '💪',
      match: true,
      url: 'https://www.verywellhealth.com/strength-training-longevity',
    },
  ],
  sleep: [
    {
      id: 'vw-wake-time',
      source: 'Verywell Health',
      sourceColor: '#0d47a1',
      eye: 'Sleep science',
      hed: 'First Step to Better Sleep: Wake Up at the Same Time Every Day',
      dek: 'Sleep scientists agree: consistency of wake time matters more than total hours. Here\'s why.',
      readTime: '4 min read',
      bg: 'linear-gradient(155deg,#4a5a7a,#2a3048)',
      icon: '😴',
      match: true,
      url: 'https://www.verywellhealth.com/same-wake-time-better-sleep',
    },
    {
      id: 'spruce-bedroom',
      source: 'The Spruce',
      sourceColor: '#37474f',
      eye: 'Sleep environment',
      hed: '5 Things I Never Keep in My Bedroom for Better Sleep',
      dek: 'Including the one most people keep on their nightstand every night.',
      readTime: '3 min read',
      bg: 'linear-gradient(155deg,#5a6a7a,#2a3a4a)',
      icon: '🌙',
      match: true,
      url: 'https://www.thespruce.com/items-to-never-keep-in-a-bedroom-for-better-sleep-11692884',
    },
  ],
  stress: [
    {
      id: 'vwm-breathing',
      source: 'Verywell Mind',
      sourceColor: '#6a1b9a',
      eye: 'Stress & the nervous system',
      hed: 'The Benefits of Deep Breathing',
      dek: 'Five slow breaths activate your body\'s off switch. The science behind why it works so fast.',
      readTime: '4 min read',
      bg: 'linear-gradient(155deg,#7a6a8a,#4a3a5a)',
      icon: '🧘',
      match: true,
      url: 'https://www.verywellmind.com/the-benefits-of-deep-breathing',
    },
    {
      id: 'investopedia-stress',
      source: 'Investopedia',
      sourceColor: '#1b4a6a',
      eye: 'Stress & money',
      hed: 'Reduce Stress With These 2 Simple Money Habits Backed by Experts',
      dek: 'Financial stress and health are more connected than most people realize.',
      readTime: '4 min read',
      bg: 'linear-gradient(155deg,#4a5a7a,#2a3a4a)',
      icon: '💰',
      match: false,
      url: 'https://www.investopedia.com/reduce-stress-with-these-2-simple-money-habits-backed-by-experts-11794598',
    },
  ],
  connect: [
    {
      id: 'vwm-social',
      source: 'Verywell Mind',
      sourceColor: '#6a1b9a',
      eye: 'Connection & mental health',
      hed: 'How Social Isolation Can Damage Your Mental Health',
      dek: 'The evidence on loneliness as a health risk — and what actually helps.',
      readTime: '5 min read',
      bg: 'linear-gradient(155deg,#8a7a86,#443a44)',
      icon: '👥',
      match: true,
      url: 'https://www.verywellmind.com/social-isolation-mental-health',
    },
    {
      id: 'parents-traditions',
      source: 'Parents',
      sourceColor: '#c62828',
      eye: 'Family & belonging',
      hed: 'How To Create Your Own Family Traditions—And Why You Should',
      dek: 'Simple rituals build belonging. Here\'s how to design ones that actually stick.',
      readTime: '4 min read',
      bg: 'linear-gradient(155deg,#8a5a5a,#4a2a2a)',
      icon: '🏡',
      match: true,
      url: 'https://www.parents.com/family-traditions-to-enjoy-together-8627648',
    },
  ],
  eat: [
    {
      id: 'ew-breakfast',
      source: 'EatingWell',
      sourceColor: '#2e7d32',
      eye: 'Nutrition & glucose',
      hed: '5 Best Breakfast Foods for Better Blood Sugar',
      dek: 'What you eat first thing sets the tone for your glucose response all day.',
      readTime: '4 min read',
      bg: 'linear-gradient(155deg,#8a6a5a,#5a3a2a)',
      icon: '🥗',
      match: true,
      url: 'https://www.eatingwell.com/5-best-breakfast-foods-for-better-blood-sugar',
    },
    {
      id: 'bhg-meal-planning',
      source: 'Better Homes & Gardens',
      sourceColor: '#c62828',
      eye: 'Meal planning',
      hed: 'Healthy Meal Planning Ideas',
      dek: 'Simple frameworks for eating well without spending your Sunday cooking.',
      readTime: '5 min read',
      bg: 'linear-gradient(155deg,#7a5a4a,#4a3a2a)',
      icon: '🍽️',
      match: true,
      url: 'https://www.bhg.com/recipes/healthy/meal-planning-ideas/',
    },
  ],
  water: [
    {
      id: 'bhg-houseplants',
      source: 'Better Homes & Gardens',
      sourceColor: '#c62828',
      eye: 'Mood & environment',
      hed: 'How Houseplants Help Fight the Winter Blues',
      dek: 'Living greenery genuinely moves the needle on mood — the why is more interesting than you\'d think.',
      readTime: '3 min read',
      bg: 'linear-gradient(155deg,#5a7a8a,#2d4a5a)',
      icon: '🌿',
      match: false,
      url: 'https://www.bhg.com/how-houseplants-help-fight-the-winter-blues-11896460',
    },
  ],
}

// ── General editorial content ─────────────────────────────────────────────
const GENERAL_ARTICLES = [
  {
    id: 'vwm-gratitude',
    source: 'Verywell Mind',
    sourceColor: '#6a1b9a',
    eye: 'Mental wellbeing',
    hed: 'Want to Relieve Stress ASAP? Write in a Gratitude Journal',
    dek: 'One specific thing that went well today — that\'s the whole practice. The science behind why it works.',
    readTime: '3 min read',
    bg: 'linear-gradient(155deg,#7a6a8a,#4a3a5a)',
    icon: '📓',
    url: 'https://www.verywellmind.com/how-to-keep-a-gratitude-journal-4771938',
  },
  {
    id: 'bhg-sleep-lighting',
    source: 'Better Homes & Gardens',
    sourceColor: '#c62828',
    eye: 'Sleep environment',
    hed: 'Relaxing Bedroom Lighting Ideas for Better Rest',
    dek: 'The light in your bedroom after 9pm matters more than you think. Here\'s what to change tonight.',
    readTime: '4 min read',
    bg: 'linear-gradient(155deg,#6d7b6a,#3a4436)',
    icon: '💡',
    url: 'https://www.bhg.com/relaxing-bedroom-lighting-11916744',
  },
  {
    id: 'spruce-layout-sleep',
    source: 'The Spruce',
    sourceColor: '#37474f',
    eye: 'Sleep & environment',
    hed: 'Does Bedroom Layout Actually Affect Sleep Quality?',
    dek: 'Research says yes — and some of the fixes are simpler than you\'d expect.',
    readTime: '4 min read',
    bg: 'linear-gradient(155deg,#5a6a7a,#2a3a4a)',
    icon: '🛏️',
    url: 'https://www.thespruce.com/does-bedroom-layout-affect-sleep-quality-11938739',
  },
  {
    id: 'investopedia-budget',
    source: 'Investopedia',
    sourceColor: '#1b4a6a',
    eye: 'Financial wellbeing',
    hed: 'How to Build a Monthly Budget That Actually Fits Your Life',
    dek: 'Financial stress is a health issue. This framework makes it manageable.',
    readTime: '6 min read',
    bg: 'linear-gradient(155deg,#4a5a7a,#2a3048)',
    icon: '📊',
    url: 'https://www.investopedia.com/how-to-build-a-monthly-budget-that-actually-fits-your-life-11826802',
  },
  {
    id: 'parents-sleep-kids',
    source: 'Parents',
    sourceColor: '#c62828',
    eye: 'Family health',
    hed: 'Sleep-Deprived Kids and Parents Aren\'t Just Cranky — Their Mental Health Is Suffering',
    dek: 'The whole family\'s rest is connected. What the research says, and what actually helps.',
    readTime: '5 min read',
    bg: 'linear-gradient(155deg,#7a5a6a,#4a2a3a)',
    icon: '👨‍👩‍👧',
    url: 'https://www.parents.com/sleep-deprived-kids-and-parents-aren-t-just-cranky-their-mental-health-is-suffering-11696629',
  },
  {
    id: 'sl-grocery',
    source: 'Southern Living',
    sourceColor: '#8a4a28',
    eye: 'Food & kitchen',
    hed: 'The Grocery Shopping Mistake That Makes Food Go Bad Faster',
    dek: 'One ordering habit that wastes money and kills produce before you can eat it.',
    readTime: '3 min read',
    bg: 'linear-gradient(155deg,#8a6a5a,#5a3a2a)',
    icon: '🛒',
    url: 'https://www.southernliving.com/grocery-shopping-mistake-that-makes-food-go-bad-faster-12007996',
  },
]

// ── Podcasts ──────────────────────────────────────────────────────────────
const PODCASTS = [
  {
    id: 'huberman',
    name: 'Huberman Lab',
    host: 'Andrew Huberman',
    tag: 'Science-backed health',
    desc: 'Neuroscience tools for your daily habits — sleep, movement, stress, and focus.',
    icon: '🧠',
    bg: 'linear-gradient(135deg,#1b2a4a,#2a4a7a)',
    suggestedFor: 'Great for your walk tonight',
    url: 'https://www.hubermanlab.com/podcast',
  },
  {
    id: 'feel-better',
    name: 'Feel Better, Live More',
    host: 'Dr Rangan Chatterjee',
    tag: 'Lifestyle medicine',
    desc: 'The small changes that make the biggest difference — from a GP who lives this way himself.',
    icon: '💚',
    bg: 'linear-gradient(135deg,#2f7d5e,#1b4a36)',
    suggestedFor: 'Perfect walking pace to listen',
    url: 'https://drchatterjee.com/podcast/',
  },
  {
    id: 'ten-percent',
    name: 'Ten Percent Happier',
    host: 'Dan Harris',
    tag: 'Stress & mindfulness',
    desc: 'Practical meditation and stress tools — skeptic-friendly, no woo.',
    icon: '🧘',
    bg: 'linear-gradient(135deg,#7a6a8a,#4a3a5a)',
    suggestedFor: 'For your breathing practice',
    url: 'https://www.tenpercent.com/podcast',
  },
  {
    id: 'drive',
    name: 'The Drive',
    host: 'Peter Attia, MD',
    tag: 'Longevity science',
    desc: 'Deep dives on exercise, sleep, nutrition, and what actually predicts a long healthspan.',
    icon: '⚗️',
    bg: 'linear-gradient(135deg,#4a3b32,#8a7565)',
    suggestedFor: 'Longer walks',
    url: 'https://peterattiamd.com/podcast/',
  },
]

function readActiveHabits() {
  try { return JSON.parse(localStorage.getItem('vitalistExp_habits') || '[]') } catch { return [] }
}

function getMatchedArticles(habits) {
  const matched = []
  const seen = new Set()
  habits.forEach(h => {
    const goalId = h.goalId || h.id?.split('_')[0] || ''
    ;(HABIT_ARTICLES[goalId] || []).forEach(a => {
      if (!seen.has(a.id) && a.match) { seen.add(a.id); matched.push({ ...a, forHabit: h.label }) }
    })
  })
  return matched
}

function openURL(url) {
  if (url) window.open(url, '_blank', 'noopener')
}

// ── Article detail ────────────────────────────────────────────────────────
function ArticleDetail({ article, onClose }) {
  return (
    <div className="rd-detail">
      <div className="rd-detail__header" style={{ background: article.bg }}>
        <button className="rd-detail__back" onClick={onClose}>‹ Read</button>
        <div className="rd-detail__header-body">
          <p className="rd-detail__flag">{article.source}</p>
          <h1 className="rd-detail__hed">{article.hed}</h1>
          <p className="rd-detail__meta">{article.readTime}</p>
        </div>
      </div>
      <div className="rd-detail__body">
        <p className="rd-detail__p" style={{ fontWeight: 700, color: '#15151d' }}>{article.dek}</p>
        <p className="rd-detail__p">
          The research on this is more consistent than most people realize. When you anchor a small action to an existing moment in your day — dinner, coffee, brushing your teeth — you reduce the decision burden to nearly zero.
        </p>
        <p className="rd-detail__p">
          Behavior scientists call this habit stacking. The existing routine acts as a cue; the new action attaches to it. After enough repetitions, the sequence runs without conscious thought.
        </p>
        <p className="rd-detail__p">
          The key insight: action size doesn't matter at first. Three minutes isn't a workout — it's a proof of concept. Every time you do it, you're casting a vote for the identity you're building.
        </p>
        <p className="rd-detail__p">
          What makes this sustainable is that it never asks you to be exceptional. It asks you to be consistent. Exceptional is the result; consistent is the practice.
        </p>
        {article.url && (
          <button className="rd-detail__read-full" onClick={() => openURL(article.url)}>
            Read full article on {article.source} ↗
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────
export default function ReadPage() {
  const [openArticle, setOpenArticle] = useState(null)
  const habits = readActiveHabits()
  const matchedArticles = getMatchedArticles(habits)
  const feature = matchedArticles[0] || GENERAL_ARTICLES[0]
  const secondaryMatched = matchedArticles.slice(1, 4)
  const primaryGoalId = habits[0]?.goalId || ''

  if (openArticle) {
    return <ArticleDetail article={openArticle} onClose={() => setOpenArticle(null)} />
  }

  return (
    <div className="rp-root">
      <div className="rp-header">
        <p className="rp-header__eye">Vitalist</p>
        <h1 className="rp-header__title">Read</h1>
      </div>

      {/* Feature — habit-matched */}
      {feature && (
        <>
          <p className="rp-section-label">
            {matchedArticles.length > 0 ? 'For your habit' : 'This week'}
          </p>
          <div className="rp-feature" onClick={() => setOpenArticle(feature)}>
            <div className="rp-feature__img" style={{ background: feature.bg }}>
              <span style={{ fontSize: 52 }}>{feature.icon}</span>
              <span className="rp-feature__flag">{feature.source}</span>
              {feature.match && <span className="rp-feature__match">✓ Your habit</span>}
            </div>
            <div className="rp-feature__body">
              <p className="rp-feature__eye">{feature.eye}</p>
              <h2 className="rp-feature__hed">{feature.hed}</h2>
              <p className="rp-feature__dek">{feature.dek}</p>
              <div className="rp-feature__meta">
                <span>{feature.readTime}</span>
                <span className="dot" />
                <span>{feature.source}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Podcast — "Listen while you walk" */}
      <p className="rp-section-label">
        {primaryGoalId === 'move' ? 'Listen while you walk' :
         primaryGoalId === 'stress' ? 'Listen during your practice' :
         'Podcasts worth your time'}
      </p>
      <div className="rp-row">
        {PODCASTS.map(p => (
          <div key={p.id} className="rp-podcast-card" onClick={() => openURL(p.url)}>
            <div className="rp-podcast-card__img" style={{ background: p.bg }}>
              <span style={{ fontSize: 32 }}>{p.icon}</span>
              <span className="rp-podcast-card__suggested">{p.suggestedFor}</span>
            </div>
            <div className="rp-podcast-card__body">
              <p className="rp-podcast-card__tag">{p.tag}</p>
              <h3 className="rp-podcast-card__name">{p.name}</h3>
              <p className="rp-podcast-card__host">{p.host}</p>
            </div>
          </div>
        ))}
      </div>

      {/* More for your habit */}
      {secondaryMatched.length > 0 && (
        <>
          <p className="rp-section-label">More for your habits</p>
          <div className="rp-row">
            {secondaryMatched.map(a => (
              <div key={a.id} className="rp-card" onClick={() => setOpenArticle(a)}>
                <div className="rp-card__img" style={{ background: a.bg }}>
                  <span>{a.icon}</span>
                  <span className="rp-card__flag">{a.source}</span>
                </div>
                <div className="rp-card__body">
                  <p className="rp-card__eye">{a.eye}</p>
                  <h3 className="rp-card__hed">{a.hed}</h3>
                  <p className="rp-card__meta">{a.readTime}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* General wellness horizontal */}
      <p className="rp-section-label">Wellness & lifestyle</p>
      <div className="rp-row" style={{ marginBottom: 8 }}>
        {GENERAL_ARTICLES.slice(0, 4).map(a => (
          <div key={a.id} className="rp-card" onClick={() => setOpenArticle(a)}>
            <div className="rp-card__img" style={{ background: a.bg }}>
              <span>{a.icon}</span>
              <span className="rp-card__flag">{a.source}</span>
            </div>
            <div className="rp-card__body">
              <p className="rp-card__eye">{a.eye}</p>
              <h3 className="rp-card__hed">{a.hed}</h3>
              <p className="rp-card__meta">{a.readTime}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Long reads list */}
      <p className="rp-section-label">Long reads</p>
      <div className="rp-list">
        {GENERAL_ARTICLES.slice(2).map(a => (
          <div key={a.id} className="rp-list-item" onClick={() => setOpenArticle(a)}>
            <div className="rp-list-item__thumb" style={{ background: a.bg }}>
              {a.icon}
            </div>
            <div className="rp-list-item__body">
              <p className="rp-list-item__eye">{a.source} · {a.eye}</p>
              <h3 className="rp-list-item__hed">{a.hed}</h3>
              <p className="rp-list-item__meta">{a.readTime}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
