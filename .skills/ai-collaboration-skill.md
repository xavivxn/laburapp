# AI Collaboration Skill

How AI assistants (Claude, Cursor, Copilot, etc.) should work on Laburapp.

## Before writing code

1. **Read `.skills/skills.md` and the relevant skill file.** Don't infer conventions — they're written down.
2. **Check `MEMORY.md`** if collaborating via Claude Code — it has user/project context that overrides any guess.
3. **Match the feature.** New code goes in an existing feature when it fits. Only create a new feature for distinct domains.

## When making decisions

- **Visual / UX choices** → present 2–4 options with tradeoffs, ask before implementing. Owner validates design before code.
- **Technical choices with one obvious answer** → propose with one-line rationale and proceed.
- **Architectural choices that affect multiple features** → stop, write down the proposed approach, ask. Then update the relevant skill file alongside the implementation.

## Code style

- TypeScript strict, no `any` unless it's a third-party gap and you leave a comment.
- React Server Components by default. `"use client"` only when needed and at the smallest scope.
- Props: explicit interfaces co-located with the component. No prop spreading without typing.
- Comments: only when the *why* is non-obvious. No "// renders the button" noise.
- File length: if a component file passes ~250 lines, split it. Cards, hooks, and helpers extract well.

## What to mock vs build

Phase: dummy. Until told otherwise:

- **Mock** all data — profiles, matches, messages — under `features/<feat>/lib/mock.ts`.
- **Stub** Supabase calls in `features/<feat>/api/*.ts` — they return `Promise.resolve(mockX)` and have a `// TODO(supabase): replace with real query` comment.
- **Build** all UI for real, including loading and empty states, even if the data is mocked.

## What NOT to do

- Don't add a component library (shadcn, MUI, Chakra). Primitives stay in-house.
- Don't introduce a new state library without asking. Local state → context → zustand, in that order.
- Don't write E2E tests yet. Unit tests for pure utils only when they exist.
- Don't add analytics, tracking, or error reporting in the dummy phase.
- Don't optimize prematurely (no `React.memo` everywhere, no `useMemo` for trivial values).

## Reviewing AI-generated changes

Before accepting a change, verify:

- [ ] No raw hex / arbitrary colors — only token references.
- [ ] No fixed/sticky element near a screen edge without `*-safe` padding.
- [ ] Touch targets ≥ 44×44 on mobile.
- [ ] Feature code didn't leak into `app/`.
- [ ] Cross-feature imports go through `shared/` or events, not direct.
- [ ] Strings are in Spanish (Argentine register), not English.
- [ ] `prefers-reduced-motion` honored if motion was added.
- [ ] No `any`, no console.logs, no TODOs without context.

## Prompt patterns that work well here

- "Add screen X following architecture-skill.md and using tokens from ux-skill.md."
- "Refactor to feature-based — anything in `app/` that's logic-heavy moves to `features/<x>/`."
- "Audit responsive: list every fixed/sticky element and confirm safe-area handling."
- "Propose 3 layouts for screen X at mobile/tablet/desktop, with tradeoffs. Don't code yet."

## Updating these skill files

When you make a non-obvious decision, update the relevant skill file in the **same change** as the code. The skill file is the durable artifact; the code is just an instance of it.
