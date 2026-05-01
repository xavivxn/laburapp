# Architecture Skill — Feature-Based

Laburapp uses **feature-based architecture**. Code is organized by domain capability, not by technical layer. This scales better than layered (`/components`, `/hooks`, `/utils`) once features grow.

## Top-level layout

```
src/
├── app/                          # Next.js App Router — ROUTING ONLY
│   ├── (auth)/
│   │   └── login/page.tsx        # imports from features/auth
│   ├── (main)/
│   │   ├── layout.tsx            # AppShell wrapper
│   │   ├── discover/page.tsx     # imports from features/swipe-deck
│   │   ├── matches/page.tsx
│   │   ├── messages/page.tsx
│   │   └── profile/page.tsx
│   ├── layout.tsx                # root layout, fonts, theme provider
│   └── page.tsx                  # landing → redirect
│
├── features/                     # DOMAIN FEATURES
│   ├── auth/
│   │   ├── components/           # LoginForm, RoleSwitcher, etc.
│   │   ├── hooks/                # useAuth, useSession
│   │   ├── api/                  # supabase calls (stubbed for now)
│   │   ├── lib/                  # mock data, validators
│   │   ├── types.ts
│   │   └── index.ts              # public API of the feature
│   │
│   ├── profiles/                 # user profiles (employee + employer view)
│   ├── swipe-deck/               # discover screen, card stack, gestures
│   ├── matches/                  # mutual interests
│   └── messaging/                # chat (later)
│
├── shared/                       # CROSS-FEATURE PRIMITIVES
│   ├── components/
│   │   ├── ui/                   # Button, Card, Avatar, Input, Badge, Sheet
│   │   └── layout/               # AppShell, BottomNav, Sidebar, ThemeToggle
│   ├── hooks/                    # useTheme, useMediaQuery, useSafeArea
│   ├── lib/
│   │   ├── supabase/             # client + server factories
│   │   ├── cn.ts                 # className helper
│   │   └── format.ts             # currency, date, etc.
│   └── styles/
│       └── globals.css
│
└── config/
    ├── site.ts                   # name, URLs, social
    └── nav.ts                    # nav items config
```

## Rules

### Rule 1 — `app/` is for routing only

Page files (`page.tsx`, `layout.tsx`) are thin. They import the actual screen from a feature and render it.

```tsx
// app/(main)/discover/page.tsx ✅
import { DiscoverScreen } from "@/features/swipe-deck";
export default function Page() {
  return <DiscoverScreen />;
}
```

```tsx
// app/(main)/discover/page.tsx ❌
// 200 lines of JSX, hooks, fetch logic, etc.
```

### Rule 2 — Feature internals are private

Anything under `features/<feat>/` is internal **except what's exported from `index.ts`**. Other features and `app/` only import via the barrel.

```ts
// features/swipe-deck/index.ts
export { DiscoverScreen } from "./components/DiscoverScreen";
export type { Profile } from "./types";
```

This keeps refactors local and prevents tangled cross-feature imports.

### Rule 3 — Cross-feature deps go through `shared/` or events

If feature A needs feature B's logic, the answer is usually:

- **Move it to `shared/`** if it's truly generic (a `Button`, a `formatCurrency`).
- **Lift it to a parent route/layout** if it's composition (e.g., AppShell renders both).
- **Use an event/store** (zustand) if it's coordination (e.g., "user changed role" → multiple features react).

Direct `features/A` → `features/B` imports are a smell. Refactor instead.

### Rule 4 — `shared/components/ui/` has no business logic

Primitives are dumb. They take props, render JSX, expose variants. No data fetching, no feature-specific logic. If a component knows what a "match" is, it belongs in `features/matches/`, not in `ui/`.

### Rule 5 — Naming

- Components: `PascalCase.tsx` (`SwipeCard.tsx`).
- Hooks: `useThing.ts` (camelCase, `use` prefix).
- Non-component utilities: `kebab-case.ts` (`format-date.ts`).
- Types files: `types.ts` per feature, no `*.types.ts` suffix.

### Rule 6 — `index.ts` barrel only at the feature root

Don't sprinkle `index.ts` inside `features/<feat>/components/`. One barrel per feature, at its root. This avoids circular imports and keeps the public API explicit.

### Rule 7 — Co-locate tests

When tests arrive: `SwipeCard.tsx` ↔ `SwipeCard.test.tsx` next to each other. No top-level `__tests__/`.

## Imports & path aliases

`tsconfig.json` defines `@/*` → `src/*`. Always use it.

```ts
import { Button } from "@/shared/components/ui/button"; // ✅
import { Button } from "../../../shared/components/ui/button"; // ❌
```

## When to create a new feature

Create `features/<new>/` when:

- It has its own routes or screens, OR
- It owns a domain concept (matches, messages, payments) the others reference, OR
- More than one screen needs the same set of components/hooks.

Don't create one for a single component. Put it in the closest existing feature, or in `shared/components/ui/` if generic.

## Server vs client components

- Default to **Server Components**. Add `"use client"` only when you need state, effects, refs, browser APIs, or animation libs.
- Swipe deck, theme toggle, forms → client. Static lists, layouts → server.
- Don't pass non-serializable props (functions, class instances) from server to client unless the receiver is a client component handling them.

## Supabase (when wired)

- `shared/lib/supabase/client.ts` — browser client.
- `shared/lib/supabase/server.ts` — Server Component / Route Handler client (uses `cookies()` from `next/headers`).
- Each feature's `api/` file imports from there. Never instantiate Supabase clients inside components.
