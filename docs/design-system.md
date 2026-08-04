# Design system reference (Health.com)

Branding and visual design for Vitalist will be finalized later, based on this
Figma file: https://www.figma.com/design/vNcLIOeTecg7QL2sElBba4/Health.com-Design-System

Notes below are pulled directly from that file (as of July 2026) so the tokens
are on hand once we're ready to apply them. Nothing in the current scaffold
uses these yet — `client/src/index.css` still has placeholder styles.

## Color palette

Guidance from the file: vibrant, optimistic, approachable — limit palettes to
two colors per composition.

### Brand colors

| Name | Hex | Role |
|---|---|---|
| Leaf | `#1BBC3C` | Primary brand color |
| Green Apple | `#E8EF65` | Secondary |
| Seaweed | `#004620` | Tertiary |

### Supporting colors — bright

Bold accents/highlights; limit to two per composition where possible.

| Name | Hex |
|---|---|
| Mineral Blue | `#00B9E2` |
| Plum | `#B676E7` |
| Guava | `#FF9CFF` |
| Watermelon | `#EF2673` |
| Tangerine | `#FF8C2F` |
| Blueberry | `#0053E2` |

### Supporting colors — light

Backgrounds; Coconut is the primary foundation across most layouts.

| Name | Hex |
|---|---|
| Coconut | `#FFFDF5` |
| Light Pink | `#FFDCED` |
| Vanilla | `#FCFFBC` |
| Cornflower | `#DEF9FF` |

## Typography

- **Headings — Poppins Bold**: geometric display typeface for headlines, titles, category labels. Scale: Display 72px, H1 48px, H2 36px, H3 28px, H4 22px, H5 18px.
- **Body — DM Sans**: primary body typeface (Regular for body copy, Medium for labels/UI). Scale: Large 18px, Base 16px, Small 14px, Caption 12px, Label Large 14px/Medium, Label Base 12px/Medium.

## Next steps (when branding work starts)

- Pull exact component specs (buttons, cards, form inputs) from the Figma file — only colors and type were defined as of this writing.
- Translate tokens into CSS variables / Tailwind theme config in `client/`.
- Re-check the Figma file for updates before implementing, since it's dated July 2026 and may evolve.
