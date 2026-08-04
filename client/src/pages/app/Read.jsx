import { useEffect, useState } from 'react'
import ContentCard from '../../components/ContentCard.jsx'
import { useFavorites } from '../../content/FavoritesContext.jsx'
import './page.css'

// Same fallback gradient used for habits without a specific photo — Read's
// articles aren't tied to one habit/pillar, so there's no single gradient
// to borrow the way RoutineHabitCard does.
const FALLBACK_THUMB = 'linear-gradient(160deg, #00B9E2 0%, #063a52 100%)'

function Read() {
  const [articles, setArticles] = useState([])
  const { favorites } = useFavorites()

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then(setArticles)
      .catch(() => setArticles([]))
  }, [])

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
              />
            ))}
          </div>
        </section>
      )}

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
    </div>
  )
}

export default Read
