# Test plan and local run notes

Local commands:
- Install dependencies: pnpm install
- Run unit tests: pnpm test
- Run e2e tests: pnpm test:e2e
- Run targeted parity tests: pnpm test -- tests/unit/feature_parity*.test.ts --reporter verbose

Dry run executed:
- Command: pnpm test -- tests/unit/feature_parity*.test.ts --reporter verbose
- Summary: Targeted unit tests completed; the parity stubs ran without failures in the local dry run.

Output excerpt from the dry run:

 RUN  v1.6.1 /home/geni/Documents/vale-village-v2

 ✓ tests/unit/parity/battle_state_parity.test.ts  (1 test) 7ms
 ✓ tests/unit/parity/menu_focus_parity.test.ts  (1 test) 14ms
 ✓ tests/unit/parity/accessories_parity.test.ts  (1 test) 15ms
 ✓ tests/unit/parity/save_replay_parity.test.ts  (1 test) 15ms

 Test Files  4 passed (4)
      Tests  4 passed (4)
   Start at  15:04:24
   Duration  6.29s (transform 589ms, setup 2.98s, collect 298ms, tests 51ms, environment 6.29s, prepare 1.96s)

Notes:
- CI workflow added at .github/workflows/test.yml to run unit and e2e tests.
- Next: add real assertions and expand e2e flows for each Partial feature listed in analysis/FEATURE_PARITY_MATRIX.md.

