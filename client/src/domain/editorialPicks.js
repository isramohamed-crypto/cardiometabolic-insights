import { listHabitContent, pickDailyContent } from './habitContent.js'

// The Today page's "Living healthy" feed, as an editorial package rather
// than a row of link cards: a text-only cover story, then one card per piece
// of content with a pull-quote and a "mark as tried" action.
//
// PULL-QUOTE SOURCING — read before adding entries.
// Every quote rendered on these cards comes from the content item's own
// `body` (Vitalist's own summary of the piece, see habitContent.js) and is
// attributed to the publication, not to a named person. Editor names,
// job titles and headshots are deliberately absent: the reference design
// for this component attributes each tip to a named editor, and we have no
// sourced quotes from real named editors for this content. Inventing
// "— JEN DAVISON, EDITORIAL DIRECTOR" style attributions would be putting
// words in a real person's mouth. If real editor quotes and headshots get
// supplied, add `quote`, `attribution` and `avatar` to an entry and they'll
// be used in place of the derived ones.

// The lead cover story. Unlike the rest of the feed this is a specific,
// sourced piece rather than something drawn from a habit's content pool —
// and it's the one entry with a real named quote, because Chrissy Metz said
// it on the record. Quotes are verbatim from her People interview
// (people.com/chrissy-metz-taking-glp1-12037287, 10 August 2026).
export const LEAD_STORY = {
  id: 'people-metz-glp1',
  brand: 'People',
  title: 'Chrissy Metz on why she finally said yes to a GLP-1',
  standfirst:
    'The actor spent years turning the idea down. What changed her mind was not the number on the scale — it was realising how much of her day food noise was taking up.',
  quote: 'It’s so nice not to be obsessing about what I’m going to have every minute.',
  attribution: 'Chrissy Metz, to People',
  url: 'https://people.com/chrissy-metz-taking-glp1-12037287',
  // Drop the portrait at client/public/chrissy-metz-glp1.jpg and this
  // resolves; until then the cover falls back to its gradient (see
  // EditorialCard.css's .editorial-cover background-color), so a missing
  // file reads as a designed cover rather than a broken image.
  image: "url('/chrissy-metz-glp1.jpg')",
}

// First sentence of the item's body, used as the card's pull-quote. Cards
// are read at a glance in a horizontal scroll, so a whole paragraph would
// never be read — and the first sentence of these summaries is written as
// the claim, with the rest as support.
function firstSentence(text = '') {
  const match = text.match(/^[^.!?]+[.!?]/)
  return (match ? match[0] : text).trim()
}

export function pullQuote(item) {
  return item.quote || firstSentence(item.body)
}

export function attributionFor(item) {
  return item.attribution || item.brand
}

// How many editorial cards follow the cover. Four keeps the row scrollable
// (and so keeps the next-card peek that tells you it scrolls) even for a
// first-time user with one habit.
const MIN_CARDS = 4

// Builds the feed: the cover story, then today's scripted pick for each
// active habit, then the rest of those habits' libraries as backfill.
// Deduped by content id, since two habits can share an article.
export function buildEditorialFeed(activeHabits = []) {
  const seen = new Set()
  const cards = []

  const push = (habit, item) => {
    if (!item || seen.has(item.id)) return
    seen.add(item.id)
    cards.push({ habit, item })
  }

  activeHabits.forEach((habit) => push(habit, pickDailyContent(habit.id, habit.startedAt)))
  activeHabits.forEach((habit) =>
    listHabitContent(habit.id).forEach((item) => push(habit, item)),
  )

  return {
    cover: LEAD_STORY,
    cards: cards.slice(0, Math.max(MIN_CARDS, activeHabits.length)),
  }
}
