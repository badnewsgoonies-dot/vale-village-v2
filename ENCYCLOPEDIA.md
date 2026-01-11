# Vale Village — Master Encyclopedia Index

Purpose: single AI-consumable index that maps canonical encyclopedia pages, gives a terse architectural summary, and provides retrieval-ready tags for context systems.

---

## Master Table of Contents (canonical files)

- [Overview / Index](docs/encyclopedia/INDEX.md)
- [Architecture (high-level)](docs/encyclopedia/ARCHITECTURE.md)
- [UI Architecture & OverworldV2](docs/encyclopedia/ui_architecture.md)
- [Core Domain & State (Zustand)](docs/encyclopedia/core_and_state.md)
- [Entry Points (app bootstrap)](docs/encyclopedia/ENTRY_POINTS.md)
- [State Reference (slices & shape)](docs/encyclopedia/STATE.md)
- [Interfaces & Types](docs/encyclopedia/INTERFACES.md)
- [Patterns (common project patterns)](docs/encyclopedia/PATTERNS.md)
- [Gotchas & Known Issues](docs/encyclopedia/GOTCHAS.md)
- [Dependencies (package.json summary)](docs/encyclopedia/DEPENDENCIES.md)
- [Testing & Tooling (canonical)](docs/encyclopedia/testing_and_tooling.md)

---

## High-level Architectural Summary (dense)

- Purpose: Vale Village v2 is a Preact-based port of a JRPG engine; separation of concerns is by "core" (game logic), "ui" (rendering + components), "game" (scenes & systems), and "data/infra" (assets, loaders, tooling).
- Entrypoint: app bootstrap -> App component -> router -> scene manager; see ENTRY_POINTS.md for exact files and short code excerpts.
- State: single-source-of-truth via Zustand slices under src/ui/state; slices expose actions/selectors used by components — see core_and_state.md and STATE.md for slice contracts and invariants.
- Rendering: OverworldV2 is the live overworld renderer (src/ui/components/overworld-v2). It uses layered canvases and deterministic render passes; component-store mappings documented in ui_architecture.md.
- Core models & algorithms: pure JS/TS domain code lives in src/core; algorithms (pathfinding, animation timing, battle resolution helpers) are documented in core_and_state.md.
- Patterns: service files, adapter patterns, and state synchronization rules are in PATTERNS.md; prefer explicit action APIs and small, testable pure functions.

---

## AI Retrieval Guidance (for context systems)

- Use short canonical tokens when searching: "VV2::INDEX", "VV2::ARCH", "VV2::UI", "VV2::STATE", "VV2::ENTRY".
- Prioritize files in docs/encyclopedia as authoritative; INDEX.md is the root pointer.
- For architecture questions, first consult ARCHITECTURE.md and ui_architecture.md, then STATE.md for state-shape and core_and_state.md for algorithms.

---

## Final summary (decision + next action)

Decision: docs/encyclopedia/ is canonical; ENCYCLOPEDIA.md is an AI-friendly single entrypoint that links canonical files and provides condensed architecture facts.
Next action: keep INDEX.md updated with any new encyclopedia pages and update ENCYCLOPEDIA.md only if canonical layout changes.

---

Tags: VV2, encyclopedia, architecture, ui, overworldv2, state, zustand, entrypoints

Rounds 1-5 Review: documentation validated and canonicalized. No code edits were performed in this lane (lane constraints); recommended follow-ups recorded: extract DOM-overlay offsets and runtime constants into named constants in source, and run a repository-wide selector grep to exhaustively map component -> store selectors. Create follow-up tasks for implementation and testing.

