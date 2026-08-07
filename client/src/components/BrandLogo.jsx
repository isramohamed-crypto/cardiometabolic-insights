import { getBrandLogo } from '../domain/brandLogos.js'

// Renders a brand's logo image in place of its plain text name — small
// and inline, replacing the uppercase caption label every content
// surface (ContentCard, ContentModal, HabitChat's card, WhyCarousel)
// used to show on its own. Falls back to the plain text label for any
// brand not in BRAND_LOGOS, so an unmapped/future brand never just
// disappears. `className` is applied to whichever element actually
// renders (img or the text fallback's span) so each caller's existing
// CSS keeps controlling size/spacing without this component needing to
// know about every surface's layout.
function BrandLogo({ brand, className }) {
  if (!brand) return null
  const src = getBrandLogo(brand)
  if (!src) return <span className={className}>{brand}</span>
  return <img className={className} src={src} alt={brand} />
}

export default BrandLogo
