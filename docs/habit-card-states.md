# Habit Card States (`eo-hcard`)

The states a habit card can be in, and what each one shows.

Difficulty levels referenced here are defined in [habit-tiers.md](./habit-tiers.md).

---

## Model

A habit card is either **unadopted** (being offered) or **adopted** (in the
user's routine). Adopted splits into **on trial** and **fully adopted**.

```
unadopted ──add──▶ on trial ──▶ fully adopted
                      │              │
                      └──── retire ──┘
```

---

## Unadopted

The card as it appears during onboarding — an offer, not yet a commitment.

| Shows | Notes |
|---|---|
| Background image | Full-bleed photo, keyed to the habit |
| Pillar kicker | Which pillar it ties to (`eo-hcard__kicker`) |
| Title | `eo-hcard__hed` |
| Subtitle | `eo-hcard__dek` |
| "Why this works" link | Expands to the justification + source article |
| **"Add this habit"** CTA | The affordance that defines this state |

Does **not** show: the brand flag (`eo-hcard__flag`). The source is still
credited in the "Read →" row inside Why this works.

CSS: `.eo-hcard--unadopted`

---

## Adopted — shared by both sub-states

Everything below applies to **on trial** and **fully adopted** alike.

| Property | Behavior |
|---|---|
| **Editable** | Opens an edit sheet — see below |
| **Time of day** | When the user intends to do it; drives the nudge if nudges are on |
| **Daily content** | A new piece of related content surfaced every day |
| **Status** | To-do / done. Set manually by tapping, or pulled automatically from usage data (steps, sleep, workouts, HRV) |
| **Difficulty level** | T1–T3 per [habit-tiers.md](./habit-tiers.md) |
| **Days done** | Count of days the habit has been completed |

### Edit sheet

Editing a habit lets the user change:

- Time of day they want to do it
- Difficulty level
- Status — promote trial → fully adopted, or retire the habit

---

## On trial

A habit still being tested. Distinguished from fully adopted by being within
the trial window and by the day counter it shows in place of a streak.

## Fully adopted

A habit that has stuck. Shows accumulated days done rather than a trial
countdown.

---

## Open questions

- [ ] **Trial length is inconsistent.** `docs/habit-tiers.md` says tier
      progression is "auto-offered after 2-week trial", but the code treats a
      trial as 7 days — `VHabitCard` renders `Day ${day} of 7` with
      `Math.min(dayOf(habit), 7)`, and `slotOpen` unlocks on `dayOf(h) >= 7`.
      Pick one.
- [ ] **The code has six status values for these three states.** Current
      strings: `trial`, `adopted`, `kept`, `my_habit`, `established`,
      `graduated`. They collapse into two buckets — `trial`/`adopted` are
      "working", and `kept`/`my_habit`/`established` are "established" — which
      means `adopted` in code currently means *still on trial*, the opposite of
      "fully adopted" here. Worth renaming to match this model.
- [ ] **`retire` doesn't exist yet** in code or data.
- [ ] **Difficulty isn't surfaced.** `habit.tier` is read in exactly one place
      (as a fallback inside `streakLabel`) and never displayed. `habit-tiers.md`
      also lists "whether tier progression is made visible in UI" as open.
- [ ] Do the shuffle control and the 3-dot pager belong to the unadopted state
      only? They're currently rendered on the onboarding card.
