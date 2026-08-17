// Maps each content brand name to its logo asset under public/logos/
// (client/public/logos/<brand-slug>/...). Used everywhere content shows
// its source (ContentCard, ContentModal, HabitChat's card, WhyCarousel)
// to render the brand's actual logo in place of the plain uppercase
// brand-name label, at small size.
//
// Per-brand folder contents are inconsistent — some use a "Fill=" key,
// others "fill=" or "Color="; some offer a horiz/stacked layout choice,
// most don't. Because of that this is a hand-picked filename per brand,
// not a programmatic lookup. Color fill is used wherever a color asset
// exists, per an explicit choice to prioritize brand accuracy over a
// fully uniform look; Byrdie, Martha Stewart, and The Spruce only ship
// black/white assets, so those fall back to black (readable against this
// app's light backgrounds) rather than being left without a logo. If a
// fully monochrome/all-black look is wanted instead later, swap every
// entry below to its black variant (all brands have one).
const RAW_PATHS = {
  Allrecipes: '/logos/allrecipes/Fill=color.svg',
  Byrdie: '/logos/byrdie/fill=black.svg',
  EatingWell: '/logos/eating-well/Layout=horiz, Fill=color.svg',
  'Food & Wine': '/logos/food-wine/Layout=horiz, Fill=color.svg',
  Health: '/logos/health/Fill=color.svg',
  'Martha Stewart': '/logos/martha-stewart/Layout=horiz, Fill=black.svg',
  Parents: '/logos/parents/Fill=color, Layout=horiz.svg',
  // Added for the Today page's lead story. "solid, Fill=color" is People's
  // primary lockup; the white variant exists too, but every other entry here
  // is the color one and these logos are rendered on light card chrome as
  // well as over photos.
  People: '/logos/people/Style=solid, Fill=color.svg',
  'People Inc.': '/logos/people-inc/fill=black yellow dot.svg',
  'Real Simple': '/logos/real-simple/Color=color, Layout=horiz.svg',
  'Simply Recipes': '/logos/simply-recipes/Fill=color.svg',
  'The Spruce': '/logos/the-spruce/fill=black.svg',
  'Verywell Health': '/logos/verywell-health/Fill=color.svg',
  'Verywell Mind': '/logos/verywell-mind/Fill=color.svg',
}

// encodeURI leaves "=" and "," untouched and only escapes the literal
// spaces in these filenames (to %20) — exactly what a valid <img src>
// pointing at one of these public/ assets needs.
export const BRAND_LOGOS = Object.fromEntries(
  Object.entries(RAW_PATHS).map(([brand, path]) => [brand, encodeURI(path)]),
)

export function getBrandLogo(brand) {
  return BRAND_LOGOS[brand] || null
}
