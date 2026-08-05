import { Router } from 'express'

const router = Router()

// Placeholder for People Inc. longevity/wellness content feed.
// Swap this out for a real People Inc. content API integration.
//
// This batch of general (not habit-tied) articles was dropped in as real
// URLs Esther pulled together — no filtering/categorization applied yet
// (flagged as a later pass). Titles could not be scraped from the source
// pages (verywellhealth.com, eatingwell.com, realsimple.com, etc. are all
// on Cowork's web-fetch blocklist), so they're inferred from each URL's
// slug instead of pulled from the live page. Spot-check against the
// actual articles before treating these as final copy — a few were
// cleaned up by hand where the slug was ambiguous or missing punctuation
// (ids 5, 20, 48, 52, 62, 68, 82), but the rest are mechanical guesses.
//
// `image` is a stand-in hero thumbnail, not the article's real photo —
// the same fetch blocklist above rules out pulling each article's actual
// og:image, so each one instead gets a generated abstract SVG
// (client/public/abstract-*.svg — soft blurred color-field compositions,
// styled to read as generic editorial stock art rather than a flat
// gradient) assigned by topic: clay = nutrition (1-20), teal = movement
// (21-35), plum = stress/money (36-45), indigo = sleep/family (46-57),
// sage = social (58-61), smoke = substance-free (62-72), slate =
// medical/aging-in-place (73-83). Swap in the real hero image per
// article whenever that becomes available.
//
// id 84 breaks that pattern on purpose: it's the same "Too Cold Outside?"
// piece already used as the walk-after-meal day-2 supportive link in
// habitContent.js (DAY_SCRIPTS), so its URL is real (not slug-inferred)
// and its image is the actual hero photo already sitting in
// client/public (athomeexercise-*.webp) rather than an abstract-*.svg
// placeholder. Surfaced here too so it also shows up in the Read tab's
// "More reading" list, not just buried in one habit's 7-day script.
const sampleContent = [
  { id: 1, title: "Fiber Isn't Just for Your Gut It Also Supports Brain Health", source: 'Verywell Health', url: 'https://www.verywellhealth.com/fiber-isnt-just-for-your-gut-it-also-supports-brain-health-12005891', image: '/abstract-clay.svg' },
  { id: 2, title: 'How to Eat Healthy', source: 'Verywell Health', url: 'https://www.verywellhealth.com/how-to-eat-healthy-11987013', image: '/abstract-clay.svg' },
  { id: 3, title: 'Diet Mistakes That Worsen Gut Health', source: 'Verywell Health', url: 'https://www.verywellhealth.com/diet-mistakes-that-worsen-gut-health-11962394', image: '/abstract-clay.svg' },
  { id: 4, title: 'Intuitive Eating', source: 'Verywell Health', url: 'https://www.verywellhealth.com/intuitive-eating-5272316', image: '/abstract-clay.svg' },
  { id: 5, title: 'Meal Planning Ideas', source: 'Better Homes & Gardens', url: 'https://www.bhg.com/recipes/healthy/meal-planning-ideas/', image: '/abstract-clay.svg' },
  { id: 6, title: 'Switch Plant Based Diet', source: 'Allrecipes', url: 'https://www.allrecipes.com/article/switch-plant-based-diet/', image: '/abstract-clay.svg' },
  { id: 7, title: 'How to Meal Plan', source: 'Allrecipes', url: 'https://www.allrecipes.com/article/how-to-meal-plan/', image: '/abstract-clay.svg' },
  { id: 8, title: '5 Easy Steps to Eat More Healthfully', source: 'Allrecipes', url: 'https://www.allrecipes.com/article/5-easy-steps-to-eat-more-healthfully/', image: '/abstract-clay.svg' },
  { id: 9, title: 'How to Meal Plan as a Vegan', source: 'Simply Recipes', url: 'https://www.simplyrecipes.com/how-to-meal-plan-as-a-vegan-5213483', image: '/abstract-clay.svg' },
  { id: 10, title: 'Yogurt Cottage Cheese Snack Recipes', source: 'Simply Recipes', url: 'https://www.simplyrecipes.com/yogurt-cottage-cheese-snack-recipes-11995854', image: '/abstract-clay.svg' },
  { id: 11, title: 'Quick Curried Salmon and Rice Salad Recipe', source: 'Simply Recipes', url: 'https://www.simplyrecipes.com/quick-curried-salmon-and-rice-salad-recipe-11880179', image: '/abstract-clay.svg' },
  { id: 12, title: 'Plant Based Diet', source: 'The Spruce Eats', url: 'https://www.thespruceeats.com/plant-based-diet-5206239', image: '/abstract-clay.svg' },
  { id: 13, title: 'High Protein High Fiber One Pot Dinner Recipes', source: 'EatingWell', url: 'https://www.eatingwell.com/high-protein-high-fiber-one-pot-dinner-recipes-12022025', image: '/abstract-clay.svg' },
  { id: 14, title: 'High Protein and High Fiber Bean Dinners', source: 'EatingWell', url: 'https://www.eatingwell.com/high-protein-and-high-fiber-bean-dinners-12019011', image: '/abstract-clay.svg' },
  { id: 15, title: 'Week Mediterranean Diet Meal Plan for Energy', source: 'EatingWell', url: 'https://www.eatingwell.com/week-mediterranean-diet-meal-plan-for-energy-11991498', image: '/abstract-clay.svg' },
  { id: 16, title: 'Budget Friendly High Fiber Foods', source: 'EatingWell', url: 'https://www.eatingwell.com/budget-friendly-high-fiber-foods-11924057', image: '/abstract-clay.svg' },
  { id: 17, title: 'Budget Friendly Mediterranean Diet Foods', source: 'EatingWell', url: 'https://www.eatingwell.com/budget-friendly-mediterranean-diet-foods-8783910', image: '/abstract-clay.svg' },
  { id: 18, title: 'Healthiest Snacks to Eat Between Meals', source: 'Real Simple', url: 'https://www.realsimple.com/healthiest-snacks-to-eat-between-meals-11992368', image: '/abstract-clay.svg' },
  { id: 19, title: 'Grocery Shopping Mistake That Makes Food Go Bad Faster', source: 'Southern Living', url: 'https://www.southernliving.com/grocery-shopping-mistake-that-makes-food-go-bad-faster-12007996', image: '/abstract-clay.svg' },
  { id: 20, title: 'Hungryroot: Tested and Reviewed', source: 'Food & Wine', url: 'https://www.foodandwine.com/hungryroot-tested-review-11899712', image: '/abstract-clay.svg' },
  { id: 21, title: 'Walking Workout', source: 'Verywell Health', url: 'https://www.verywellhealth.com/walking-workout-8724153', image: '/abstract-teal.svg' },
  { id: 22, title: 'Walking After Meal Blood Sugar', source: 'Health', url: 'https://www.health.com/news/walking-after-meal-blood-sugar', image: '/abstract-teal.svg' },
  { id: 23, title: 'Should You Walk Before or After Eating', source: 'Health', url: 'https://www.health.com/should-you-walk-before-or-after-eating-11710375', image: '/abstract-teal.svg' },
  { id: 24, title: 'Simple Ways to Move More Throughout the Day', source: 'Real Simple', url: 'https://www.realsimple.com/simple-ways-to-move-more-throughout-the-day-11808607', image: '/abstract-teal.svg' },
  { id: 25, title: 'Ways to Sit Less Move More During the Day', source: 'Real Simple', url: 'https://www.realsimple.com/ways-to-sit-less-move-more-during-the-day-11855245', image: '/abstract-teal.svg' },
  { id: 26, title: 'Benefits of Strength Training', source: 'Verywell Health', url: 'https://www.verywellhealth.com/benefits-of-strength-training-8658658', image: '/abstract-teal.svg' },
  { id: 27, title: 'How to Use Resistance Bands', source: 'Verywell Health', url: 'https://www.verywellhealth.com/how-to-use-resistance-bands-8697067', image: '/abstract-teal.svg' },
  { id: 28, title: 'Balance Exercise for Seniors', source: 'Verywell Health', url: 'https://www.verywellhealth.com/balance-exercise-for-seniors-11857703', image: '/abstract-teal.svg' },
  { id: 29, title: 'Ways to Stay Active as You Age', source: 'Verywell Health', url: 'https://www.verywellhealth.com/ways-to-stay-active-as-you-age-6606479', image: '/abstract-teal.svg' },
  { id: 30, title: 'Exercise for Seniors', source: 'Verywell Health', url: 'https://www.verywellhealth.com/exercise-for-seniors-11719373', image: '/abstract-teal.svg' },
  { id: 31, title: 'Stretching for Longevity', source: 'Health', url: 'https://www.health.com/stretching-for-longevity-12006815', image: '/abstract-teal.svg' },
  { id: 32, title: 'Is Walking Enough to Keep Me Healthy', source: 'Health', url: 'https://www.health.com/is-walking-enough-to-keep-me-healthy-12022514', image: '/abstract-teal.svg' },
  { id: 33, title: 'Hobbies That Help You Age Better and Live Longer', source: 'Real Simple', url: 'https://www.realsimple.com/hobbies-that-help-you-age-better-and-live-longer-11937579', image: '/abstract-teal.svg' },
  { id: 34, title: 'Is It Bad to Work Out Every Day', source: 'Byrdie', url: 'https://www.byrdie.com/is-it-bad-to-work-out-every-day-1', image: '/abstract-teal.svg' },
  { id: 35, title: 'Morning Habit to Help You Live Longer', source: 'EatingWell', url: 'https://www.eatingwell.com/morning-habit-to-help-you-live-longer-12017017', image: '/abstract-teal.svg' },
  { id: 36, title: 'Breathing Exercises for Anxiety', source: 'Health', url: 'https://www.health.com/breathing-exercises-for-anxiety-7497938', image: '/abstract-plum.svg' },
  { id: 37, title: 'How to Relieve Stress', source: 'Health', url: 'https://www.health.com/how-to-relieve-stress-8777654', image: '/abstract-plum.svg' },
  { id: 38, title: 'Writing in a Gratitude Journal for Stress Relief', source: 'Verywell Mind', url: 'https://www.verywellmind.com/writing-in-a-gratitude-journal-for-stress-relief-3144887', image: '/abstract-plum.svg' },
  { id: 39, title: 'Benefits of Mindfulness Based Stress Reduction', source: 'Verywell Mind', url: 'https://www.verywellmind.com/benefits-of-mindfulness-based-stress-reduction-88861', image: '/abstract-plum.svg' },
  { id: 40, title: 'Mental Health Benefits of Having a Creative Outlet', source: 'Real Simple', url: 'https://www.realsimple.com/mental-health-benefits-of-having-a-creative-outlet-12003552', image: '/abstract-plum.svg' },
  { id: 41, title: 'How Houseplants Help Fight the Winter Blues', source: 'Better Homes & Gardens', url: 'https://www.bhg.com/how-houseplants-help-fight-the-winter-blues-11896460', image: '/abstract-plum.svg' },
  { id: 42, title: 'Gardening Recession Proof', source: 'Better Homes & Gardens', url: 'https://www.bhg.com/gardening-recession-proof-11754729', image: '/abstract-plum.svg' },
  { id: 43, title: 'Reduce Stress With These 2 Simple Money Habits Backed by Experts', source: 'Investopedia', url: 'https://www.investopedia.com/reduce-stress-with-these-2-simple-money-habits-backed-by-experts-11794598', image: '/abstract-plum.svg' },
  { id: 44, title: 'How to Build a Monthly Budget That Actually Fits Your Life', source: 'Investopedia', url: 'https://www.investopedia.com/how-to-build-a-monthly-budget-that-actually-fits-your-life-11826802', image: '/abstract-plum.svg' },
  { id: 45, title: 'Fear of Money', source: 'Investopedia', url: 'https://www.investopedia.com/fear-of-money-8611193', image: '/abstract-plum.svg' },
  { id: 46, title: 'Dakota Johnson 14 Hours of Sleep', source: 'InStyle', url: 'https://www.instyle.com/dakota-johnson-14-hours-of-sleep-8414826', image: '/abstract-indigo.svg' },
  { id: 47, title: 'How to Sleep Better Without Melatonin', source: 'Verywell Health', url: 'https://www.verywellhealth.com/how-to-sleep-better-without-melatonin-11932305', image: '/abstract-indigo.svg' },
  { id: 48, title: 'Sleep Hygiene: Definition, Types, and Techniques', source: 'Verywell Health', url: 'https://www.verywellhealth.com/sleep-hygiene-definition-types-techniques-efficacy-6749577', image: '/abstract-indigo.svg' },
  { id: 49, title: 'Items to Never Keep in a Bedroom for Better Sleep', source: 'The Spruce', url: 'https://www.thespruce.com/items-to-never-keep-in-a-bedroom-for-better-sleep-11692884', image: '/abstract-indigo.svg' },
  { id: 50, title: 'Does Bedroom Layout Affect Sleep Quality', source: 'The Spruce', url: 'https://www.thespruce.com/does-bedroom-layout-affect-sleep-quality-11938739', image: '/abstract-indigo.svg' },
  { id: 51, title: 'Relaxing Bedroom Lighting', source: 'Better Homes & Gardens', url: 'https://www.bhg.com/relaxing-bedroom-lighting-11916744', image: '/abstract-indigo.svg' },
  { id: 52, title: 'The 3-2-1 Sleep Method', source: 'Real Simple', url: 'https://www.realsimple.com/3-2-1-sleep-method-11711981', image: '/abstract-indigo.svg' },
  { id: 53, title: 'Habits to Sleep Better', source: 'Real Simple', url: 'https://www.realsimple.com/habits-to-sleep-better-8710591', image: '/abstract-indigo.svg' },
  { id: 54, title: 'Best Blackout Curtains', source: 'Better Homes & Gardens', url: 'https://www.bhg.com/best-blackout-curtains-6822097', image: '/abstract-indigo.svg' },
  { id: 55, title: 'How to Make Waking Up Easier for Kids', source: 'Parents', url: 'https://www.parents.com/how-to-make-waking-up-easier-for-kids-12018998', image: '/abstract-indigo.svg' },
  { id: 56, title: "Sleep Deprived Kids and Parents Aren't Just Cranky Their Mental Health Is Suffering", source: 'Parents', url: 'https://www.parents.com/sleep-deprived-kids-and-parents-aren-t-just-cranky-their-mental-health-is-suffering-11696629', image: '/abstract-indigo.svg' },
  { id: 57, title: 'Family Traditions to Enjoy Together', source: 'Parents', url: 'https://www.parents.com/family-traditions-to-enjoy-together-8627648', image: '/abstract-indigo.svg' },
  { id: 58, title: 'How Weak Ties Impact Mental Health', source: 'Verywell Mind', url: 'https://www.verywellmind.com/how-weak-ties-impact-mental-health-11951309', image: '/abstract-sage.svg' },
  { id: 59, title: 'Loneliness Epidemic Ways to Connect', source: 'Health', url: 'https://www.health.com/loneliness-epidemic-ways-to-connect-7497295', image: '/abstract-sage.svg' },
  { id: 60, title: 'How to Make Friends as an Adult', source: 'Real Simple', url: 'https://www.realsimple.com/how-to-make-friends-as-an-adult-11970636', image: '/abstract-sage.svg' },
  { id: 61, title: 'Health Benefits of Puppies', source: 'The Spruce Pets', url: 'https://www.thesprucepets.com/health-benefits-of-puppies-2804874', image: '/abstract-sage.svg' },
  { id: 62, title: "Jodie Sweetin on How She and John Stamos Support Each Other's Sobriety Journeys", source: 'People', url: 'https://people.com/jodie-sweetin-on-how-she-and-john-stamos-support-each-other-s-sobriety-journeys-12022050', image: '/abstract-smoke.svg' },
  { id: 63, title: 'Nicotine Withdrawal Making a Plan to Quit', source: 'Verywell Health', url: 'https://www.verywellhealth.com/nicotine-withdrawal-making-a-plan-to-quit-5224813', image: '/abstract-smoke.svg' },
  { id: 64, title: 'How to Quit Smoking', source: 'Verywell Health', url: 'https://www.verywellhealth.com/how-to-quit-smoking-8404821', image: '/abstract-smoke.svg' },
  { id: 65, title: 'Smoking Cessation', source: 'Health', url: 'https://www.health.com/smoking-cessation-7560530', image: '/abstract-smoke.svg' },
  { id: 66, title: 'Going Out After Quitting Smoking', source: 'Verywell Mind', url: 'https://www.verywellmind.com/going-out-after-quitting-smoking-4796606', image: '/abstract-smoke.svg' },
  { id: 67, title: 'There Is No Such Thing as Just One Cigarette', source: 'Verywell Mind', url: 'https://www.verywellmind.com/there-is-no-such-thing-as-just-one-cigarette-2825222', image: '/abstract-smoke.svg' },
  { id: 68, title: 'The Semi-Dry Lifestyle', source: 'Real Simple', url: 'https://www.realsimple.com/semi-dry-lifestyle-7092554', image: '/abstract-smoke.svg' },
  { id: 69, title: 'Apps to Drink Less Alcohol', source: 'Real Simple', url: 'https://www.realsimple.com/apps-to-drink-less-alcohol-6979850', image: '/abstract-smoke.svg' },
  { id: 70, title: 'The Dangers of Vaping Around Your Kids', source: 'Parents', url: 'https://www.parents.com/kids/health/the-dangers-of-vaping-around-your-kids/', image: '/abstract-smoke.svg' },
  { id: 71, title: 'Nick Kosir Says Sobriety Helped Him Build Career Momentum Exclusive', source: 'People', url: 'https://people.com/nick-kosir-says-sobriety-helped-him-build-career-momentum-exclusive-11928788', image: '/abstract-smoke.svg' },
  { id: 72, title: 'Man Shares Life Changes After Sobriety and Weight Loss Exclusive', source: 'People', url: 'https://people.com/man-shares-life-changes-after-sobriety-and-weight-loss-exclusive-11967065', image: '/abstract-smoke.svg' },
  { id: 73, title: 'Improving Medication Adherence', source: 'Verywell Health', url: 'https://www.verywellhealth.com/improving-medication-adherence-6823625', image: '/abstract-slate.svg' },
  { id: 74, title: 'Healthy Aging Questions to Ask by Decade', source: 'Verywell Health', url: 'https://www.verywellhealth.com/healthy-aging-questions-to-ask-by-decade-6743819', image: '/abstract-slate.svg' },
  { id: 75, title: 'Your Annual Checkup', source: 'Verywell Health', url: 'https://www.verywellhealth.com/your-annual-checkup-2966782', image: '/abstract-slate.svg' },
  { id: 76, title: 'Common Medical Tests Unnecessary for Older Adults', source: 'Verywell Health', url: 'https://www.verywellhealth.com/common-medical-tests-unnecessary-for-older-adults-8606199', image: '/abstract-slate.svg' },
  { id: 77, title: 'Routine Colonoscopy Age Recommendations', source: 'Verywell Health', url: 'https://www.verywellhealth.com/routine-colonoscopy-age-recommendations-6833877', image: '/abstract-slate.svg' },
  { id: 78, title: 'New Mammogram Guidelines', source: 'Verywell Health', url: 'https://www.verywellhealth.com/new-mammogram-guidelines-8642844', image: '/abstract-slate.svg' },
  { id: 79, title: 'The Most Overlooked Aging in Place Upgrade', source: 'The Spruce', url: 'https://www.thespruce.com/the-most-overlooked-aging-in-place-upgrade-11967840', image: '/abstract-slate.svg' },
  { id: 80, title: 'What Is Aging in Place', source: 'Better Homes & Gardens', url: 'https://www.bhg.com/what-is-aging-in-place-11735792', image: '/abstract-slate.svg' },
  { id: 81, title: 'Home Design for Aging in Place', source: 'Better Homes & Gardens', url: 'https://www.bhg.com/home-design-for-aging-in-place-11735782', image: '/abstract-slate.svg' },
  { id: 82, title: 'Prevent Fall Risk in Older Adults (USPSTF Guidelines)', source: 'Verywell Health', url: 'https://www.verywellhealth.com/prevent-fall-risk-in-older-adults-uspstf-8670719', image: '/abstract-slate.svg' },
  { id: 83, title: 'How to Pick the Right Shower Lighting Ideas', source: 'The Spruce', url: 'https://www.thespruce.com/how-to-pick-the-right-shower-lighting-ideas-5214890', image: '/abstract-slate.svg' },
  { id: 84, title: 'Too Cold Outside? Here Are 6 Easy Ways to Stay Active Without Leaving Home', source: 'Real Simple', url: 'https://www.realsimple.com/ways-to-stay-active-at-home-11897354', image: '/athomeexercise-8c66be2605b9466e99b20d830a93ae5b.webp' },
]

router.get('/', (req, res) => {
  res.json(sampleContent)
})

export default router
