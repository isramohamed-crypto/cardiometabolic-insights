// Insight copy for the Today page's "Habits I own" card — a small,
// do-it-now suggestion built off a habit the person already owns, and
// which of them they've ticked today.
//
// Two states per habit:
//   done — they've ticked it, so the suggestion is a level-up on something
//          already working ("you already eat vegetables → try this swap").
//   todo — not ticked yet, so it's the easiest possible way to do the thing
//          they already do, today. Never framed as a miss or a nudge about
//          falling behind: this section exists to affirm, and an unticked
//          row is neutral everywhere else in it.
//
// Deliberately behavioral rather than clinical. These are phrased as small
// practical swaps, not health claims — nothing here should assert an
// outcome ("lowers your blood sugar", "adds years") that the prototype
// can't stand behind. Keep new entries in that register, and route anything
// that needs a real medical claim through the sourced, medically-reviewed
// content in domain/habitContent.js instead.
//
// Keyed `${pillarId}:${optionId}` to match domain/foundationHabits.js.
// Not every intake option has bespoke copy — PILLAR_FALLBACK below covers
// the rest, so any answer set produces something.
const INSIGHTS = {
  'eating:more-veggies': {
    done: {
      lead: 'You already eat vegetables every day.',
      suggestion:
        'Try ribboned zucchini in place of half the pasta tonight — same bowl, same meal, more of what you already like.',
    },
    todo: {
      lead: 'Vegetables are already your thing.',
      suggestion: 'Easiest version today: a handful of spinach into whatever is already cooking.',
    },
  },
  'eating:cooking-at-home': {
    done: {
      lead: 'You cooked at home today.',
      suggestion:
        'Cook once, eat twice — make enough tonight that tomorrow’s lunch is already handled.',
    },
    todo: {
      lead: 'Cooking at home is already yours.',
      suggestion:
        'Lowest-effort version: something that needs one pan and no recipe. It still counts.',
    },
  },
  'eating:meal-prepping': {
    done: {
      lead: 'You prep your meals.',
      suggestion:
        'Prep one thing you don’t normally — washed greens ready to grab makes the salad the default instead of the effort.',
    },
    todo: {
      lead: 'Meal prepping is already yours.',
      suggestion: 'Ten minutes on one component — rice, or chopped veg — is a real prep session.',
    },
  },
  'eating:drinking-water': {
    done: {
      lead: 'You’re drinking enough water.',
      suggestion:
        'Try anchoring the first glass to something you already do every morning, so it stops needing to be remembered.',
    },
    todo: {
      lead: 'Water is already your habit.',
      suggestion: 'One glass now, before your next coffee. That’s the whole thing.',
    },
  },
  'moving:taking-stairs': {
    done: {
      lead: 'You took the stairs.',
      suggestion:
        'Try one flight past where you were headed. It costs about twenty seconds and it’s the same trip.',
    },
    todo: {
      lead: 'Taking the stairs is already yours.',
      suggestion: 'Next time you’d reach for the button — one flight. Not all of them.',
    },
  },
  'moving:daily-walks': {
    done: {
      lead: 'You walked today.',
      suggestion:
        'Try taking the next one straight after a meal — same walk, and it’s the easiest time to remember it.',
    },
    todo: {
      lead: 'Daily walks are already yours.',
      suggestion: 'Ten minutes around the block counts. It doesn’t need to be the long route.',
    },
  },
  'sleep:cool-dark-room': {
    done: {
      lead: 'Your room is already cool and dark.',
      suggestion:
        'The other half of that is a consistent wake time — pick tomorrow’s now and it does more work than bedtime does.',
    },
    todo: {
      lead: 'A cool, dark room is already your setup.',
      suggestion: 'Worth doing before you’re tired: crack the window, kill one light source.',
    },
  },
  'sleep:limiting-screens': {
    done: {
      lead: 'You kept screens out of the wind-down.',
      suggestion:
        'Try leaving the phone charging in another room tonight — the distance does more than the willpower.',
    },
    todo: {
      lead: 'Limiting screens before bed is already yours.',
      suggestion: 'Set the phone down across the room instead of on the nightstand. That’s enough.',
    },
  },
  'stress:clears-your-head': {
    done: {
      lead: 'You did the thing that clears your head.',
      suggestion:
        'Try putting it in the same slot tomorrow — the version of this that sticks is the one that already has a time.',
    },
    todo: {
      lead: 'You already know what clears your head.',
      suggestion: 'Five minutes of it now — the walk, the music, the quiet. Whichever is closest.',
    },
  },
  'stress:meditation-breathing': {
    done: {
      lead: 'You took time to breathe today.',
      suggestion:
        'Try tacking the next one onto something fixed — after you brush your teeth, before you open your laptop.',
    },
    todo: {
      lead: 'Breathing exercises are already yours.',
      suggestion: 'One minute is a real one. Sitting where you are right now is fine.',
    },
  },
}

// Per-pillar catch-all for intake options without bespoke copy above.
const PILLAR_FALLBACK = {
  eating: {
    done: {
      lead: 'That one’s done today.',
      suggestion:
        'Try repeating it tomorrow at the same meal — the habit you already have is the cheapest one to build on.',
    },
    todo: {
      lead: 'This one’s already yours.',
      suggestion: 'Smallest version that still counts: do it at your next meal, not the perfect one.',
    },
  },
  moving: {
    done: {
      lead: 'You moved today.',
      suggestion:
        'Try adding a couple of minutes to the same thing rather than starting something new.',
    },
    todo: {
      lead: 'This kind of movement is already yours.',
      suggestion: 'A few minutes counts. The short version is the one that actually happens.',
    },
  },
  sleep: {
    done: {
      lead: 'That’s handled tonight.',
      suggestion: 'Try setting tomorrow’s wake time now, while you’re thinking about it.',
    },
    todo: {
      lead: 'This is already part of how you sleep.',
      suggestion: 'Worth setting up before you’re tired — it takes a minute now, not later.',
    },
  },
  stress: {
    done: {
      lead: 'You made room for that today.',
      suggestion: 'Try giving it a standing slot tomorrow so it doesn’t need deciding on.',
    },
    todo: {
      lead: 'This is already how you unwind.',
      suggestion: 'A few minutes of it, now, counts as the whole thing.',
    },
  },
  social: {
    done: {
      lead: 'You connected with someone today.',
      suggestion: 'Try making the next one a standing thing — same day each week beats good intentions.',
    },
    todo: {
      lead: 'This is already how you stay connected.',
      suggestion: 'One message is enough. It doesn’t have to be a plan.',
    },
  },
}

// Rotates daily among candidates so an unmarked list doesn't show the same
// suggestion forever, while staying stable within a single day (no
// reshuffling on every render or mark).
function pickRotating(candidates, now) {
  if (candidates.length === 0) return null
  const dayIndex = Math.floor(
    new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 86400000,
  )
  return candidates[dayIndex % candidates.length]
}

function copyFor(row, state) {
  // "not today" and "not marked yet" get the same copy: the easiest version
  // of a habit they already own. Neither is a miss, so neither gets
  // different treatment — the only distinction that changes the suggestion
  // is whether they've actually done it (then it's a level-up).
  const key = state === 'done' ? 'done' : 'todo'
  const entry = INSIGHTS[row.key]?.[key] || PILLAR_FALLBACK[row.pillarId]?.[key]
  return entry ? { ...entry, row, state: key } : null
}

// How many suggestions the insights section shows at once. Three is enough
// to feel like a response to a few taps without turning into a wall of
// advice — the point is an easy win, not a plan.
const MAX_INSIGHTS = 3

// Builds the insights list from what's been marked today.
//
// Most recently marked first — that's what makes the section feel like it's
// responding to the taps rather than serving a static tip. `marks` is
// ordered least-to-most-recent (see OwnedChecklistContext), so it's read
// backwards. With nothing marked yet it falls back to a single rotating
// suggestion, so the section is never empty.
export function getOwnedInsights(rows, marks = [], now = new Date()) {
  if (rows.length === 0) return []

  const fromMarks = [...marks]
    .reverse()
    .map(({ key, state }) => {
      const row = rows.find((candidate) => candidate.key === key)
      return row ? copyFor(row, state) : null
    })
    .filter(Boolean)
    .slice(0, MAX_INSIGHTS)

  if (fromMarks.length > 0) return fromMarks

  const markedKeys = new Set(marks.map((mark) => mark.key))
  const fallback = pickRotating(
    rows.filter((row) => !markedKeys.has(row.key)),
    now,
  )
  const copy = fallback ? copyFor(fallback, 'todo') : null
  return copy ? [copy] : []
}
