Battle Screen — Quick Run & Capture Guide

Purpose

This short README lists commands and guidance to run the battle UI end-to-end tests and the battle UI capture script used for obtaining screenshots. It complements docs/compendium/battle-screen.md (component map and investigation).

Quick prerequisites

- Start the dev server from repo root (in one terminal):
  - pnpm dev
  - (or) npm run dev

- Playwright is installed as a dev dependency; tests and scripts assume the app is served at http://localhost:5173.

Run full E2E test suite

- pnpm test:e2e
- npm run test:e2e

Run specific capture script (recommended when collecting screenshots for UI review)

- Ensure dev server is running.
- Run the capture script directly with Playwright:
  - npx playwright test scripts/capture-battle-ui.ts

Notes & locations

- Screenshots produced by the capture script are written to: ./screenshots/battle-ui (see scripts/capture-battle-ui.ts)
- Key source locations referenced by the compendium:
  - src/ui/components/battle — main battle components (LayoutBattle, QueueBattleView, Battlefield, etc.)
  - src/ui/state — battleSlice, queueBattleSlice
  - src/core/validation — battleStateInvariants.ts (strict runtime invariants)
  - scripts/capture-battle-ui.ts — Playwright capture script (contains run example in header comment)

Engineering guidance

- Preserve deterministic RNG streams used by the queue engine (createRNGStream) when modifying battle execution logic; do not replace them with non-deterministic RNG.
- Respect battleStateInvariants when changing UI-driven state updates; run unit tests in tests/unit/validation if invariants change.
- If capture scripts are flaky, capture a short failure log and attach sample screenshots to a follow-up issue.

Suggested next steps

1. Add small README snippets to other battle scripts (tower-battle-screenshot, tower-battle-test) if they exist and lack run instructions.
2. Add the short diagram mapping state sources to UI consumers into docs/compendium/battle-screen.md for onboarding.

