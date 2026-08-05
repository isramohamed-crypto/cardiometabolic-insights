import { useEffect, useState } from 'react'
import ContentCard from '../../components/ContentCard.jsx'
import { useFavorites } from '../../content/FavoritesContext.jsx'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { CONTENT_POOL } from '../../domain/habitContent.js'
import { getHabitVisual } from '../onboarding/recommendedHabits.js'
import './page.css'

// Same fallback gradient used for habits without a specific photo — the
// flat "More reading" articles below aren't tied to one habit/pillar, so
// there's no single gradient to borrow the way a habit-grouped section can.
const FALLBACK_THUMB = 'linear-gradient(160deg, #00B9E2 0%, #063a52 100%)'

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
  // actually working on, rather than one long undifferentiated list.
  const habitGroups = habits
    .map((habit) => ({ habit, items: CONTENT_POOL[habit.id] }))
    .filter((group) => group.items && group.items.length > 0)

  return (
    <div className="page">
      <p className="page__lead">Longevity and wellness reading from People Inc.</p>

      {favorites.length > 0 && (
        <section>
          <h2>Favorites</h2>
          <div className="routine-habit-list">
            {favorites.map((item) => (
              <ContentCard
                key={item.id}
                id={item.id}
                thumbnail={item.thumbnail}
                brand={item.brand}
                title={item.title}
                body={item.body}
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
            <div className="routine-habit-list">
              {items.map((item) => (
                <ContentCard
                  key={item.id}
                  id={item.id}
                  thumbnail={gradient}
                  brand={item.brand}
                  title={item.title}
                  body={item.body}
                />
              ))}
            </div>
          </section>
        )
      })}

      {articles.length > 0 && (
        <section>
          <h2>More reading</h2>
          <div className="routine-habit-list">
            {articles.map((article) => (
              <ContentCard
                key={article.id}
                id={`article-${article.id}`}
                thumbnail={FALLBACK_THUMB}
                brand={article.source}
                title={article.title}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Read
