# UX Skill — Design System

Single source of truth for visual language. **Never** introduce a hex value or font outside this document — extend tokens here first.

## Palette — Indigo + Lime

Differentiates from competitor (#375BE5 pure blue) by going deeper indigo + adding lime as the "match/positive action" accent.

### Core tokens

| Role | Light | Dark | Tailwind alias |
|---|---|---|---|
| `--color-primary` | `#4F46E5` indigo-600 | `#818CF8` indigo-400 | `primary` |
| `--color-primary-hover` | `#4338CA` indigo-700 | `#A5B4FC` indigo-300 | `primary-hover` |
| `--color-primary-foreground` | `#FFFFFF` | `#0A0A0F` | `primary-foreground` |
| `--color-accent` | `#84CC16` lime-500 | `#A3E635` lime-400 | `accent` |
| `--color-accent-hover` | `#65A30D` lime-600 | `#BEF264` lime-300 | `accent-hover` |
| `--color-accent-foreground` | `#1A2E05` | `#0A0A0F` | `accent-foreground` |
| `--color-background` | `#FFFFFF` | `#0A0A0F` | `background` |
| `--color-surface` | `#FAFAFA` | `#18181B` | `surface` |
| `--color-surface-elevated` | `#F4F4F5` | `#27272A` | `surface-elevated` |
| `--color-border` | `#E4E4E7` | `#3F3F46` | `border` |
| `--color-foreground` | `#18181B` | `#FAFAFA` | `foreground` |
| `--color-muted` | `#71717A` | `#A1A1AA` | `muted` |

### Semantic tokens

| Role | Light | Dark |
|---|---|---|
| `--color-success` | `#10B981` | `#34D399` |
| `--color-warning` | `#F59E0B` | `#FBBF24` |
| `--color-danger` | `#EF4444` | `#F87171` |
| `--color-info` | indigo-500 `#6366F1` | indigo-300 `#A5B4FC` |

### Action semantics in the swipe deck

- **Pass / dismiss** → `danger` color, X icon, swipe-left.
- **Match / interesado** → `accent` (lime), check or heart-handshake icon, swipe-right.
- **Super interesado / urgente** → `primary` (indigo), star icon, swipe-up.

## Typography

- **Font family:** `Inter` (UI + body), `Plus Jakarta Sans` optional for hero/display headings.
- Both loaded via `next/font/google` with `display: swap` and `subset: ["latin"]`.
- Variable fonts; weights used: 400, 500, 600, 700, 800.

### Scale (Tailwind defaults are fine)

| Token | Size / Line height | Use |
|---|---|---|
| `text-xs` | 12 / 16 | meta, captions |
| `text-sm` | 14 / 20 | secondary body |
| `text-base` | 16 / 24 | body default |
| `text-lg` | 18 / 28 | card titles |
| `text-xl` | 20 / 28 | section headings |
| `text-2xl` | 24 / 32 | screen titles |
| `text-3xl` | 30 / 36 | hero subtitle |
| `text-4xl` | 36 / 40 | hero title |

**Rule:** body copy never below 14px on mobile.

## Spacing & layout

- Base unit: 4px (Tailwind default scale).
- Screen horizontal padding: `px-4` (16px) on mobile, `px-6` (24px) ≥ tablet, `px-8` (32px) ≥ desktop.
- Section vertical rhythm: `space-y-6` for stacked cards, `space-y-4` inside cards.

## Radii

| Element | Radius | Class |
|---|---|---|
| Profile cards (swipe deck) | 24px | `rounded-3xl` |
| Standard cards / modals | 16px | `rounded-2xl` |
| Inputs / chips | 12px | `rounded-xl` |
| Buttons (primary CTA) | full | `rounded-full` |
| Avatars | full | `rounded-full` |
| Small buttons / tags | 8px | `rounded-lg` |

Native-app feel comes from generous radii — don't go below `rounded-lg` on interactive elements.

## Elevation (shadows)

- `shadow-sm` for resting cards.
- `shadow-lg` for the active swipe card.
- `shadow-xl` for sheets / modals.
- In dark mode, shadows are mostly invisible — rely on `surface-elevated` for separation instead.

## Motion

- Use `framer-motion` for: swipe gestures, sheet open/close, route transitions.
- Default durations: 150ms (micro), 250ms (transitions), 400ms (sheets).
- Easing: `[0.22, 1, 0.36, 1]` for entry, `[0.4, 0, 1, 1]` for exit.
- Respect `prefers-reduced-motion` — disable transforms, keep opacity fades.

## Light / Dark mode

- Strategy: Tailwind `class="dark"` on `<html>`.
- Persistence: `localStorage` key `laburapp:theme` with values `light | dark | system`.
- Default: `system` (reads `prefers-color-scheme`).
- Theme toggle lives in `shared/components/layout/ThemeToggle.tsx` and is exposed via `shared/hooks/useTheme.ts`.
- All tokens above are defined as CSS variables under `:root` and `.dark` in `src/shared/styles/globals.css`.

## Iconography

- Library: `lucide-react`.
- Default size: 20px in nav, 24px in cards, 16px inline.
- Stroke width: 2 (default).
- Color: inherit `currentColor`.

## Imagery

- Profile photos: 1:1, `rounded-full` for avatars, `rounded-3xl` cropped covers in swipe cards.
- Empty states: use `lucide-react` icons sized 48–64px in `text-muted` color, never raster illustrations in v1.

## A11y baselines

- WCAG AA contrast on all token pairs (verified for light + dark).
- Focus ring: `outline-2 outline-offset-2 outline-primary`.
- Always pair color with another cue (icon, text) for status — never color alone.
