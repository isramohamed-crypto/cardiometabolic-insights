import { CONTENT_POOL } from './habitContent.js'
import { getPillarHabitIds } from '../pages/onboarding/recommendedHabits.js'

// Snippets for the overlay that opens from an insight — short takeaways to
// swipe through instead of a link out to a full article.
//
// SOURCING. Every snippet is the opening claim of a CONTENT_POOL entry's
// `body`. Those bodies are Vitalist's own summaries of real, sourced pieces
// (see the notes in habitContent.js), so quoting from them here is quoting
// the app's own copy — not putting invented words under a publisher's name.
//
// The externally-supplied links in domain/insightContent.js are deliberately
// NOT turned into snippets: their publishers block automated reading, so
// there is no text of theirs to show. Snippeting them would mean writing the
// summary myself and attributing it to Verywell Health, Health or Martha
// Stewart, which isn't something to guess at. If someone pastes the real
// copy, it can be added the same way as anything else here.

// First sentence of a body — written as the claim, with the rest as support.
function openingClaim(text = '') {
  const match = text.match(/^[^.!?]+[.!?]/)
  return (match ? match[0] : text).trim()
}

// Five is enough to feel like a deck without becoming a reading list; most
// pillars have three or four pieces behind them anyway.
const MAX_SNIPPETS = 5

// Which content actually answers which insight, most relevant first.
//
// Keyed by the owned-habit key the insight is about, because the pillar
// alone is too blunt: the "eating" pillar covers fiber, hydration, meal prep
// and snacks, so a suggestion about swapping zucchini for pasta was pulling
// up a yogurt-and-cottage-cheese snack piece purely because both are food.
// The first entry here is what shows on the preview card, so it should be
// the one that reads as an answer to the suggestion.
//
// A key can also be suffixed "#done" or "#todo" where the two states point
// somewhere different. "A cool, dark room" is the clearest case: once it's
// marked done the suggestion moves on to wake time, so the reading should
// too — showing blackout curtains there recommends the thing they just said
// they already do.
//
// Ids refer to CONTENT_POOL entries in habitContent.js. Anything not listed
// falls back to the pillar's own reading.
const BY_HABIT = {
  'eating:more-veggies': ['ev-1', 'fb-1', 'ss-1'],
  'eating:cooking-at-home': ['pl-1', 'ev-1', 'ss-1'],
  'eating:meal-prepping': ['pl-1', 'ev-1'],
  'eating:drinking-water': ['ww-1', 'fb-1'],
  'eating:balanced-meals': ['ev-1', 'fb-1'],
  'eating:mindful-eating': ['ss-1', 'ev-1'],
  'moving:daily-walks': ['wa-2', 'wa-1', 'ob-1'],
  'moving:taking-stairs': ['ts-1', 'ob-1', 'wa-2'],
  'moving:stretching-yoga': ['ms-1', 'ob-1'],
  'moving:strength-training': ['ts-1', 'ms-1'],
  'moving:moving-at-work': ['cs-1', 'ob-1'],
  'moving:recreational-sports': ['ob-1', 'ts-1'],
  'sleep:cool-dark-room#done': ['wt-1', 'cd-1'],
  'sleep:cool-dark-room': ['cd-1', 'wt-1'],
  'sleep:sleep-environment#done': ['wt-1', 'cd-1'],
  'sleep:sleep-environment': ['cd-1', 'wt-1'],
  'sleep:limiting-screens': ['ns-1', 'wt-1'],
  'sleep:wind-down-routine': ['ns-1', 'wt-1'],
  'sleep:consistent-bedtime': ['wt-1', 'cd-1'],
  'sleep:enough-hours': ['wt-1', 'ns-1'],
  // Done → the suggestion is about giving it a fixed time, which is a
  // habit-formation point rather than an activity one; the breathing piece
  // is the closer fit there than "go outside".
  'stress:clears-your-head#done': ['fbr-1', 'ob-1'],
  'stress:clears-your-head': ['ob-1', 'fbr-1'],
  'stress:meditation-breathing': ['fbr-1', 'ob-1'],
  'stress:journaling': ['ej-1', 'fbr-1'],
  'stress:time-in-nature': ['ob-1', 'fbr-1'],
  'stress:taking-breaks': ['ob-1', 'fbr-1'],
  'stress:talking-it-out': ['tf-1', 'ej-1'],
  'social:time-with-friends': ['tf-1'],
  'social:staying-in-touch': ['tf-1'],
  'social:quality-time': ['tf-1'],
  'social:community-groups': ['tf-1'],
  'social:volunteering': ['tf-1'],
}

// Flat index of every pool item by id, so the curated lists above can be
// resolved without knowing which habit an item is filed under.
const BY_ID = {}
Object.values(CONTENT_POOL).forEach((items) => {
  items.forEach((item) => {
    if (!BY_ID[item.id]) BY_ID[item.id] = item
  })
})

// Everything readable for the pillar an insight is about, newest ordering
// left as the pool's own (curated) order rather than shuffled — a deck that
// reorders itself every open is hard to come back to.
export function buildSnippets(row, state) {
  if (!row) return []

  const seen = new Set()
  const snippets = []

  const push = (item) => {
    if (!item || seen.has(item.id) || snippets.length >= MAX_SNIPPETS) return
    const text = openingClaim(item.body)
    if (!text) return
    seen.add(item.id)
    snippets.push({
      id: item.id,
      text,
      brand: item.brand,
      sourceTitle: item.title,
      image: item.image,
      // The full item, so saving from a snippet stores the same object the
      // Read tab would — one saved article, not two half-copies of it.
      item,
    })
  }

  // Curated matches first, in their listed order — the first one is what the
  // preview card shows, so relevance matters more than variety here.
  const curated = BY_HABIT[`${row.key}#${state}`] || BY_HABIT[row.key] || []
  curated.forEach((id) => push(BY_ID[id]))

  // Then the rest of the pillar's reading, to fill out the deck.
  getPillarHabitIds(row.pillarId).forEach((habitId) => {
    ;(CONTENT_POOL[habitId] || []).forEach(push)
  })

  return snippets
}
