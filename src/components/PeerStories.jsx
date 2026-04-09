import React from 'react'

const STORIES = [
  {
    initial: 'B',
    name: 'Bea',
    info: 'Diagnosed age 12 \u00b7 Stress & sweat triggers',
    context: 'Bea\u2019s eczema is triggered by stress and sweat \u2014 but she didn\u2019t want to give up exercise. She found low-impact workouts that let her stay active without the flare.',
    quote: 'I do low-impact activities like Pilates to avoid triggering sweat while also getting the benefits. If I do sweat, I shower right away.',
    src: 'Verywell Mind',
    cardBg: 'linear-gradient(135deg,#e8f7f8,#ffffff)',
    accentColor: '#0D7C8F',
    avatarBg: 'linear-gradient(135deg,#0D7C8F,#7BA68D)',
  },
  {
    initial: 'C',
    name: 'Chinenyem',
    info: 'Diagnosed in childhood \u00b7 Stress & diet triggers',
    context: 'Eczema left dark marks on Chinenyem\u2019s neck, arms, and face \u2014 and seriously impacted her self-esteem. She turned her skincare routine into a mindfulness ritual.',
    quote: 'I take my time, focusing on the texture, scent, and sensation of each product. As I apply them, I speak affirmations over my body and mind.',
    src: 'Verywell Mind',
    cardBg: 'linear-gradient(135deg,#ede8fd,#ffffff)',
    accentColor: '#5D2DE6',
    avatarBg: 'linear-gradient(135deg,#5D2DE6,#E8866A)',
  },
  {
    initial: 'M',
    name: 'Mandi',
    info: 'Lifelong AD \u00b7 Heat & dairy triggers',
    context: 'During her three pregnancies, Mandi started getting flares in new places \u2014 hands, neck, face. Summers were her hardest months. She learned that triggers can change over time.',
    quote: 'What works for one may not work for all, but finding a routine that provides relief and comfort is important for those dealing with this persistent condition.',
    src: 'Verywell Mind',
    cardBg: 'linear-gradient(135deg,#fde8e3,#ffffff)',
    accentColor: '#E8866A',
    avatarBg: 'linear-gradient(135deg,#E8866A,#D4A853)',
  },
  {
    initial: 'L',
    name: 'Laney',
    info: 'Diagnosed as a baby \u00b7 Temperature & clothing triggers',
    context: 'Laney has lived with AD since infancy. She takes two biologics, and she\u2019s never far from a bottle of moisturizer. But the self-care act she values most isn\u2019t a product.',
    quote: 'One of the most important self-care acts is giving myself grace. I can\u2019t control my skin, and I can\u2019t let it control me.',
    src: 'Verywell Mind',
    cardBg: 'linear-gradient(135deg,#fdf4e0,#ffffff)',
    accentColor: '#D4A853',
    avatarBg: 'linear-gradient(135deg,#D4A853,#C47058)',
  },
  {
    initial: 'M',
    name: 'Michael',
    info: 'Adult-onset AD \u00b7 20 years \u00b7 Stress & dirt triggers',
    context: 'Michael works in construction \u2014 exposed to dust and dirt daily, one of his main triggers. Steroid creams alone weren\u2019t enough, so he and his wife took a holistic approach.',
    quote: 'My wife is a functional dietitian specializing in skin health. She has used all her skills to truly keep my skin in check.',
    src: 'Verywell Mind',
    cardBg: 'linear-gradient(135deg,#e8f2ec,#ffffff)',
    accentColor: '#7BA68D',
    avatarBg: 'linear-gradient(135deg,#7BA68D,#0D7C8F)',
  },
]

export default function PeerStories() {
  return (
    <section className="peer-section">
      <div className="peer-section__head">
        <h2 className="peer-section__heading">Peer stories</h2>
      </div>

      <div className="peer-carousel">
        {STORIES.map((s, i) => (
          <div key={i} className="peer-card" style={{ border: `2px solid ${s.accentColor}26` }}>
            {/* Avatar icon at top — mirrors fyn-card__icon */}
            <div className="peer-card__avatar" style={{ background: s.avatarBg }}>{s.initial}</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <p className="peer-card__label" style={{ color: s.accentColor }}>Peer story</p>
              <p className="peer-card__context">{s.context}</p>
              <blockquote className="peer-card__quote">&ldquo;{s.quote}&rdquo;</blockquote>

              <div className="peer-card__who">
                <div>
                  <div className="peer-card__name">{s.name}</div>
                  <div className="peer-card__info">{s.info}</div>
                </div>
              </div>

              <div className="peer-card__src">
                <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {s.src}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
