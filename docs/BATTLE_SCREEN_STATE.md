BATTLE SCREEN - Current State

Purpose
- Single-source documentation of the battle screen architecture, runtime state, and UX flow. Maintain here when changing battle UI or flow logic.

High-level architecture
- Core battle model and algorithms live in core/* (core/models/BattleState.ts, core/services/*).
- UI is implemented under src/ui/components with a single top-level view: src/ui/components/QueueBattleView.tsx (the queue-based battle screen).
- State is managed with several Zustand slices (src/ui/state/*): queueBattleSlice (queue-based UI), battleSlice (legacy/alternate battle handling), gameFlowSlice (pre-battle flow), rewardsSlice, and saveSlice.
- Persistence and validation: data/schemas/BattleStateSchema.ts and core/validation/battleStateInvariants.ts enforce invariants and are used by core/services/SaveService.ts for save/load.

Battle model and phase machine
- BattleState (core/models/BattleState.ts and data/schema): canonical shape including:
  - phase: "planning" | "executing" | "victory" | "defeat"
  - status: "ongoing" | "PLAYER_VICTORY" | "PLAYER_DEFEAT"
  - queuedActions: array of queued player actions for the next round
  - remainingMana, maxMana, currentQueueIndex, roundNumber, turnOrder
  - playerTeam and enemies arrays with per-unit battleStats and djinn trackers
- UI-specific phase: src/ui/types/BattleUIPhase.ts derives a UI phase from BattleState.phase and the events queue. QueueBattleView treats events.length > 0 as 'executing' regardless of battle.phase (so the UI reflects in-flight animations/events).

Flow summary (entry -> battle -> rewards)
- Pre-battle: triggers (overworld or dialogue) set pendingBattleEncounterId; PreBattleTeamSelectScreenV2 confirms team and calls ui/state/gameFlowSlice.confirmBattleTeam which uses core/services/EncounterService.createBattleFromEncounter to produce a BattleState.
- Entering battle: store.setBattle(result.battle, seed) (queueBattleSlice.setBattle or battleSlice.setBattle depending on path). The UI transitions to mode 'battle' (App.tsx and store flow manage transitions).
- Planning: Queue-based UI (QueueBattleView) shows portraits, action queue (ActionQueuePanel), BattleActionMenu and BattleManaBar. User queues actions using queueBattleSlice.queueAction/queueDjinn.
- Executing: executeRound (queueBattleSlice.executeRound -> core/services/QueueBattleService.executeRound) returns events; events are appended to UI slice.events and QueueBattleView processes them with animations.
- End: When battleEnd is detected, queueBattleSlice and battleSlice call rewards flow: ui/state/rewardsSlice.processVictory which snapshots lastBattleRewards and may trigger RewardsScreen or post-battle dialogues.

Important files to review (non-exhaustive)
- UI: src/ui/components/QueueBattleView.tsx, LayoutBattle.tsx, Battlefield.tsx, BattleActionMenu.tsx, BattleLog.tsx, BattleOverlay.tsx, BattleManaBar.tsx, BattlePortraitRow.tsx, ActionQueuePanel.tsx, BattleUnitSprite.tsx
- State slices: src/ui/state/queueBattleSlice.ts, src/ui/state/battleSlice.ts, src/ui/state/gameFlowSlice.ts, src/ui/state/rewardsSlice.ts, src/ui/state/saveSlice.ts
- Core model & services: src/core/models/BattleState.ts, src/core/services/QueueBattleService.ts, src/core/services/BattleService.ts, src/core/services/EncounterService.ts, src/core/services/RewardsService.ts
- Validation & schemas: src/core/validation/battleStateInvariants.ts, src/data/schemas/BattleStateSchema.ts
- Sprites & assets: src/ui/sprites/mappings/battleSprites.ts, src/ui/sprites/manifest.ts
- Styles: src/ui/styles/battle-screen.css

Invariants and safety
- validateBattleState (core/validation/battleStateInvariants.ts) throws BattleStateInvariantError when invariants are violated; callers catch and warn. Always prefer fixing root causes over suppressing invariant checks.
- Save/load uses BattleStateSchema for strong validation; SaveService will refuse to load invalid battle shapes.
- Queue-based execution uses deterministic RNG seeds propagated from gameFlowSlice and stored in the battle slice (avoid introducing non-determinism in UI/control logic).

Decisions and non-obvious notes (documented for handoff)
- Queue-based execution: chosen to separate planning (player decision) from executing (deterministic event playback). The UI uses the events queue as authoritative for what animations to play; this allows replays and deterministic saves.
- UI phase derivation: UI intentionally shows "executing" when events exist even if BattleState.phase is planning; this reduces flicker between state updates and keeps animations tied to processed events.
- Tower battles: UI has tower-specific flows (src/ui/state/towerSlice.ts and QueueBattleView has tower tutorial hooks); tower rewards are handled differently (do not show normal rewards flow during an in-run tower battle).

Known TODOs / Risks
- Risk: Some console.error paths warn about battle creation failures (gameFlowSlice and EncounterService) — ensure callers provide valid encounter data to avoid runtime redirects to overworld.
- Risk: checkBattleEnd and related guards log errors when battle arrays are empty; upstream code must ensure non-empty enemies/playerTeam when creating battles.
- TODO: Add a visual diagram and sequence-of-events section (recommended next work) and add unit tests for UI-phase derivations and round execution glue.

Handoff / Next steps
- Confirm UX behavior for tower-run auto-complete and reward suppression (queueBattleSlice and towerSlice interaction).
- Add a small diagram showing the lifecycle: trigger -> pre-battle -> confirm -> setBattle -> planning -> execute events -> victory -> rewards/post-battle dialogue.
- Add tests that simulate a full round (createBattleFromEncounter -> queue actions -> executeRound) and assert events emitted and final BattleState status.

Contact / References
- When modifying the battle UI, update this file first. See the files listed above for implementations and tests.

Last-updated: 2025-12-30 (automated note)

Handoff notes:
- Non-obvious decision: "events queue drives UI executing state" documented above; this explains why deriveUIPhase may differ from BattleState.phase during animations.
- Avoid removing validateBattleState calls — they protect many invariants across services and saves.

Watcher preparation (watcher_prep):
- No file, symbol, or script named `watcher_prep` was found in the repository at the time of this update. If `watcher_prep` refers to a CI watcher, test helper, or developer utility used to prepare or validate battle-screen watches/tests, it should be added under scripts/ or tests/helpers and referenced from relevant READMEs.
- Recommended minimal implementation: a small script (e.g., scripts/watcher_prep.sh or tests/helpers/watcher_prep.ts) that installs dev deps, builds assets needed for the battle screen, and starts a lightweight dev server or test harness so watchers can run deterministically.
- Document usage and expected outputs so the next worker can quickly validate the watcher and its side-effects (e.g., files generated, ports used).

Handoff actions for next worker:
- Confirm whether `watcher_prep` is a missing artifact or an alias; if missing, implement a small script under scripts/watcher_prep.* that prepares a dev watch environment for the battle screen or update docs to reference the correct tool.
- Implement the recommended visual diagram of lifecycle (trigger -> pre-battle -> confirm -> setBattle -> planning -> execute events -> victory -> rewards/post-battle) and add unit tests for UI-phase derivation and round execution glue.
- Verify tower-run reward suppression behavior and add a short test or integration check to avoid regressions.

(End of document)
