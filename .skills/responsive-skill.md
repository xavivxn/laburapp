# Responsive Skill — Mobile, Tablet, Desktop, PWA

Laburapp is mobile-first but must feel right on tablets and desktops. **Always design 375px first**, then enhance.

## Breakpoints (Tailwind defaults)

| Name | Min width | Target |
|---|---|---|
| (default) | 0px | small Android phones, iPhone SE |
| `sm` | 640px | large phones landscape, small tablets portrait |
| `md` | 768px | tablets portrait (iPad mini/Air) |
| `lg` | 1024px | tablets landscape, small laptops |
| `xl` | 1280px | desktop |
| `2xl` | 1536px | large desktop |

## Layout adaptation

| Region | Mobile (<md) | Tablet (md–lg) | Desktop (≥lg) |
|---|---|---|---|
| Primary nav | Bottom tab bar (5 items max) | Bottom tab bar | Left sidebar (collapsible) |
| Header | Sticky top, minimal | Sticky top with title + actions | Top bar inside main content |
| Swipe deck | Full-width card stack | Centered, max-width 480px | Centered, max-width 480px, side panels for filters/details |
| Forms | Single column, full-width inputs | Single column, max-width 480px | Two-column where it makes sense |

## Safe areas (CRITICAL)

PWAs installed on iOS and Android sit under the status bar / home indicator / gesture bar. Without safe-area padding, content gets clipped or buttons become untappable.

### Setup

1. `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` in root layout. The `viewport-fit=cover` is what unlocks `env(safe-area-inset-*)`.
2. Tailwind v4 utilities (defined in `globals.css` as `@theme` extensions):
   - `pt-safe` → `padding-top: env(safe-area-inset-top, 0px)`
   - `pb-safe` → `padding-bottom: env(safe-area-inset-bottom, 0px)`
   - `pl-safe`, `pr-safe`
   - `min-h-dvh` for full-height screens (uses dynamic viewport — handles mobile browser chrome).

### Where to apply

| Element | Required padding |
|---|---|
| Top app header (sticky) | `pt-safe` |
| Bottom tab bar (fixed) | `pb-safe` |
| Floating action buttons near edges | `pb-safe` + `pr-safe` |
| Modals / bottom sheets | `pb-safe` on the action row |
| Fullscreen overlays | all four `*-safe` |

**Rule:** any fixed/sticky element that touches a screen edge → safe-area utility, no exceptions.

### iOS specifics

- Status bar visible by default unless `display: standalone` PWA → still need `pt-safe` (notch).
- Home indicator on Face ID devices reserves ~34px at the bottom → `pb-safe` is non-negotiable on the tab bar.
- Avoid 100vh — use 100dvh / `min-h-dvh`. iOS Safari miscounts vh during scroll.

### Android specifics

- Gesture navigation reserves ~24px at bottom on most devices → same `pb-safe`.
- 3-button nav bar is taller; `env(safe-area-inset-bottom)` reports it correctly.
- Status bar color: set via `<meta name="theme-color">` and update on theme change. Two entries: one for light, one for dark, with `media="(prefers-color-scheme: ...)"`.

## Touch targets & gestures

- Minimum hit area: **44×44 px** (WCAG 2.5.5, Apple HIG). Use `min-h-11 min-w-11` (44px) on icon-only buttons.
- Gap between adjacent tappable elements: ≥ 8px.
- Swipe deck gestures (framer-motion):
  - Horizontal drag threshold: 100px or 0.5 velocity → fire pass/match.
  - Vertical drag up: 80px → fire super-interest.
  - Always animate the card off-screen on commit, then unmount.
- No hover-only interactions — everything must work on touch.

## PWA

- `public/manifest.json` with `display: standalone`, `theme_color` (token-aligned), `background_color`, icons (192, 512, maskable).
- Icons live in `public/icons/`. Maskable icon has 10% safe padding inside the 512px canvas.
- Service worker via `next-pwa` (or `@serwist/next` if next-pwa lags Next 15) — register only in production.
- Offline strategy v1: cache app shell (HTML, JS, CSS, fonts), network-first for API. No offline writes.
- Install prompt: don't auto-show. Add a small "Instalar app" entry in profile menu after first visit.

## Image performance

- Use `next/image` everywhere. Set `sizes` honestly to avoid downloading 2000px on a 375px viewport.
- Profile photos: serve at 2x of display size, `quality={80}`.
- Avatars in lists: `sizes="48px"`.

## Testing matrix (manual, before merging significant UI)

- iPhone 13/14 (375×844) — notch + home indicator.
- iPhone SE (375×667) — small viewport, no notch.
- Pixel 7 (412×915) — Android gestures.
- iPad Mini (768×1024) — tablet portrait.
- Desktop 1280×800.

If you can't test on a device, use Chrome DevTools device toolbar with `viewport-fit=cover` simulated.
