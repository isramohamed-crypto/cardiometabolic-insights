# Daily Skin Check-in — visual direction variants

Four directions sketched for the home-feed Daily Skin Check-in card,
based on the Health.com brand palette (Leaf green, Seaweed, Green Apple,
Mineral Blue, Cream, Watermelon) and Poppins / DM Sans type. Kept here
for future reference — Esther may want to revisit these or swap to
another direction later.

**Selected:** Direction **B** with the streak dots from Direction **C**
(see `src/components/DailyCheckin.jsx` for the implementation).

---

## A. Bold Leaf

- **Background:** Leaf green `#1BBC3C` (solid)
- **Eyebrow:** Green Apple `#E8EF65` "Today's check-in"
- **Headline:** white Poppins, 21px, "Tell us how your skin feels today"
- **Body:** white at 85% opacity, DM Sans 13px
- **CTA:** Seaweed `#004620` filled pill with Green Apple text — "Start now →"

**Vibe:** Energetic, confident, hard to miss. Closest to the Figma's
"primary brand moment" treatment.

**Risk:** Loud. Sitting between the white Expert advice carousel and
the CommunityPoll, it'd be the brightest thing on the home feed.

---

## B. Cream + Green Apple punch  *(selected, with C's dots)*

- **Background:** Cream `#FFFCF5` with a Green Apple `#E8EF65` circle
  peeking out from the top-right corner
- **Border:** 1px Cream border `#EDE6D6`
- **Eyebrow:** Leaf green "Today · day N" (where N counts streak days)
- **Headline:** Seaweed `#004620` Poppins, 22px, magazine-bold
- **Body:** neutral gray DM Sans 13px
- **CTA:** Mineral Blue `#00B9E2` filled pill, white text, "Log today →"
- **Streak dots** *(added from C)*: row of 7 dots, Leaf-green filled for
  logged days, 12% Seaweed for unlogged

**Vibe:** Editorial, wellness magazine, modern. Decorative shape gives
personality without needing a photo asset.

**Risk:** Most "designed" of the four. If every home-feed section
adopted this much shape work it would feel busy.

---

## C. Seaweed premium

- **Background:** Seaweed `#004620` (solid)
- **Eyebrow:** Mineral Blue `#00B9E2` "Skin check-in"
- **Headline:** Green Apple `#E8EF65` Poppins, 21px, "How's your skin feeling?"
- **Body:** white at 80% opacity, DM Sans 13px
- **Bottom row:** streak dots on the left (Green Apple filled, 25%-white
  unfilled), Green Apple CTA pill on the right with Seaweed text
- **CTA copy:** "Log →"

**Vibe:** Calm, premium, dashboard-like. Most "real product daily use" feel.

**Risk:** Dark cards carry weight. If another section on the same page
is also dark, the page reads as too heavy.

---

## D. Magazine cover

- **Two-zone card** with a Leaf-green masthead at top, cream body below
- **Masthead:** Leaf green `#1BBC3C`. Wordmark "SKINSIGHT360" left-aligned,
  Watermelon `#EF2673` "DAY 4" badge pill right-aligned
- **Body:** Cream background, Watermelon "Daily edition" eyebrow,
  Seaweed `#004620` two-line Poppins headline at 24px,
  Seaweed CTA pill with Green Apple text — "Open →"

**Vibe:** Most editorial — looks like the cover of a Health.com magazine
issue. Most "marketing forward" of the four.

**Risk:** Most complex to maintain. Two zones, the most colors, the
most distinct components.

---

## Decision notes (May 2026)

- Picked **B** for its editorial-but-restrained feel — fits between
  Expert advice (clean white video carousel) and CommunityPoll (cream
  card) without overwhelming.
- Added **C's 7-dot streak indicator** above/next-to the CTA so the
  card communicates progress over time, not just "log today".
- Both A and D remain viable for future explorations if the page
  rhythm changes (e.g. if the home feed gets longer and the check-in
  needs more visual weight to compete).
