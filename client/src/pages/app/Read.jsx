import { useEffect, useState } from 'react'
import './page.css'

function Read() {
  const [articles, setArticles] = useState([])

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then(setArticles)
      .catch(() => setArticles([]))
  }, [])

  return (
    <div className="page">
      <p className="page__lead">Longevity and wellness reading from People Inc.</p>

      <ul className="page__list">
        {articles.map((article) => (
          <li key={article.id}>
            <p className="page__list-title">{article.title}</p>
            <p className="page__list-meta">{article.source}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Read
