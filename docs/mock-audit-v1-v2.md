# Vale Village Mock Audit (v1 → v2)

This document consolidates a subagent-style audit of all mock-related assets in the original `vale-village` repo and contrasts them with what exists in `vale-village-v2`.

## 1. Scope

- **Included:** HTML mocks, mock CSS, sprite maps, sprite tools, storyboard/screenshot tooling, and any mock-related tests/assets.
- **Compared:** Presence/absence and role of similar artifacts in `vale-village-v2`.
- **Goal:** Preserve design intent and identify where v2 is missing explicit mock coverage.

---

## 2. High-Level Summary

- v1 contains a **large, rich suite of HTML mocks** that cover battle, overworld, menus, djinn, rewards, and more, plus **sprite maps** and **mock infrastructure** (scripts, prompts).
- v2 currently relies mostly on **runtime UI + a few E2E visual snapshots**, with **far fewer standalone mocks** visible in the tree.
- Design details like **battle queue visualization, target selection affordances, living village feel, and celebration UX** are captured explicitly in v1 mocks but are only implicit (or missing) in v2.

A concrete TODO table for agents/subagents is provided at the end.

---

## 3. v1 Mock Assets – Detailed Audit

### 3.1 Battle & Combat UX Mocks

**Core battle screens and flows**

- `mockups/battle-screen.html`  
  - **Purpose:** Early battle layout – hero/enemy placement, HP/MP areas, and main command UI.  
  - **Signal:** Establishes base composition and information hierarchy.

- `mockups/battle-screen-mockup.html`  
  - **Purpose:** Polished battle screen mock; closer to intended shipped layout.  
  - **Signal:** Higher-fidelity framing, closer to final art and UI density.

- `mockups/battle-transition.html`  
  - **Purpose:** Isolated prototype of battle transition (camera change, effects).  
  - **Signal:** Timing/feel of entering battle, separate from engine.

- `mockups/rewards-screen.html`  
  - **Purpose:** Post-battle reward presentation – XP, gold, items, and affordances.  
  - **Signal:** How victory and rewards feel immediately after combat.

**Improved battle mock suite (variants and concepts)**

All in `mockups/improved/`:

- `battle-screen-authentic.html`  
  - **Purpose:** Battle layout tuned to feel closest to Golden Sun’s authentic framing.  
  - **Signal:** Baseline “canon” composition for v1.

- `battle-screen-live-build.html`  
  - **Purpose:** Layout constrained to what the live build can support.  
  - **Signal:** Realistic compromise between ideal and feasible.

- `battle-screen-refined.html`  
  - **Purpose:** Refined spacing/typography; high-readability battle UI.  
  - **Signal:** Strong candidate for UX reference in v2.

- `battle-screen-30-70-split.html`  
  - **Purpose:** Experiment with 30% UI / 70% scene split.  
  - **Signal:** Tradeoffs between visibility of battlefield vs controls.

- `battle-screen-variant-1.html` … `battle-screen-variant-10.html`  
  - **Purpose:** Ten systematic layout variants (menu positions, focus, enemy emphasis).  
  - **Signal:** Exploration set; v2 should pick 1–2 anchor patterns.

- `battle-screen-queue-based-final.html`  
  - **Purpose:** Queue-based ATB visualization – shows upcoming turns and ordering.  
  - **Signal:** Critical for communicating future actions and tempo.

- `battle-screen-hybrid-command.html`  
  - **Purpose:** Command menu that coexists with visible battlefield; no hard occlusion.  
  - **Signal:** Better continuous awareness of the scene.

- `battle-screen-hybrid-portrait-element.html`  
  - **Purpose:** Incorporates portraits and elemental identity into UI layout.  
  - **Signal:** Affords personality + element clarity.

- `battle-screen-elevated-hero-centric.html`  
  - **Purpose:** Camera and framing centered on heroes.  
  - **Signal:** Hero-focused storytelling and clarity in busy scenes.

- `battle-screen-elevated-cinematic.html`  
  - **Purpose:** Most cinematic framing; large negative space for VFX.  
  - **Signal:** Visual bar for what “spectacular” can look like.

- `battle-concept-arena.html`  
  - **Purpose:** Arena-centric layout; environment as key character.  
  - **Signal:** Helps decide how “big” arenas should feel.

- `battle-concept-split.html`  
  - **Purpose:** Strong UI/scene panel split.  
  - **Signal:** More stylized combat reading, reminiscent of classic JRPGs.

- `battle-concept-spotlight.html`  
  - **Purpose:** Spotlight effect on active entity/target.  
  - **Signal:** Visual communication of “who is acting now.”

- `battle-execution-phase.html`  
  - **Purpose:** Distinct execution phase layout; different from command phase.  
  - **Signal:** Clarifies the battle loop structure.

- `battle-all-queued.html`  
  - **Purpose:** View of a fully queued round of actions.  
  - **Signal:** Demonstrates readability under high future-load.

- `battle-victory-screen.html`  
  - **Purpose:** Celebration screen after battle.  
  - **Signal:** Layout and emotional payoff for victory.

- `battle-transition-spiral.html`  
  - **Purpose:** Specific spiral-style transition concept.  
  - **Signal:** Variant on transition effect.

- `battle-transition-complete.html`  
  - **Purpose:** Finalized battle transition mock.  
  - **Signal:** Chosen timing/visual language for entering battle.

- `battle-target-selection.html`  
  - **Purpose:** Target selection UI (highlight, hover, confirm states).  
  - **Signal:** Touchpoints for clarity and selection feedback.

**Sprite implementation battle mock**

- `sprite-implementation/battle-scene-mock.html`  
  - **Purpose:** Places battle sprites in their slots, tests alignment/depth.  
  - **Signal:** Integration between art and layout for battle.

**Shared battle mock styling**

- `improved/shared/battle-mock.css`  
  - **Purpose:** Shared CSS for all improved battle mocks.  
  - **Signal:** Centralizes colors, frames, and pseudo-sprites.

---

### 3.2 Overworld, Village, and Hub Mocks

- `mockups/overworld.html`  
  - **Purpose:** Global overworld composition – tile layout, camera scale.  
  - **Signal:** Baseline sense of world scale and navigation.

- `mockups/overworld-village/overworld-village.html`  
  - **Purpose:** Focused mock of village area layout.  
  - **Signal:** Building placement, paths, interactables.

- `mockups/improved/overworld-golden-sun-authentic.html`  
  - **Purpose:** Overworld tuned to match Golden Sun’s feel.  
  - **Signal:** Calibration target for v2 camera/scale.

- `mockups/improved/living-vale-village.html`  
  - **Purpose:** Shows “alive” village (NPCs, particles, motion).  
  - **Signal:** What “liveliness” means beyond tiles.

- `mockups/improved/vale-village-authentic.html`  
  - **Purpose:** Authentic Vale village composition.  
  - **Signal:** Spatial/visual identity for the main hub.

- `mockups/improved/vale-hub-variant-1.html` … `vale-hub-variant-5.html`  
  - **Purpose:** Five hub layout variants (central plaza vs branching, density experiments).  
  - **Signal:** Where to anchor v2’s main hub layout.

- `mockups/improved/building-entry-system.html`  
  - **Purpose:** Entry/exit building interactions (doors, fades, interior).  
  - **Signal:** UX for crossing world/interior boundaries.

---

### 3.3 Menus, Equipment, Character, Djinn, and Rewards

**Menus and navigation**

- `mockups/main-menu-v2.html`  
  - **Purpose:** Early main menu layout.  
  - **Signal:** Initial structure of entry UX.

- `mockups/improved/main-menu-v2.html`  
  - **Purpose:** Polished main menu; better CTAs and hierarchy.  
  - **Signal:** Strong reference for v2’s title/main UX.

- `mockups/improved/pause-menu.html`  
  - **Purpose:** Pause menu structure in-session.  
  - **Signal:** How in-game interruptions feel.

- `mockups/settings-screen.html`  
  - **Purpose:** Original settings page layout.  
  - **Signal:** Base set of options.

- `mockups/improved/settings-screen.html`  
  - **Purpose:** Refined settings UX (groups, sliders, toggles).  
  - **Signal:** Readable, production-ready settings.

**Equipment, inventory, and roster**

- `mockups/equipment-screen.html`  
  - **Purpose:** Initial equipment/inventory layout.  
  - **Signal:** Core concepts: slots, stats, comparisons.

- `mockups/improved/equipment-screen-polished.html`  
  - **Purpose:** Polished equipment screen; final-ish layout.  
  - **Signal:** Where v2 equipment UI should probably land.

- `mockups/unit-collection.html`  
  - **Purpose:** Early unit collection/roster display.  
  - **Signal:** Basic organization of character listing.

- `mockups/improved/unit-collection-roster.html`  
  - **Purpose:** Improved roster grid/list view.  
  - **Signal:** Clearer scanning of party members.

- `mockups/improved/team-roster-unified.html`  
  - **Purpose:** Unified roster mock tying team selection and viewing.  
  - **Signal:** Single mental model for party composition.

**Djinn and character info**

- `mockups/djinn-menu.html`  
  - **Purpose:** Early djinn menu layout.  
  - **Signal:** How djinn slots, elements, and assignments are visualized.

- `mockups/djinn-menu/djinn-menu.html`  
  - **Purpose:** Focused djinn menu prototype.  
  - **Signal:** Slightly more refined than the generic one.

- `mockups/improved/djinn-menu-authentic.html`  
  - **Purpose:** Djinn menu tuned to authentic inspiration.  
  - **Signal:** Likely best candidate to mirror in v2.

- `mockups/improved/character-info-screen.html`  
  - **Purpose:** Per-character details view.  
  - **Signal:** Where full stats and flavor text live.

- `mockups/improved/djinn-info-screen.html`  
  - **Purpose:** Per-djinn details view.  
  - **Signal:** Identity and usage clarity per djinn.

**Rewards & dialogue**

- `mockups/rewards-screen.html`  
  - Already covered above (basic rewards layout).

- `mockups/improved/rewards-screen-celebration.html`  
  - **Purpose:** Celebration-first rewards screen.  
  - **Signal:** Emotional tone and animation hooks for loot.

- `mockups/improved/dialogue-box-v2.html`  
  - **Purpose:** Dialogue box iteration.  
  - **Signal:** Readability and style of narrative text.

**Specialized shop UX**

- `mockups/improved/weapon-shop-authentic.html`  
  - **Purpose:** Authentic weapon shop layout experience.  
  - **Signal:** Economic and flavor presentation for shops.

---

### 3.4 Pre-Battle and Team Selection

- `mockups/pre-battle-team-select.html`  
  - **Purpose:** Early pre-battle team selection screen.  
  - **Signal:** First take on how players pick a party.

- `mockups/pre-battle-team-select-final.html`  
  - **Purpose:** Finalized team select composition.  
  - **Signal:** Likely final layout design for v1.

- `mockups/pre-battle-team-select-improved.html`  
  - **Purpose:** Polished version; integrates learnings from v1 play.  
  - **Signal:** Should heavily influence v2 battle prep.

---

### 3.5 Misc/Meta Mocks

- `mockups/improved/automated-gameplay-demo.html`  
  - **Purpose:** Auto-run gameplay mock that shows a scripted sequence.  
  - **Signal:** Visualizing flows without playing.

- `mockups/improved/sprite-showcase.html`  
  - **Purpose:** Gallery/stage to show sprites and animations.  
  - **Signal:** Quick visual QA of sprite sets.

- `mockups/improved/index.html`  
  - **Purpose:** Hub/index page for improved mocks.  
  - **Signal:** Entry point to browse all improved mock screens.

- `mockups/index.html` (implicit by directory structure, or via `vale-village/index.html`)  
  - **Purpose:** Main index into the original project and/or mock suite.  
  - **Signal:** Generic entry point.

---

## 4. v1 Sprite Maps, Tools, and Tests

**Sprite maps (JSON)**

- `mockups/djinn-menu/sprite_map.json`  
- `mockups/unit-collection-sprite-map.json`  
- `mockups/equipment-screen-sprite-map.json`  
- `mockups/battle-screen-sprite-map.json`  
- `mockups/overworld-village/sprite_map.json`  
- `mockups/rewards-screen-sprite-map.json`  

**Role:** Map logical UI elements (buttons, slots, characters, tiles) to sprite filenames/coords.  
**Signal:** Clear contract between UI design and sprite assets; v2 currently has no equivalent JSON files visible.

**Tools and scripts**

- `dinerdash/scripts/generate-sprite-list.js`  
- `vale-village/scripts/generate-sprite-manifest.cjs`  
- `vale-village/scripts/check-sprites.mjs`  
- `vale-village/scripts/validate-sprites.cjs`  
- `vale-village/scripts/test-sprite-catalog.cjs`  

These manage sprite manifests, validation, and catalog testing.

**Generated artifacts**

- `vale-village/src/ui/sprites/sprite-list-generated.ts`  
- `vale-village/dinerdash/src/sprite-list-generated.ts`  

**Sprite-related E2E tests**

- `vale-village/tests/e2e/button-sprites.spec.ts`  
- `vale-village/tests/e2e/check-sprites.spec.ts`  
- `vale-village/tests/e2e/verify-sprites.spec.ts`  

**Signal:** The v1 stack has a **full sprite pipeline**: maps → generators → validators → tests.

---

## 5. v1 Meta-Mock Infrastructure

- `prompts/create-storyboard-mockups.md`  
  - **Purpose:** Process/playbook for generating storyboard-style mockups.  
  - **Signal:** Encodes *how* you expect mocks to be built.

- `screenshot-mockups.cjs`  
  - **Purpose:** Script to generate screenshot-style images from mocks.  
  - **Signal:** Automates keeping visual documentation up to date.

- `src/test/shared-mocks.ts`  
  - **Purpose:** Shared test mocks (not visual, but supports simulated flows).  
  - **Signal:** Ties gameplay logic to stable mock fixtures.

- `dinerdash/index.html` and `dinerdash/terrain-reference.html`  
  - **Purpose:** Mini-project and reference scene for terrain/furniture.  
  - **Signal:** Additional playground for art/layout decisions.

---

## 6. v2 Artifacts – What Exists

From `vale-village-v2` root:

- `index.html`  
  - **Role:** Main app shell; live runtime entry point.

- `public/sprites/scenery/indoor/lg/Hammocks.gif`  
- `public/sprites/scenery/indoor/lg/Hammock.gif`  
  - **Role:** Ported hammock sprites; matches improved/public variants from v1.

- `src/ui/sprites/sprite-list-generated.ts`  
  - **Role:** Generated sprite list; indicates some of the v1 sprite pipeline remains.

- `tests/e2e/smoke.spec.ts-snapshots/main-menu-chromium-linux.png`  
- `tests/e2e/smoke.spec.ts-snapshots/title-screen-chromium-linux.png`  
  - **Role:** Visual snapshots for main menu and title screen; serve as *runtime-derived* mocks.

**Not present in v2 (by tree scan):**

- No `mockups/` directory or HTML mock suite.  
- No `sprite_map.json`-style resources per screen.  
- No `screenshot-mockups.cjs` or storyboard-mock prompts in the v2 tree.

---

## 7. Comparison & Gaps (v1 → v2)

### 7.1 Battle & Combat

- v1: Dozens of battle mocks (layouts, transitions, queue, targeting, victory).  
- v2: Only runtime UI plus a couple of global snapshots; no static battle HTML mocks surfaced.  
- **Gap:** Risk of losing nuanced design decisions for queue visualization, target feedback, and cinematic framing.

### 7.2 World / Village / Hub

- v1: Dedicated overworld/village/authentic hub mocks and “living village” prototypes.  
- v2: Implementation and tests only; no explicit visual reference mocks.  
- **Gap:** The exact feel of “alive” and “authentic” is not explicitly encoded in v2 assets.

### 7.3 Menus, Djinn, Equipment, Rewards

- v1: A mock for every major surface (main menu, pause, settings, equipment, unit collection, djinn, rewards, dialogue).  
- v2: Those features exist as in-game screens, but there are no matching HTML mocks in the v2 repo.  
- **Gap:** Harder to reason about UX or do fast iterations without running the game.

### 7.4 Pre-Battle & Party Management

- v1: Multiple pre-battle team select mocks plus unified roster views.  
- v2: Party selection is only visible via actual game UI/tests.  
- **Gap:** High-level structure of battle prep flows is implicit.

### 7.5 Sprite Maps & Pipeline

- v1: Screen-specific sprite maps + generator scripts + validation + sprite E2Es.  
- v2: A generated sprite list and a few sprites, but no visible v2 sprite maps or sprite-specific tests.  
- **Gap:** Less explicit contract between intended UI sprites and actual assets.

### 7.6 Mocking Process & Tooling

- v1: Documented process (`create-storyboard-mockups.md`) and automation (`screenshot-mockups.cjs`).  
- v2: No direct equivalent; mocking is implicit in E2E snapshots and runtime.

---

## 8. Proposed Subagent Task Table

Below is a coarse-grained TODO list suitable for agents/subagents. Each row is intentionally high-level so one agent can do, and another can audit.

| ID | Area        | Task                                                                                 | Input Artifacts (v1)                                      | Target in v2                                   |
|----|-------------|--------------------------------------------------------------------------------------|-----------------------------------------------------------|-----------------------------------------------|
| B1 | Battle UX   | Choose 2–3 canonical battle layouts and re-express them as v2 mocks (HTML or stories). | `battle-screen-*`, `battle-screen-authentic`, `refined`   | `vale-village-v2/mockups/battle/*` (new)     |
| B2 | Queue & Turn| Recreate queue-based and target-selection flows as static v2 mocks.                  | `battle-screen-queue-based-final`, `battle-target-selection` | Same as B1, focused on queue/targets        |
| B3 | Transitions | Map v1 transition mocks to current v2 battle-entry behavior; decide what to keep.    | `battle-transition*`                                      | Design doc + optional dev-only route         |
| W1 | Overworld   | Port a single “authentic overworld” mock into v2 (for camera/tile calibration).      | `overworld.html`, `overworld-golden-sun-authentic`        | `mockups/world/overworld-authentic.html`     |
| V1 | Village     | Port “living village” mock as v2 demo (could be HTML or dev-only scene).            | `living-vale-village`, `vale-village-authentic`           | Dev-only route + doc                         |
| H1 | Hub Layouts | Compare hub variants to actual v2 hub; document chosen pattern and deviations.       | `vale-hub-variant-{1..5}`                                | Short markdown in `docs/hub-layouts.md`      |
| M1 | Main Menu   | Align v2 main menu implementation with best v1 mock; note intentional changes.       | `main-menu-v2.html` (base + improved)                    | Audit doc + issue list                       |
| M2 | Pause/Settings | Ensure v2 has equivalents for pause and settings; write small mocks if missing.   | `pause-menu`, `settings-screen*`                          | `mockups/system/*`                           |
| E1 | Equipment   | Recreate polished equipment mock as v2 reference; check game UI parity.              | `equipment-screen*`                                      | Design checklist + optional mock page        |
| D1 | Djinn       | Map djinn menu/info mocks to v2 implementation; state what’s missing.                | `djinn-menu*`, `djinn-menu-authentic`, `djinn-info-screen` | Doc in `docs/djinn-ux.md`                  |
| R1 | Rewards     | Compare v1 celebration mock to v2 rewards flow; propose upgrades.                    | `rewards-screen*`                                        | Issue/ticket in v2 repo                      |
| P1 | Pre-Battle  | Ensure pre-battle team select UX in v2 matches “final” mock or document deltas.      | `pre-battle-team-select*`, `team-roster-unified`         | UX notes + optional mock                     |
| S1 | Sprite Maps | Design a lightweight v2 sprite-map layer (JSON + generator + tests).                 | All `sprite_map.json`, sprite scripts                     | `scripts-v2/*` + tests                       |
| S2 | Sprite QA   | Add a minimal set of v2 sprite-focused E2E tests (using key screens).                | `button-sprites`, `check-sprites`, `verify-sprites`       | `vale-village-v2/tests/e2e/sprites.spec.ts`  |
| T1 | Storyboard  | Reintroduce storyboard-mock process for v2 (doc + example).                          | `create-storyboard-mockups.md`                           | `docs/storyboard-mocks-v2.md`                |
| T2 | Screenshots | Add a v2-friendly screenshot-mock generation script or harness.                       | `screenshot-mockups.cjs`                                 | `scripts/screenshot-mockups-v2.*`            |

---

## 9. How to Use This Document

- Treat this file as the **master audit** of mock-related assets (v1 → v2).  
- Agents can pick IDs from the table, perform the work or deeper audit, and then log outcomes in your memory system.  
- Auditing agents should verify v2 implementation against the described v1 intent and either mark parity or open issues where gaps remain.
