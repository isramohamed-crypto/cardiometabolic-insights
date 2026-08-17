import { useEffect, useMemo, useState } from 'react'
import ContentCard from '../../components/ContentCard.jsx'
import { useFavorites } from '../../content/FavoritesContext.jsx'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { CONTENT_POOL, COMPANION_CONTENT } from '../../domain/habitContent.js'
import { getHabitVisual } from '../onboarding/recommendedHabits.js'
import './page.css'

// Same fallback gradient used for habits without a specific photo — kept
// as a last resort for "More reading" articles that come back from
// /api/content without their own `image` (every current entry has one —
// see the generated abstract-*.svg thumbnails in content.js/main.py).
const FALLBACK_THUMB = 'linear-gradient(160deg, #00B9E2 0%, #063a52 100%)'

const OTHER_CONTENT_COUNT = 5

// Fisher-Yates on a copy — used below so "Other things you may find
// interesting" shows a fresh random pick each time it's recomputed,
// rather than always the same items in CONTENT_POOL's own array order.
function shuffle(items) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function Read() {
  const [articles, setArticles] = useState([])
  const { favorites } = useFavorites()
  const { habits } = useHabits()

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then(setArticles)
      .catch(() => setArticles([]))
  }, [])

  // Group by the user's own habits first — each habit's CONTENT_POOL
  // entries under its own heading — so reading feels tied to what they're
  // actually working on, rather than one long undifferentiated list. Also
  // folds in that habit's COMPANION_CONTENT piece (the "While you walk"
  // evergreen item HabitDetail shows) — anything shown in habit details
  // should be findable from here too, not just by opening that one habit.
  const habitGroups = habits
    .map((habit) => {
      const pool = CONTENT_POOL[habit.id] || []
      const companion = COMPANION_CONTENT[habit.id]
      const items = companion ? [...pool, companion.content] : pool
      return { habit, items }
    })
    .filter((group) => group.items.length > 0)

  // "Other things you may find interesting" — a discovery section separate
  // from the "For X" groups above: content pooled from habits the user
  // does NOT currently own, so this surfaces stuff outside what they're
  // already tracking rather than repeating it. Image-bearing items are
  // prioritized (per the ask), then the pick is randomized via Fisher-
  // Yates so it's a fresh 5 each time this recomputes, not always the
  // same items in CONTENT_POOL's own declaration order. Memoized on
  // `habits` so it doesn't reshuffle on unrelated re-renders (e.g.
  // favoriting an article).
  const otherContent = useMemo(() => {
    const ownedHabitIds = new Set(habits.map((habit) => habit.id))
    const allCandidates = Object.entries(CONTENT_POOL)
      .filter(([habitId]) => !ownedHabitIds.has(habitId))
      .flatMap(([, items]) => items)

    // A few CONTENT_POOL entries are intentionally cross-listed under more
    // than one habit (e.g. the same strength-training article appears for
    // both "two strength sessions" and "chair stands") — dedupe by title
    // here so a "find something new" section doesn't show the same
    // headline twice.
    const seenTitles = new Set()
    const candidates = allCandidates.filter((item) => {
      if (seenTitles.has(item.title)) return false
      seenTitles.add(item.title)
      return true
    })

    const withImage = shuffle(candidates.filter((item) => item.image))
    const withoutImage = shuffle(candidates.filter((item) => !item.image))

    return [...withImage, ...withoutImage].slice(0, OTHER_CONTENT_COUNT)
  }, [habits])

  return (
    <div className="page">
      <p className="page__lead">Longevity and wellness reading from People Inc.</p>

      {favorites.length > 0 && (
        <section>
          <h2>Saved</h2>
          <p className="page__section-lead">Everything you bookmarked, waiting for you.</p>
          <div className="routine-habit-list">
            {favorites.map((item) => (
              <ContentCard
                key={item.id}
                id={item.id}
                thumbnail={item.thumbnail}
                brand={item.brand}
                title={item.title}
                body={item.body}
                fullBody={item.fullBody}
                url={item.url}
              />
            ))}
          </div>
        </section>
      )}

      {habitGroups.map(({ habit, items }) => {
        const gradient = getHabitVisual(habit.pillarId, habit.id) || FALLBACK_THUMB
        return (
          <section key={habit.id}>
            <h2>For "{habit.title}"</h2>
            <p className="page__section-lead">
              Reading tied to this one, including what shows up on its own page.
            </p>
            <div className="routine-habit-list">
              {items.map((item) => (
                <ContentCard
                  key={item.id}
                  id={item.id}
                  // Prefer the item's own real photo (currently only the
                  // walk-after-meal companion podcast has one) over the
                  // habit's flat gradient — same `item.image || gradient`
                  // precedence Routine.jsx already uses for its daily pick.
                  thumbnail={item.image || gradient}
                  brand={item.brand}
                  title={item.title}
                  body={item.body}
                  fullBody={item.fullBody}
                  url={item.url}
                />
              ))}
            </div>
          </section>
        )
      })}

      {otherContent.length > 0 && (
        <section>
          <h2>Other things you may find interesting</h2>
          <p className="page__section-lead">
            Outside what you're tracking — in case something catches you.
          </p>
          <div className="routine-habit-list">
            {otherContent.map((item) => (
              <ContentCard
                key={item.id}
                id={item.id}
                thumbnail={item.image || FALLBACK_THUMB}
                brand={item.brand}
                title={item.title}
                body={item.body}
                fullBody={item.fullBody}
                url={item.url}
              />
            ))}
          </div>
        </section>
      )}

      {articles.length > 0 && (
        <section>
          <h2>More reading</h2>
          <p className="page__section-lead">Fresh from the People Inc. newsrooms.</p>
          <div className="routine-habit-list">
            {articles.map((article) => (
              <ContentCard
                key={article.id}
                id={`article-${article.id}`}
                thumbnail={article.image ? `url('${article.image}')` : FALLBACK_THUMB}
                brand={article.source}
                title={article.title}
                url={article.url}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Read
