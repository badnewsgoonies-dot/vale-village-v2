TESTING.md

Overview

This document explains how to run the project's test suites and gives a brief directory overview to help contributors find tests.

How to run Unit Tests

- Install dependencies:
  - pnpm install
- Run the unit tests (Vitest):
  - pnpm test
- Run tests in watch mode during development:
  - pnpm test:watch
- Run test coverage:
  - pnpm test:coverage
- Type checking (useful to run with tests):
  - pnpm typecheck

How to run E2E Tests (Playwright)

- Playwright-based end-to-end tests are located under tests/e2e/ and use Playwright fixtures and the project's Playwright config.
- Ensure dependencies are installed and Playwright browsers are installed (first-time setup):
  - pnpm install
  - npx playwright install --with-deps
- Run the full E2E suite:
  - pnpm test:e2e
- Run E2E headed (opens browser windows):
  - pnpm test:e2e:headed
- Run specific E2E tests or presets (examples):
  - pnpm test:e2e:journey      # run a single journey spec
  - pnpm test:e2e:tower        # run the tower-focused suite in headed mode
  - DEMO_MODE=true pnpm test:e2e:demo  # run demo scenario in headed demo mode
- Run unit + e2e sequentially (canonical):
  - pnpm test:all

Directory overview (brief)

- src/
  - core/            -> Game logic, models, algorithms (combat, leveling, tower rules)
  - ui/components/   -> Preact components (OverworldV2, UI layers, menus)
  - ui/state/        -> Zustand slices (battleSlice, towerSlice, gameFlow, etc.)
  - main.tsx         -> Application entry
- tests/
  - e2e/             -> Playwright end-to-end tests (gameplay scenarios, tower runs)
  - (unit tests live adjacent to code using .spec.ts or under tests/unit)
- docs/              -> Design notes, audits, and developer-facing documentation

Best practices

- Prefer pnpm for running scripts (pnpm is the repo's package manager). Use the script aliases in package.json.
- Keep tests deterministic: avoid relying on timing-sensitive assertions; use stable selectors and seedable game state when possible.
- E2E tests may need DEMO_MODE or other environment variables to run in a deterministic, faster mode - see tests/e2e/* for examples.

Troubleshooting

- If Playwright tests fail due to missing browsers, run:
  - npx playwright install
- If CI runner is flaky, try running the tests locally in headed mode to observe failures:
  - pnpm test:e2e:headed

Contact

If tests or scripts are unclear, open an issue or contact the core maintainers in the repo.
