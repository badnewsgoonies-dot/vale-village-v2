# Feature Parity Matrix — Design-to-Code Traceability

This matrix maps high-level design features to repository source locations and marks parity status (Present / Partial / Missing). Each row includes a proposed priority lane (P0 = highest).

| Feature | Status | Source locations (representative) | Notes / Gaps | Priority |
|---|---:|---|---|---:|
| Overworld rendering (OverworldV2) | Present | src/ui/components/overworld-v2/OverworldV2.tsx, src/ui/components/overworld-v2/layers/* | Core renderer implemented; verify edge-case camera/culling tests | P0 |
| Battle system (turn queue, actions) | Partial | src/ui/state/battleSlice.ts, src/core/* (battle services) | Core queue exists but some state-leak tests indicate queuedActions cleanup gaps | P0 |
| Inventory & Equipment UI | Present | src/ui/components/* inventory, src/core/items | UI implemented; confirm equipment effect wiring (accessories) | P1 |
| Save/Load & Replay support | Partial | src/core/save/*, save ports | Replay read/write stubs added; needs end-to-end validation | P1 |
| Menu navigation & focus restore | Partial | src/game/menus/MenuStackRouter.ts, src/game/menus/PauseMenu.ts | Stack router present; focus-restore hook exists but lacking deterministic e2e tests | P0 |
| Tower mode & normalization | Present | TOWER_* docs, src/ui/state/towerSlice.ts | Implemented; verify normalization constants and acceptance criteria | P1 |
| Enemy/Unit data & spawn definitions | Present | src/core/data/enemies, ENEMIES registry | Data present; gaps in some accessory interactions noted in audit | P1 |
| Accessories & Equipment definitions | Partial | new_accessories.ts, src/core/items/* | New accessory stubs exist; missing some effect implementations and registry entries | P0 |
| Playwright e2e tests / CI | Partial | tests/e2e/, playwright.config.ts | Stable tests exist; heavy/visual tests gated behind RUN_HEAVY flag — need CI gating review | P1 |
| Documentation / Design bibles | Present | DOCUMENTATION.md, ROADMAP_IMPLEMENTATION.md, CLAUDE.md | Good coverage; some design-to-code anchors missing for accessory mechanics | P2 |

Summary notes:
- Prioritize P0 items that block correctness (battle state leakage, menu focus, accessories wiring).\
- Where "Partial" is indicated, add small, targeted tests and 1-2 small code changes rather than broad rewrites.\
- This matrix is a living artifact; update rows as fixes are implemented.
