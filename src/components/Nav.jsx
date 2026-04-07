import React, { useState } from 'react'

const links = ['Home', 'My Plan', 'Progress', 'Support']

export default function Nav() {
  const [active, setActive] = useState('Home')

  return (
    <header className="nav">
      <div className="nav__brand">
        <span className="nav__wordmark">Eczema360</span>
      </div>
      <nav className="nav__links">
        {links.map(link => (
          <a
            key={link}
            href="#"
            className={`nav__link${active === link ? ' nav__link--active' : ''}`}
            onClick={e => { e.preventDefault(); setActive(link) }}
          >
            {link}
          </a>
        ))}
      </nav>
      <button className="nav__avatar" aria-label="Profile">SP</button>
    </header>
  )
}
