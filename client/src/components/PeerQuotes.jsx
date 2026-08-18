import BrandLogo from './BrandLogo.jsx'
import { PEER_QUOTES } from '../domain/peerQuotes.js'
import './PeerQuotes.css'

// A swipeable row of short quotes from people further along, sitting under
// the daily check-in — the check-in asks how today is going, and this answers
// with "here's how it went for someone else", without a number in sight.
//
// Read the provenance and imagery notes in domain/peerQuotes.js before
// changing anything here: the quotes are illustrative personas, and the
// absence of faces is deliberate rather than a missing asset.
function PeerQuotes() {
  return (
    <section className="peer-quotes">
      <h2>People living it</h2>
      <p className="page__section-lead">In their words, not their charts.</p>

      <div className="peer-quotes__track">
        {PEER_QUOTES.map((peer) => (
          <article className="peer-quote" key={peer.id}>
            <span className="peer-quote__mark" aria-hidden="true">
              “
            </span>
            <p className="peer-quote__text">{peer.quote}</p>
            <p className="peer-quote__who">
              {peer.name}, {peer.age}
            </p>
            <span className="peer-quote__brand">
              <BrandLogo brand={peer.brand} />
            </span>
          </article>
        ))}
      </div>
    </section>
  )
}

export default PeerQuotes
