# Laburapp — Skills Index

This folder is the **source of truth** for how Laburapp is built. Every AI session and every contributor reads from here before touching code. If you make a non-obvious decision while coding, update the relevant skill file in the same change.

## Files

| Skill | Purpose |
|---|---|
| [ux-skill.md](./ux-skill.md) | Design tokens, palette (Indigo + Lime), typography, spacing, radii, light/dark mode, motion |
| [responsive-skill.md](./responsive-skill.md) | Breakpoints, safe-area handling (iOS notch, Android nav bar), gestures, PWA installability, touch targets |
| [architecture-skill.md](./architecture-skill.md) | Feature-based folder layout, what goes in `features/` vs `shared/` vs `app/`, naming, boundaries |
| [ai-collaboration-skill.md](./ai-collaboration-skill.md) | How to collaborate with AI assistants on this codebase (prompts, conventions, what NOT to ask) |
| [deploy-skill.md](./deploy-skill.md) | Vercel deploy paths (GitHub vs CLI), env vars, troubleshooting |
| [supabase-skill.md](./supabase-skill.md) | Project setup, schema, RLS policies, client conventions |

## Golden rules (read first)

1. **Feature-based.** Code lives under `src/features/<feature>/`. The `app/` folder is for routing only.
2. **No raw hex.** Use design tokens from `globals.css` (`--color-primary`, `--color-accent`, etc.) or Tailwind utilities mapped to them.
3. **Mobile-first.** Every screen is designed for 375px width first, then enhanced for tablet/desktop.
4. **Safe areas always.** Any fixed/sticky element that touches a screen edge must use `env(safe-area-inset-*)` padding. See `responsive-skill.md`.
5. **Touch targets ≥ 44×44px.** Every interactive element on mobile.
6. **Dummy until told otherwise.** No real Supabase calls in this phase. Mock data lives in `features/<feat>/lib/mock.ts`.
7. **Update the skill.** If you decide something architectural, write it down here in the same PR.

## Tech baseline

- **Framework:** Next.js 15, App Router, TypeScript strict.
- **Styling:** Tailwind CSS v4 with CSS variables for tokens.
- **UI primitives:** built in-house under `shared/components/ui/`. No external component library.
- **Icons:** `lucide-react`.
- **Motion:** `framer-motion` (swipe gestures, transitions).
- **State:** local state by default; `zustand` for cross-feature state when needed.
- **Forms:** `react-hook-form` + `zod` (when forms appear).
- **Backend:** Supabase (`@supabase/ssr` + `@supabase/supabase-js`) — client configured, calls stubbed.
- **Hosting:** Vercel.

## Out of scope (for now)

- Real authentication, real DB writes, real-time channels.
- i18n (Spanish-only for v1).
- Payments, KYC, identity verification.
