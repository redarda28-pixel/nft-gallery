# Design Brief: صورة NFT Gallery

## Aesthetic
Gallery / editorial: refined minimalism with artifact-frame styling. Dark mode celebrates NFT culture with gallery-wall white space.

## Palette
| Token | OKLCH | Purpose |
|-------|-------|----------|
| Background | 0.12 0 0 | Deep charcoal wall |
| Card | 0.18 0 0 | Elevated surface |
| Primary | 0.5 0.2 274 | Indigo accent, buttons, focus |
| Secondary | 0.95 0.01 80 | Cream, gallery-print warmth |
| Accent | 0.55 0.18 340 | Magenta, active/highlighted states |
| Foreground | 0.95 0 0 | Off-white text |
| Muted | 0.25 0.02 260 | Cool grey, subtle text |
| Border | 0.2 0.02 260 | Thin 1px frame lines |

## Typography
| Tier | Font | Usage |
|------|------|-------|
| Display | Figtree | Page titles, NFT names, hero |
| Body | General Sans | Copy, descriptions, UI labels |
| Mono | Geist Mono | Metadata, addresses, technical |

## Structural Zones
| Zone | Treatment |
|------|----------|
| Header | Minimal, border-b frame line |
| Navigation | Clean links, secondary accent |
| Gallery Grid | Card-based 3-col responsive |
| NFT Cards | 1px borders, subtle frame shadow |
| Detail View | Full-width image, metadata in muted |
| Footer | Border-t, intentional spacing |

## Shape Language
Border-radius: `0.5rem` for cards. Thin 1px borders emphasize artifact framing. Shadows: gallery (deep) for elevation, frame (subtle) for cards.

## Custom Utilities
- `.shadow-gallery`: Deep shadow for hero/featured
- `.shadow-frame`: Subtle shadow for cards
- `.border-frame`: 1px semantic border
- `.glass-card`: Translucent card (95% opacity, 8px blur)

## Spacing & Rhythm
Vertical rhythm: 24px base grid. Header/footer: 16px padding. Cards: 12px gap. Typography line-height: 1.5 body, 1.2 display.

## Motion
Transition default: 0.3s cubic-bezier(0.4, 0, 0.2, 1). Hover states on cards: scale 1.02, shadow lift.

## Responsive
Mobile-first: sm (640px), md (768px), lg (1024px). Gallery: 1-col mobile, 2-col tablet, 3-col desktop.

## Constraints
No gradients. Flat color + depth through layers. No emoji. Borders always 1px. Shadows serve depth only.
