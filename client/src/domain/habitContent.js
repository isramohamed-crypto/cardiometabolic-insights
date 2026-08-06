import { CONTENT_TYPE } from './habit.js'

// Real content pulled from the team's behaviors/content-mapping sheet (the
// "real behaviors sheet" referenced throughout this domain — see
// domain/habit.js). Two sources feed this file:
//
// 1. The Behaviors tab: one "primary" (justification) + one "associated"
//    (enabling/how-to) article per behavior. Stored per habit id below as
//    CONTENT_POOL — used for the general rotating teaser on a habit that
//    doesn't have a full 7-day script (see #2).
// 2. The Demo Content tab: full day-1-through-7 scripts for two habits
//    ("Walk for 10 minutes after a meal" / walk-after-meal, and "Wake
//    within the same 30-minute window" / consistent-wake-time), each with
//    a branded "Supportive"/"Enjoyment" content pairing per day. Stored as
//    DAY_SCRIPTS — used when a habit has one, indexed by days since the
//    habit was adopted (ties into HabitDayTracker's 7-day window).
//
// Entries where the sheet only had "NEEDS People Inc. match" (no article
// sourced yet) are simply omitted rather than filled with a placeholder.
//
// The Demo Content tab also has day-by-day "Reinforcement Content" — short
// unbranded first-person coaching copy in Vitalist's own voice (distinct
// from these branded press pieces). It's captured here too, but nothing in
// the UI surfaces it yet — flag to product/design before wiring it in.
//
// Any content item below (CONTENT_POOL, DAY_SCRIPTS' supportive/enjoyment
// entries, or COMPANION_CONTENT) can carry an optional `fullBody` alongside
// its short `body` teaser — the longer version of the copy, for once one's
// been written. `body` is always what shows on the card itself; `fullBody`
// is what ContentModal shows when the card's tapped, in place of an iframe
// — with `url` (if also set) rendered as a "Read the full article" link
// out to the source, rather than trying to embed it. Items with only
// `body` keep today's behavior unchanged (iframe if there's a `url`, the
// short teaser as a fallback if not) — see ContentModal.jsx.
export const CONTENT_POOL = {
  'walk-after-meal': [
    {
      id: 'wa-1',
      type: CONTENT_TYPE.JUSTIFICATION,
      brand: 'EatingWell',
      title: 'The Simple Nighttime Habit That May Balance Blood Sugar',
      // Condensed from EatingWell's full piece (same title) in Vitalist's
      // own words — not a verbatim excerpt.
      body: 'Blood sugar tends to climb after a meal, and a short walk gets your muscles pulling that glucose out of your bloodstream for fuel — which also improves how sensitive your cells are to insulin over time. That combination tends to mean steadier numbers overnight and fewer sleep disruptions from a spike before bed. Pairing the walk with an earlier, higher-fiber dinner tends to amplify the effect; if mornings stay high despite it, that\'s worth flagging to your doctor.',
      // Longer version for ContentModal — same "own words" rule as body
      // above, just more of it. Sourced from the content inventory sheet's
      // "Additional notes" pass.
      fullBody: 'Morning blood sugar spikes don\'t always start in the morning — they\'re often set up by what happened at dinner the night before, whether that\'s a big meal, going low on fiber, or skipping activity afterward. A short walk right after eating gives your muscles somewhere to put that glucose: as they contract, they pull sugar out of your bloodstream for fuel, insulin or not, which is part of why post-meal walks show up again and again in blood-sugar research. The effect seems biggest when the walk starts soon after the last bite rather than an hour later. It compounds well with a few other evening habits — a higher-fiber dinner, eating a bit earlier so you\'re not still digesting at bedtime, and a full night\'s sleep, since poor sleep on its own can push blood sugar up. Elevated blood sugar before bed can also mean more trips to the bathroom overnight, so the walk may pay off in better sleep too, not just better numbers. If mornings stay high despite all of this, it\'s worth mentioning to your doctor — persistent overnight highs can also point to medication timing or the body\'s natural early-morning hormone surge, both worth ruling out.',
      url: 'https://www.eatingwell.com/nighttime-habit-for-better-blood-sugar-11861157',
      image: "url('/The-Simple-After-Dinner-Habit-That-May-Balance-Blood-Sugars-b47f5d48f0564c9087d3af290b752726.webp')",
    },
    {
      id: 'wa-2',
      type: CONTENT_TYPE.ENABLING,
      brand: 'EatingWell',
      title: '6 Benefits of Walking After Meals',
      body: 'A post-meal walk does more than pass the time after dinner — even 15 to 30 minutes has been linked to lower blood sugar, easier digestion, and a mood boost, especially paired with something you enjoy, like a podcast or a dog who needs the walk as much as you do.',
      fullBody: 'Six separate benefits show up across the research on walking after a meal, and none of them require a long walk. Blood sugar responds fastest — a walk soon after eating blunts the glucose spike that follows a carb-heavy meal, more so than a walk taken before eating. Digestion follows close behind: a short 10 to 15 minute stroll has been linked to less bloating, gas, and constipation, since movement helps food move through the gut. Walking also increases circulation as blood gets redirected to working muscles, and over time it\'s associated with meaningfully lower blood pressure — even in people whose hypertension hasn\'t responded well to other treatment. It supports weight management too, not through the walk alone but through the small, repeatable calorie deficit it creates, and it reliably lifts mood by way of the same serotonin and endorphin release any movement triggers. The easiest way to make it stick is habit-stacking: attach the walk to something you already do after dinner — clearing the table, taking out the dog, loading the dishwasher — so it doesn\'t need its own decision each night.',
      url: 'https://www.eatingwell.com/benefits-of-walking-after-meals-11777687',
      image: "url('/6-Benefits-of-Walking-After-Meals-56d10054dc50491ea3e81c2208ed0815.webp')",
    },
  ],
  'two-strength-sessions': [
    {
      id: 'ts-1',
      type: CONTENT_TYPE.JUSTIFICATION,
      brand: 'Verywell Health',
      title: 'Research Shows a Certain Amount of Strength Training Every Week Can Help You Live Longer',
      body: 'A large, decades-long study found that 90 to 120 minutes of strength training a week — about one to three short sessions — was linked to meaningfully lower risk of dying from any cause, and specifically from cardiovascular and neurological disease, with benefits leveling off past that point. Pairing it with regular aerobic activity, like a walk, compounds the benefit further.',
      fullBody: 'The study behind this held up for nearly 30 years and followed about 147,000 adults, tracking how much strength training they did against how they eventually died. People who strength-trained 90 to 120 minutes a week — roughly one to three short sessions — had a 13% lower risk of death from any cause, a 19% lower risk of cardiovascular death, and a 27% lower risk of dying from neurological disease, compared to people who did little or none. Past 120 minutes a week, the researchers didn\'t find additional benefit — the gains leveled off rather than continuing to climb, which is good news if a bigger weekly commitment isn\'t realistic right now. The contribution here wasn\'t just confirming that strength training helps, which prior research already showed — it was pinning down roughly how much matters, and showing the benefit held decades out. It\'s also not a substitute for cardio: the two work on different systems, with aerobic exercise mainly supporting heart and metabolic health and strength training preserving muscle, bone density, and the kind of functional strength that prevents falls later in life. Combining a couple of strength sessions with regular walking or other aerobic movement outperforms either one alone.',
      url: 'https://www.verywellhealth.com/strength-training-longevity-12000925',
      image: "url('/VWH-GettyImages-2212443785-1756a837a6f84c688c1b14bcd702f31a.webp')",
    },
  ],
  'chair-stands-after-breakfast': [
    {
      id: 'cs-1',
      type: CONTENT_TYPE.JUSTIFICATION,
      brand: 'Verywell Health',
      title: 'Research Shows a Certain Amount of Strength Training Every Week Can Help You Live Longer',
      // Same underlying research as ts-1, told through what it means for a
      // move this small: chair stands are an easy way to bank some of that
      // weekly strength-training time without a gym or equipment.
      body: 'A large, decades-long study found that 90 to 120 minutes of strength training a week — about one to three short sessions — was linked to meaningfully lower risk of dying from any cause, and specifically from cardiovascular and neurological disease. Chair stands are a simple, equipment-free way to bank some of those minutes: they build the same lower-body strength that keeps you steady on stairs and getting up off the floor. Pairing it with regular aerobic activity, like a walk, compounds the benefit further.',
      // Same research as ts-1's fullBody, told through the sitting-rising
      // test angle instead, since that's the piece actually sourced for
      // this habit (per the content inventory sheet).
      fullBody: 'The sitting-rising test is a quick way to check where your strength, balance, and mobility stand without any equipment: barefoot on a non-slip surface, lower yourself to the floor using as little support as possible, then stand back up the same way. You start with five points for sitting and five for rising, losing a point each time you use a hand or knee for support and a half point for wobbling. A 2025 study followed 4,282 adults aged 46 to 75 for a median of 12 years and found the score tracked closely with survival — people who scored a perfect 10 had a 3.7% death rate over the follow-up period, compared to 11% for a score of eight and a 42% higher risk for the lowest-scoring group. Researchers didn\'t pin down exactly why the test predicts longevity so well, but it captures several things that quietly decline with age — leg strength, balance, and flexibility — all at once. The test itself isn\'t the fix, though: if your score is lower than you\'d like, chair stands are one of the more direct ways to rebuild the leg strength and sit-to-stand coordination the test is measuring, without needing a gym or any equipment. Anyone with a physical disability, or who is pregnant or elderly, should check with a doctor before trying the full floor version.',
      url: 'https://www.health.com/this-fitness-test-could-predict-your-longevity-11758686',
      image: "url('/MoMoProductions-1821169611-0ff05f9430e046a386a5a4fd54568dd5.webp')",
    },
  ],
  'morning-stretch': [
    {
      id: 'ms-1',
      type: CONTENT_TYPE.JUSTIFICATION,
      brand: 'Health',
      title: 'I Went to My First Stretch Session, and It Changed How I Think About Healthy Aging',
      // Condensed from Health's full piece (same title) in Vitalist's own
      // words — not a verbatim excerpt.
      body: 'Stretching the hips, glutes, and spine is what keeps everyday moves like tying a shoe, getting out of the car, or getting up from a chair easy as you age — mobility tends to go unnoticed until it starts slipping. Beyond flexibility, regular stretching has some evidence behind it for lower blood pressure, better blood sugar, eased tension and anxiety, and improved sleep. A few minutes a day focused on those areas does more for long-term independence than most people expect from something this low-effort.',
      fullBody: 'Stretching tends to get treated as something you do before a workout, if at all — but the aging-focused case for it is less about flexibility for its own sake and more about which daily movements it protects. Strong, mobile hips and glutes are what make walking up stairs, getting in and out of a car, and standing up from a chair feel automatic instead of effortful; a mobile spine is behind everything from bending down to pick something up to just standing upright comfortably. Both tend to tighten gradually enough that most people don\'t notice until a task that used to be easy suddenly isn\'t. Beyond mobility, regular stretching has real evidence behind it for a handful of other things: measurably lower blood pressure in people with moderately elevated readings (in some studies, more effective than walking), modest gains in muscle strength and power, better sleep for people with insomnia, and reduced tension and anxiety. None of it requires a formal session — a few focused minutes on hips, ankles/calves, and the spine most mornings covers the areas that matter most for staying independent later, and any stretching now beats none, even if it\'s not the deep, assisted kind a studio session offers.',
      url: 'https://www.health.com/stretching-for-longevity-12006815',
      image: "url('/Health-GettyImages-1419987706-99ff80a2f9554d898eb74ee0d5f46963.webp')",
    },
  ],
  'consistent-wake-time': [
    {
      id: 'wt-1',
      type: CONTENT_TYPE.JUSTIFICATION,
      brand: 'Verywell Health',
      title: 'First Step to Better Sleep: Wake Up at the Same Time Every Day',
      body: 'Waking at the same time every day — weekends included — reinforces your body\'s natural sleep-wake cycle, and tends to make falling asleep easier too, since it keeps your sleep drive building on a predictable schedule. A little morning sunlight and skipping the snooze button both help it stick.',
      fullBody: 'A fixed wake time works less like a rule and more like an anchor for the rest of your circadian rhythm — your body uses it as the reference point for when to release cortisol, when to feel sleepy, and when to feel alert. Sleeping in, even by a couple of hours on a weekend, functions like pushing bedtime later that same night, which is part of why an inconsistent wake time so often shows up as trouble falling asleep on Sunday. Getting 15 to 30 minutes of natural light shortly after waking reinforces the same rhythm from the other direction, helping the body distinguish "day" from "night" more clearly, which in turn supports feeling sleepy at the right time that evening. The habit is deceptively simple to describe and genuinely hard to keep — the biggest point of failure is hitting snooze, which is why picking a wake time you can actually sustain, rather than the most virtuous-sounding one, matters more than picking an early one. People who keep a consistent wake time tend to report easier mornings, fewer naps, better focus, and fewer sleep disruptions overall. If getting up consistently still doesn\'t translate into feeling rested, or if trouble waking persists despite doing everything right, it\'s worth ruling out an underlying sleep disorder like insomnia or sleep apnea with a sleep specialist rather than assuming it\'s a discipline problem.',
      url: 'https://www.verywellhealth.com/30-days-to-better-sleep-3973920',
      image: "url('/30-days-to-better-sleep-3973920_v21-3c0ce2cc1f8149c58242946ac704fa8d.webp')",
    },
  ],
  'high-fiber-breakfast': [
    {
      id: 'fb-1',
      type: CONTENT_TYPE.JUSTIFICATION,
      brand: 'Allrecipes',
      title: "You're Probably Not Getting Enough Fiber — Here's Why It Matters and How to Fix It",
      body: 'Fewer than 5% of Americans get the recommended 25 to 30 grams of fiber a day — most people focus on protein instead, when fiber is the more common gap. It supports digestion, blood sugar, and fullness, and a single breakfast swap (oats, chia, a whole-grain toast) is an easy place to start.',
      fullBody: 'Protein deficiency is nearly unheard of in the U.S., but fiber is a different story — fewer than 5% of Americans hit the recommended 25 to 30 grams a day, and the shortfall is worse on restrictive diets like keto or gluten-free, where whole grains and a wide variety of produce tend to drop out first. Fiber comes in two forms that do different jobs: soluble fiber (oats, chia, legumes, most fruit) dissolves into a gel-like substance that slows digestion and helps you feel full longer; insoluble fiber (nuts, seeds, and the skins of fruits and vegetables) adds bulk that keeps things moving through the digestive tract. Most people should get roughly three-quarters of their fiber from insoluble sources and a quarter from soluble, though individual needs vary. Beyond digestion, adequate fiber is linked to a lower risk of cardiovascular disease, type 2 diabetes, and colorectal cancer, and it plays a role in blood sugar regulation by slowing how fast glucose gets absorbed. Food sources are the better route — a supplement makes it easier to overdo it, which can crowd out mineral absorption — but if breakfast is the hardest meal to add fiber to, something as small as leaving the skin on fruit, adding a spoonful of chia or flax, or swapping in a whole-grain option covers a meaningful share of the day\'s target. Going slowly matters too: a sudden jump in fiber intake before your gut bacteria adjust is the most common reason for bloating and gas.',
      url: 'https://www.allrecipes.com/article/how-to-get-enough-fiber/',
      image: "url('/GettyImages-98896874-2000-b66cfc74cb034f0c9c7e47c93f39a89f.webp')",
    },
  ],
  'water-on-waking': [
    {
      id: 'ww-1',
      type: CONTENT_TYPE.JUSTIFICATION,
      brand: 'EatingWell',
      title: 'The Benefits of Front-Loading Your Water Intake, According to Dietitians',
      body: 'Sleep is one of the longest stretches you go without drinking anything, so a glass of water first thing helps rehydrate before you\'ve even had coffee. Front-loading your water intake earlier in the day has also been linked to better focus, digestion, and even modest support for weight management.',
      fullBody: 'Water makes up roughly 60% of the body, and overnight is one of the few long stretches most people go without any — breathing and sweating alone cause some fluid loss even during a still night\'s sleep. That\'s part of why a glass of water on waking tends to help with more than just thirst: one study found that rehydrating after a fast improved visual attention, the kind of focus that helps filter out distractions, and mild dehydration on its own is enough to cause fatigue and brain fog. Drinking water before a meal — about two cups — has also been shown to reduce how much is eaten at that meal by lowering perceived hunger, part of the case for getting ahead of your water intake earlier rather than trying to catch up at night. There\'s a sleep angle too, just in the other direction: drinking most of your fluids earlier in the day means less need to drink close to bedtime, which means fewer bathroom trips disrupting sleep. Needs vary by body weight, activity level, and climate — a common starting point is roughly half your body weight in ounces per day, adjusted up for exercise or heat — and overdoing it matters as much as underdoing it, since drinking far more than needed can dilute sodium levels. Keeping a glass by the bed the night before removes the only real friction in this habit: having to get up and get one.',
      url: 'https://www.eatingwell.com/front-loading-your-water-intake-11791775',
      image: "url('/RDs-Reveal-Whether-Drinking-Water-Earlier-in-the-Day-Matters--b91c3b8a51594e8facdde85360cae4ca.webp')",
    },
  ],
  'five-minute-breathing': [
    {
      id: 'fbr-1',
      type: CONTENT_TYPE.JUSTIFICATION,
      brand: 'Verywell Mind',
      title: 'The Benefits of Deep Breathing',
      body: 'Slow, deep breathing activates the parasympathetic nervous system — the body\'s "rest and digest" mode — which is part of why it reliably eases anxiety and stress in the moment, not just over time. It\'s also linked to better focus and better sleep, and costs nothing to try.',
      fullBody: 'Most breathing happens without any thought behind it, but there\'s a real difference between that automatic shallow breathing and a slower, deliberate deep breath — the kind that engages the diaphragm rather than just the muscles between your ribs. Deep breathing activates the parasympathetic nervous system, often called the "rest and digest" system, and along the way it stimulates the vagus nerve, which influences mood, digestion, and heart rate. Research connects the practice to reduced anxiety and depression, better sleep, and faster recovery after exercise or exertion. Two simple techniques cover most of what it takes to start: diaphragmatic breathing, where a hand on the belly should rise more than a hand on the chest as you inhale through the nose and slowly exhale; and 4-7-8 breathing, where you inhale for a count of four, hold for seven, and exhale for eight, repeated three to five times. The biggest practical tip is timing — practicing when you\'re calm builds the skill before you actually need it in a stressful moment, rather than trying to learn a new technique for the first time while already anxious. If a session ever leaves you lightheaded, that\'s a sign to stop; the feeling should pass quickly, and it\'s worth mentioning to a doctor if it doesn\'t.',
      url: 'https://www.verywellmind.com/the-benefits-of-deep-breathing-5208001',
      image: "url('/the-benefits-of-deep-breathing-5208001-Final-50074d86472d45bbb8d54261c774a4e8.webp')",
    },
  ],
  'evening-journal': [
    { id: 'ej-1', type: CONTENT_TYPE.JUSTIFICATION, brand: 'Verywell Mind', title: 'Want to Relieve Stress ASAP? Write in a Gratitude Journal' },
  ],
  'text-a-friend': [
    { id: 'tf-1', type: CONTENT_TYPE.JUSTIFICATION, brand: 'Verywell Mind', title: 'How Social Isolation Can Damage Your Mental Health' },
  ],
  // First sourced piece for this habit — previously had nothing (see the
  // content inventory sheet's "NO SOURCED CONTENT YET" flag). No fullBody
  // yet since the sheet's Additional notes cell for this row is still
  // blank; add one once there's more than the teaser to work with.
  'extra-veg-dinner': [
    {
      id: 'ev-1',
      type: CONTENT_TYPE.JUSTIFICATION,
      brand: 'Allrecipes',
      title: '5 Easy Steps to Eat More Healthfully in 2022',
      body: 'A handful of small, doable shifts — more plants, less added sugar, a bit more movement — tend to do more for how you feel than one big diet overhaul, and working an extra serving of vegetables into a meal is one of the easiest to start with.',
      url: 'https://www.allrecipes.com/article/5-easy-steps-to-eat-more-healthfully/',
      image: "url('/eatmoreveg.webp')",
    },
  ],
}

// Full day-by-day scripts from the Demo Content tab. `supportive` is the
// branded companion piece shown per day (falls back to that day's
// "Enjoyment" pairing when the sheet left the primary Supportive cell
// blank); `reinforcement` is Vitalist's own unbranded coaching line for
// that day, kept here for reference even though no UI shows it yet.
const DAY_SCRIPTS = {
  'walk-after-meal': [
    {
      // Job: reduce self-judgment when the habit still feels effortful.
      reinforcement: 'The hardest part may be starting. After a meal, staying where you are often feels easier — you don’t need to feel motivated before you begin. Starting slowly is enough.',
      supportive: {
        id: 'wa-day1',
        brand: 'Verywell Health',
        title: '8 Benefits of Walking Every Day',
        url: 'https://www.verywellhealth.com/benefits-of-walking-every-day-11719538',
        body: 'Walking daily benefits your body, mind, and emotions — and may even help extend your life.',
      },
    },
    {
      // Job: keep the small habit from turning into another demanding fitness task.
      reinforcement: 'This doesn’t need to feel like exercise. No pace target, no step goal, no need to work up a sweat — the habit is simply adding a little movement after a meal.',
      supportive: {
        id: 'wa-day2',
        brand: 'Real Simple',
        title: 'Too Cold Outside? Here Are 6 Easy Ways to Stay Active Without Leaving Home',
        url: 'https://www.realsimple.com/ways-to-stay-active-at-home-11897354',
        body: 'Stay in today: walk from room to room for ten minutes. Have stairs? Add one easy trip up and down every few minutes.',
      },
      // Second pairing for the day — pickDailyContent only surfaces
      // `supportive`, but this is here for whenever the UI can show more
      // than one piece per day.
      enjoyment: {
        id: 'wa-day2-b',
        brand: 'Verywell Mind',
        title: '7-Minute Video Meditation for Mindful Walking',
        url: 'https://www.verywellmind.com/7-minute-video-meditation-for-mindful-walking-8598399',
        body: 'A short guided meditation for turning today’s walk into a mindful one.',
      },
    },
    {
      reinforcement: 'You’re still finding your easiest version of this — the next few walks can help you discover the one you’ll actually return to.',
      supportive: { id: 'wa-day3', brand: 'Verywell Mind', title: 'Take a Guided Walk' },
    },
    {
      // Job: help the user develop a personally meaningful reason to
      // continue without promising an outcome.
      // NOTE: left this day's supportive link as-is — the replacement
      // pasted in for day 4 pointed to the same walking-shoes article
      // that's linked for day 7 below, alongside an "EatingWell" sleep/
      // blood-sugar description that doesn't match it. Flagged for Esther
      // to confirm the intended link before swapping this one out.
      reinforcement: 'Notice what the walk changes for you today. You may feel more awake, less full, mentally clearer — or no obvious difference at all. Pay attention without grading the experience.',
      supportive: { id: 'wa-day4', brand: 'EatingWell', title: 'Walking After Dinner Improves Sleep, Too' },
    },
    {
      // Job: make the habit itself feel more rewarding.
      reinforcement: 'Your route may be familiar — the day isn’t. The light, weather, sounds, people, plants, and animals around you keep changing. A short walk can reveal something you didn’t notice yesterday.',
      supportive: {
        id: 'wa-day5',
        brand: 'Parents',
        title: 'How To Have a Conversation With Your Kids About School',
        url: 'https://www.parents.com/questions-to-ask-kids-about-school-8657109',
        body: 'Try “High, Low, Buffalo” — take turns sharing one high point, one low point, and one strange or funny moment from today.',
      },
    },
    {
      // Job: help the user recognize and preserve conditions that support
      // the habit. No linked piece this round — the walking-shoe
      // recommendation that used to fill this slot (as an Enjoyment
      // fallback) moved to day 7, where it was paired more clearly.
      reinforcement: 'Keep the part that made today easier — a familiar route, shoes already by the door, someone to walk with, a meal that leaves you enough time. When something lowers the effort, it’s worth repeating.',
      supportive: null,
    },
    {
      // Job: connect repeated action to self-concept without assigning
      // the user an identity they haven't earned.
      reinforcement: 'You’re making movement part of an ordinary day. This is not a major fitness program or a test of discipline — it’s a small way of caring for yourself after a meal, and each time you return to it, it becomes more recognizably yours.',
      supportive: {
        id: 'wa-day7',
        brand: 'Real Simple',
        title: 'The Science-Backed Benefits of Passeggiata, Italy’s Beloved Evening Tradition That’s Good for Your Brain and Body',
        url: 'https://www.realsimple.com/what-is-passeggiata-11911501',
        body: 'No pace goal — walk slowly, look around, invite someone along. The point is to enjoy the transition out of your day.',
        image: "url('/GettyImages-2177586029-520077efb4034740baa49a79d378e4d0.webp')",
      },
      enjoyment: {
        id: 'wa-day7-b',
        brand: 'Health',
        title: 'The 10 Best Walking Shoes of 2026, According to Podiatrists and Testing',
        url: 'https://www.health.com/style/comfortable-walking-shoes',
        body: 'A comfortable walking shoe can make a huge difference in how your body feels at the end of the day.',
      },
    },
  ],
  'consistent-wake-time': [
    {
      reinforcement: 'You don’t have to become an early bird — the goal is a time that fits your real life, chosen consistently.',
      supportive: { id: 'wt-day1', brand: 'The Spruce', title: 'Choose a Wake-Up Sound You Can Live With' },
    },
    {
      reinforcement: 'A rough night doesn’t make this morning a failure. You’re keeping one part of the morning steady while you learn what helps.',
      supportive: { id: 'wt-day2', brand: 'Byrdie', title: 'Start With a Gentle Stretch' }, // Enjoyment fallback — Supportive cell was blank for day 2
    },
    {
      reinforcement: 'The window can flex. You’re aiming for the same 30-minute range, not the exact same minute.',
      supportive: { id: 'wt-day3', brand: 'Martha Stewart', title: 'See How Martha Starts the Day' },
    },
    {
      reinforcement: 'Notice the rest of the day, not only the alarm — when you feel alert, when energy dips.',
      supportive: { id: 'wt-day4', brand: 'Simply Recipes', title: 'Choose Tomorrow’s Breakfast' },
    },
    {
      reinforcement: 'Keep what made waking easier today — the light, the alarm sound, breakfast ready to go.',
      supportive: { id: 'wt-day5', brand: 'Food & Wine', title: 'Borrow a Morning Ritual From a Chef' },
    },
    {
      reinforcement: 'You’re building a morning your body can recognize — not a perfect schedule, not a streak.',
      supportive: null, // nothing sourced for day 6 yet
    },
    {
      reinforcement: 'A repeated signal that makes one part of the day more predictable — that’s the whole habit.',
      supportive: null, // nothing sourced for day 7 yet
    },
  ],
}

// Raw whole days elapsed since a habit was adopted (0 = the day it was
// picked). Exported so other screens — e.g. HabitDetail's "ready to
// integrate?" prompt after day 7 — can use the same clock as the tracker.
export function daysSinceStart(startedAt) {
  const start = new Date(startedAt)
  start.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((today - start) / (1000 * 60 * 60 * 24))
}

function dayIndexSince(startedAt) {
  return Math.min(Math.max(daysSinceStart(startedAt), 0), 6) // clamp to the 7-day script (0-indexed)
}

// Picks the content to surface for a habit on the Routine page. Prefers
// that day's scripted piece (by days since the habit was adopted) when one
// exists; otherwise falls back to a random pick from the habit's general
// content pool. Rotates every time this is called (i.e. every page visit —
// see Routine.jsx), since the script advances by day and the fallback pool
// is picked at random.
export function pickDailyContent(habitId, startedAt) {
  const script = DAY_SCRIPTS[habitId]
  if (script) {
    const entry = script[dayIndexSince(startedAt)]
    if (entry?.supportive) return entry.supportive
  }

  const pool = CONTENT_POOL[habitId]
  if (!pool || pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

// Picks a rotating piece for HabitDetail's "Did you know?" section —
// same random-from-pool idea as pickDailyContent's fallback, but scoped
// to just the habit's JUSTIFICATION-type pool (the "why this matters"
// press pieces) rather than any type, since ENABLING/how-to content
// doesn't belong under a "did you know" heading. Returns null when a
// habit's pool has no justification piece yet (e.g. it only has an
// ENABLING entry) — HabitDetail falls back to just the catalog's own
// static justification text in that case.
export function pickJustificationContent(habitId) {
  const pool = (CONTENT_POOL[habitId] || []).filter(
    (item) => item.type === CONTENT_TYPE.JUSTIFICATION,
  )
  if (pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

// "Something to play/read during the habit itself" — distinct from the
// day-by-day CONTENT_POOL/DAY_SCRIPTS content above, which is about
// building the habit; this is a single evergreen companion piece for
// doing it (a video, a podcast, a playlist), so it doesn't rotate by day.
// `sectionLabel` is the actual heading HabitDetail renders ("While you
// walk") — kept here per habit rather than hardcoded in the component so
// each habit can phrase it for its own action ("While you stretch",
// "While you breathe", etc.).
//
// 'walk-after-meal' (wa-companion-goals-podcast, above) is the one real,
// sourced entry — pulled from the same behaviors sheet as the rest of this
// file. Its `url` is the Megaphone playlist embed
// (playlist.megaphone.fm/?e=...), not the verywellmind.com article page —
// the article page itself would likely refuse to load in ContentModal's
// iframe (publisher X-Frame-Options/CSP, same issue called out in
// ContentModal's comment), but Megaphone's own playlist embed URL is
// purpose-built to be framed, so tapping the card actually plays the
// episode instead of bouncing to the fallback link. Its `image` is the
// real Verywell Mind Podcast cover art already sitting in client/public —
// same `url('/path.webp')`-wrapped format DAY_SCRIPTS' wa-day7.supportive
// uses above, so every consumer (HabitDetail, Routine, Read) can just do
// `thumbnail={item.image || gradient}` without caring which content
// source the item came from. The entries below it are placeholders:
// titles/brands invented in the same People Inc. house style (not sourced
// from a live fetch, since this content pass didn't have real URLs to
// pull from), with no `url` or `image` so ContentCard/ContentModal fall
// back to the habit's flat gradient + thumbnail/body view instead of
// trying to load a real page or photo. Swap each for the real sourced
// piece — and add a `url`/`image` — once one exists.
export const COMPANION_CONTENT = {
  'walk-after-meal': {
    sectionLabel: 'While you walk',
    content: {
      id: 'wa-companion-goals-podcast',
      type: CONTENT_TYPE.COMPANION,
      brand: 'Verywell Mind',
      title: '130 - Friday Fix: 3 Mistakes to Avoid When Creating Goals for Yourself',
      url: 'https://playlist.megaphone.fm/?e=MERE7757124575&artwork=false&light=true',
      body: 'Goals are a great way to stick to habits — listen for the 3 mistakes to avoid when creating them, right from your walk.',
      image: "url('/primary-643d863793a04e78bdb81c2aa012bc55.webp')",
    },
  },
  'two-strength-sessions': {
    sectionLabel: 'While you train',
    content: {
      id: 'ts-companion-playlist',
      type: CONTENT_TYPE.COMPANION,
      brand: 'Health',
      title: 'The Best Workout Playlists for Strength Training, According to Trainers',
      body: 'A steady beat helps carry you through the last few reps of a set — worth having something queued up before you start.',
    },
  },
  'chair-stands-after-breakfast': {
    sectionLabel: 'While you stand',
    content: {
      id: 'cs-companion-form-check',
      type: CONTENT_TYPE.COMPANION,
      brand: 'Verywell Health',
      title: 'How To Do a Perfect Sit-to-Stand, Step by Step',
      body: 'Good form matters more than reps here — a quick refresher on posture and pace before you get going.',
    },
  },
  'morning-stretch': {
    sectionLabel: 'While you stretch',
    content: {
      id: 'ms-companion-follow-along',
      type: CONTENT_TYPE.COMPANION,
      brand: 'Real Simple',
      title: 'A 5-Minute Morning Stretch Routine You Can Follow Along To',
      body: 'Something to move through with, rather than count reps against — press play and follow the sequence.',
    },
  },
  'consistent-wake-time': {
    sectionLabel: 'While you wake up',
    content: {
      id: 'wt-companion-podcast',
      type: CONTENT_TYPE.COMPANION,
      brand: 'Real Simple',
      title: 'The Best Podcasts To Start Your Morning With',
      body: 'Something calmer than the news feed for the first few minutes after the alarm goes off.',
    },
  },
  'high-fiber-breakfast': {
    sectionLabel: 'While you eat',
    content: {
      id: 'fb-companion-ideas',
      type: CONTENT_TYPE.COMPANION,
      brand: 'EatingWell',
      title: '5 High-Fiber Breakfast Ideas That Take Five Minutes',
      body: 'A few easy additions to rotate in, for mornings when the usual one is out of reach.',
    },
  },
  'water-on-waking': {
    sectionLabel: 'While it kicks in',
    content: {
      id: 'ww-companion-signs',
      type: CONTENT_TYPE.COMPANION,
      brand: 'EatingWell',
      title: '9 Silent Signs You’re Not Drinking Enough Water',
      body: 'Worth a skim if you’re ever tempted to skip this one — most of these show up before thirst does.',
    },
  },
  'five-minute-breathing': {
    sectionLabel: 'While you breathe',
    content: {
      id: 'fbr-companion-guided',
      type: CONTENT_TYPE.COMPANION,
      brand: 'Verywell Mind',
      title: 'How The 4-7-8 Breathing Technique Can Help Relieve Stress and Anxiety',
      body: 'Dr. Weil demonstrates the 4-7-8 technique step by step — worth following along the first few times you try it.',
      fullBody: 'Dr. Weil\'s 4-7-8 technique follows a simple four-step breath, repeated four times in a row. Sit somewhere quiet and comfortable, and rest the tip of your tongue against the ridge just behind your upper front teeth — it stays there through the whole exercise. Start by exhaling completely through your mouth around your tongue, letting out an audible whoosh. Close your mouth and inhale quietly through your nose for a count of four. Hold that breath for a count of seven. Then exhale again through your mouth for a count of eight, fully emptying your lungs, keeping the same whoosh sound as the first breath. That\'s one cycle — repeat for four total, and consider building to a regular practice of twice a day.',
      // Real YouTube watch-page URLs generally refuse to be framed
      // (X-Frame-Options), same issue ContentModal's comment calls out for
      // article pages — so this uses YouTube's own /embed/ path instead of
      // the /watch page the content sheet linked, same substitution
      // wa-companion-goals-podcast makes with Megaphone's playlist embed
      // below.
      url: 'https://www.youtube.com/embed/p8fjYPC-k2k',
    },
  },
  'evening-journal': {
    sectionLabel: 'While you write',
    content: {
      id: 'ej-companion-prompts',
      type: CONTENT_TYPE.COMPANION,
      brand: 'Verywell Mind',
      title: '50 Journaling Prompts for Self-Discovery and Reflection',
      body: 'For the nights a blank page feels harder than it should — a prompt to start from instead.',
    },
  },
  'text-a-friend': {
    sectionLabel: 'Need an opener?',
    content: {
      id: 'tf-companion-openers',
      type: CONTENT_TYPE.COMPANION,
      brand: 'Verywell Mind',
      title: '50 Texts To Send When You Don’t Know What to Say',
      body: 'Low-stakes lines for the days deciding what to say is the only thing slowing you down.',
    },
  },
}
