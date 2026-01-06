# UI Architecture — Component Hierarchy & OverworldV2

This document captures the UI component hierarchy (feature-based / atomic blended), the OverworldV2 rendering system, and how components map to Zustand stores used by the application.

---

## 1. High-level overview

- Architecture style: Feature-driven with atomic building blocks. Small reusable atoms (icons, chips, images) compose molecules (banners, panels), which compose organisms (screens, complex interactive systems like overworld and battle). Pages/screens compose organisms and orchestrate flows via game-level stores (gameStore / useGameStore).
- Primary global stores:
  - useStore (main app Zustand store combining slices in src/ui/state/)
  - useGameStore (flow/modals/navigation in src/store/gameStore)
  - Individual slices: overworldSlice, battleSlice, towerSlice, gameFlowSlice, dialogueSlice, saveSlice, inventorySlice, devModeSlice, queueBattleSlice, teamSlice, etc. (files in src/ui/state/)

---

## 2. Component hierarchy (feature-based mapping)

- Atoms
  - Small visual primitives: Icon, Avatar, Chip, Image, SpriteImage.
  - Example files: components like ModeLabel.tsx, EquipmentIcon.tsx, StatusIcon.tsx.

- Molecules
  - Composed UI pieces: LocationBanner (location title + meta), VirtualJoystick (touch control), ActionBar, DialogueRow, PortraitRow.
  - Example: Location banner inside OverworldV2 (`.location-banner`), VirtualJoystick component used by OverworldV2.

- Organisms
  - Reusable, self-contained UI: OverworldV2, OverworldCanvas (V1), BattleScreen (LayoutBattle + panels), QueueBattleView, TowerHubScreen, MainMenu, SaveMenu.
  - OverworldV2 is an organism that mounts a canvas, a DOM player overlay, input handlers (keyboard/gamepad/touch) and orchestrates the OverworldEngineV2.

- Pages / Screens
  - Composed of organisms and UI chrome: MainMenu, TitleScreen, PreBattleTeamSelectScreenV2, CompendiumScreen, ShopScreen, Victory/Defeat screens.

- Systems (engine-level, not Preact components)
  - OverworldEngineV2 (engine class handling a canvas, layers, camera, update loop)
  - InputSystem (separate system module used by engine/layers)
  - Layer classes: SkyLayer, BackgroundLayer, TerrainLayer, TreeLayer, RoadLayer, VillageLayer, PlayerLayer, InteriorFloorLayer, InteriorFurnitureLayer, InteriorNpcLayer.

---

## 3. OverworldV2 rendering system (detailed)

Key files (src/ui/components/overworld-v2/):
- OverworldV2.tsx (organism entry)
- engine/OverworldEngineV2.ts (engine core)
- engine/Camera.ts (camera projection, worldToScreen)
- layers/* (layer implementations)
- systems/InputSystem.ts (input plumbing)
- data/constants.ts, data/villageLayout.ts (world configuration)

Responsibilities and flow:
1. OverworldV2 mounts a canvas and constructs an OverworldEngineV2 instance bound to that canvas.
2. Layers are created by factory functions inside OverworldV2 (createOverworldLayers, createInteriorLayers) and provided to engine.setLayers(...). Layers are ordered — sky/background/terrain/tree/roads/village/player — and each layer implements a small API (draw/update/getPosition/setPlayerPosition etc.) described by the Layer type (engine/types).
3. Camera handles world-to-screen transforms and exposes helper worldToScreenSnapped for pixel-perfect positioning.
4. Input sources supported: keyboard, gamepad (navigator.getGamepads), touch (VirtualJoystick), and in some cases DOM events. Input is normalized, dead-zoned, and prioritized (touch > gamepad > keyboard).
5. Player rendering: the engine draws the scene to canvas, but OverworldV2 uses a DOM overlay for the player sprite (to support GIFs / animated sprites). Engine maintains logical PlayerLayer state, and OverworldV2 projects that to the DOM overlay using camera.worldToScreenSnapped.
6. Scene types: 'overworld' vs 'interior'. The same engine is reused with different layer stacks. Transitioning between scenes uses a fade (transitionAlphaRef) and swaps layers at peak darkness to avoid double transitions.
7. Interactions: Proximity/door detection (VillageLayer.getNearestDoor), NPC triggers for interior battles (InteriorNpcLayer), and furniture collision checks during interior movement (InteriorFurnitureLayer.isBlocked).
8. State synchronization: OverworldV2 subscribes to the overworld slice (currentMapId, teleportPlayer, handleTrigger, enterTowerFromOverworld, mode, startDialogueTree, story flags) and to gameStore for flow controls (startTransition, openModal, closeModal, flow.modal). Mode changes in the overworld slice trigger gameStore transitions.

Implementation notes and invariants observed in code:
- Layer instances are created per-scene via create* functions so they can be garbage-collected; layer instances keep references to unlocked house IDs and player positions.
- Player rendering uses both canvas PlayerLayer and a DOM overlay; the canvas player sprite rendering is disabled for the PlayerLayer when DOM overlay is used (playerLayer.shouldRenderSprite = false).
- Physics: Overworld clamps X/Y to configured constants (VIEWPORT_WIDTH/HEIGHT, PLAYER_Y_MIN/MAX) and interior room bounds from constants/data.
- No magic numbers: OverworldV2 imports VIEWPORT_WIDTH/HEIGHT and village layout constants from data files — this is consistent with the project's no-magic-number guideline, though a few magic offsets exist in the DOM overlay (image offsets) and should be promoted to named constants if modified.

---

## 4. Zustand store mappings (component -> store/slice)

Primary stores used across UI components:
- useStore (src/ui/state/store) — the main app store; many components call useStore((s) => s.<sliceStuff>)
- useGameStore (src/store/gameStore) — flow, modals, scene transitions, used by top-level screens and OverworldV2.

Concrete mappings (representative, not exhaustive):

- OverworldV2 (organism)
  - Reads/writes: currentMapId, teleportPlayer, enterTowerFromOverworld, handleTrigger, mode, startDialogueTree, story flags
  - Store slices: overworldSlice (primary), story (part of overworld or story slice), and gameStore for modal/flow control.

- VillageLayer / PlayerLayer / Interior*Layer (engine/layers)
  - Depend on: unlocked house flags from story state, and player position state maintained by OverworldV2 at runtime. They are mostly engine-side classes but read initial data from the overworldSlice.

- OverworldMap.tsx
  - UI map widget that reads: currentMapId, playerPosition, facing, team, mode, movePlayer, handleTrigger, teleportPlayer
  - Store: useStore (overworldSlice) and useGameStore for flow triggers.

- DialogueBoxV2 / DialogueChatOverlay
  - Stores: dialogueSlice (startDialogueTree, active tree), useStore for story flags and flow control.

- Battle components (LayoutBattle, AbilityPanel, Battlefield, QueuePanel)
  - Stores: battleSlice, queueBattleSlice, rewardsSlice. Components use useStore((s) => s.battle ... ) and push actions like queueUnitAction / executeQueuedRound.

- Tower-related components (TowerHubScreen, Tower encounter panels)
  - Stores: towerSlice, gameStore for navigation; QueueBattleView reads towerStatus and activeTowerEncounterId from store.

- SaveMenu / Settings / Inventory / Shop components
  - Stores: saveSlice, devModeSlice, inventorySlice, and global useStore for modifying team/equipment and story flags.

- DevModeOverlay
  - Store: devModeSlice, and direct writes to useStore for manipulating story/team/roster state during debugging.

General guidance observed from imports:
- Most components import a single hook: either `useStore` (from src/ui/state/store) or `useGameStore` (from store/gameStore). This keeps components lightweight and avoids prop-drilling.

---

## 5. Recommendations / Next steps

- Promote a few DOM-overlay magic offsets to named constants (player DOM offsets) to avoid magic numbers in UI positioning.
- Add a short diagram (SVG or ASCII) to this doc showing layer ordering and camera projection pipeline.
- Consider adding a small interface file that documents the Layer contract (draw/update/getPosition/setPlayerPosition) if not already documented, to help future layer authors.

---

## 6. Short summary (decision + next action)

- Decision: Record this component hierarchy and OverworldV2 system into `docs/encyclopedia/ui_architecture.md` and use it as the canonical reference for future changes to overworld rendering.
- Next action: Add an architecture diagram and expand the layer API documentation in a follow-up pass.


---

Document generated after scanning: src/ui/components/overworld-v2/OverworldV2.tsx and related layer/engine files plus state slices in src/ui/state/. For more detailed mapping, run a targeted grep for specific selectors in components (e.g., `useStore((s) => s.<thing>)`) and add those to this document.

---

Addendum: OverworldV2 observed selectors and runtime constants

- Exact OverworldV2 store selectors observed (src/ui/components/overworld-v2/OverworldV2.tsx):
  - useStore((s: OverworldSlice) => s.currentMapId)
  - useStore((s: OverworldSlice) => s.teleportPlayer)
  - useStore((s) => s.enterTowerFromOverworld)
  - useStore((s) => s.handleTrigger)
  - useStore((s) => s.mode)
  - useStore((s) => s.startDialogueTree)
  - useStore((s) => s.story)

- gameStore selectors (src/store/gameStore):
  - useGameStore((s) => s.startTransition)
  - useGameStore((s) => s.openModal)
  - useGameStore((s) => s.closeModal)
  - useGameStore((s) => s.flow.modal) (used to gate input)

- Notable runtime constants present in OverworldV2 (candidates for promotion to data/constants.ts):
  - PLAYER_SPEED = 160
  - INTERIOR_PLAYER_SPEED = 120
  - INTERIOR_ROOM_WIDTH = 320, INTERIOR_ROOM_HEIGHT = 240
  - EXIT_ZONE_WIDTH = 60, EXIT_ZONE_HEIGHT = 30
  - DOM overlay offsets for player image (left: -16px, top: -58px)

- Input hookup:
  - VirtualJoystick props: onMove(h,v) and onAction(pressed) update OverworldV2 touchInputRef; touch input is prioritized over gamepad and keyboard.

- Recommendation: For exhaustive selector mapping, run `rg "useStore\(|useGameStore\(" src/ui/components -n` to enumerate all selector usage and extend this doc as needed.

---

## Rounds 1-5 review
- Reviewed rounds 1-5 artifacts available in the repository; the OverworldV2 organism, engine, layers, and selector usage were validated against src/ui/components/overworld-v2 and src/ui/state slices.
- No code changes were made because only documentation edits are allowed in this lane; the few implementation notes (DOM overlay offsets, runtime constants) are recorded in Recommendations for follow-up.

## Final summary
- Decision: The UI component hierarchy, OverworldV2 rendering system, and component-to-Zustand mappings have been documented in this file and are to be considered the canonical reference for UI/overworld work.
- Next action: Create a small diagram and expand layer API docs (follow-up task) and run a repository-wide selector grep to exhaustively list component-store bindings.



