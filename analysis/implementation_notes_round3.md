Round 3 — Quick Technical Debt Scan
===================================

Date: 2026-01-11T22:32:25Z

Summary
-------
This note records the results of a rapid scan for state slices, core modules, and TODO/FIXME/magic markers to inform the "Polish & Refactor" objective (remove magic numbers, avoid reflection-based private access, replace hardcoded arrays with dynamic loaders).

What was found
---------------
- State slices: many files under src/ui/state (battleSlice, towerSlice, overworldSlice, inventorySlice, teamSlice, storySlice, etc.). These are natural targets for API-cleanup and extracting constants used by UI logic.
- Core modules: src/core contains algorithms, services, models, constants (src/core/constants.ts), and config; good centralization exists for many game-wide values.
- Markers (TODO/FIXME/magic) were found in a variety of places including data/definitions, UI components, and core algorithms (example files surfaced by grep include src/data/definitions/*, src/ui/components/overworld/layers/InteriorFurnitureLayer.ts, src/core/algorithms/*, src/core/constants.ts, and src/constants/game.ts).

Recommendations (first small steps)
----------------------------------
1) Create an automated scan to enumerate numeric literals and inline arrays (JSON report). Prioritize by location: (a) balance/algorithm files, (b) UI/layout files, (c) data/definitions.
2) Extract the top 10 high-risk numeric literals into existing constants files (src/core/constants.ts or src/constants/game.ts) in a single small PR.
3) Audit state slices for any places using reflection/private access and add explicit public getters where needed.
4) Replace inline arrays used as authoritative data with imports from data/definitions modules.

Next concrete action
--------------------
- Implement the automated scan (simple Node/TS or grep+jq script) to produce a JSON of numeric literal locations and large inline arrays; attach report to this lane and open PR to extract constants for the top items.

Risk
----
- Some numeric literals are balance-tuning values and require designer sign-off before adjustment.

Lesson
------
- Centralized constants files already exist; prefer them as targets to reduce duplication when extracting values.
