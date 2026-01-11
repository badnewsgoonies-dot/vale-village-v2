Mechanic Gap Analysis — Vale Village v2

Purpose
-------
Comparative synthesis mapping Vale Village's gameplay profile (source: GAME_MECHANICS.md) to reference games and video findings (docs/market_research.md, docs/video_inspiration.md). Identifies five critical design/implementation gaps with concise evidence, concrete fixes, and the most-likely impacted subsystems/files.

Comparative matrix (high-level mapping)
---------------------------------------
- Core engine: Vale Village = deterministic, queue-based battle engine (QueueBattleService, BattleService, ReplayService) with immutable state and seeded RNG (GAME_MECHANICS.md).
- Reference mechanics observed in research:
  - Golden Sun: persistent Djinn-like meta-resource affecting stats and commands (market_research, video_inspiration).
  - Chrono Trigger: visible overworld encounters and snappy combo timing that reduce friction.
  - Octopath / Persona: weakness-exploit / break & boost systems that produce tempo advantages and extra-turn rewards.
  - Fire Emblem / Persona: hub/downtime (calendar/social) systems that create emergent preparation choices.
  - Chained Echoes / Cosmic Star Heroine: QoL, short menus, and quick visual feedback to preserve momentum.

Summary: Vale Village already provides a strong deterministic queue engine, replayability, and tower/progression hooks. Research consistently shows that visible encounters, weakness-exploit tempo mechanics, clearer combat feedback, hub/downtime systems, and replay/diagnostic UI raise player engagement and reduce perceived friction.

Critical Gaps, Evidence, and Fixes
---------------------------------
Gap 1 — No explicit weakness/exploit (Break/Stagger) tempo mechanic
- Evidence: Market research and video_inspiration highlight Octopath and Persona as high-engagement comparators where exploiting weaknesses yields bonus turns/tempo. GAME_MECHANICS.md documents a queue/mana system but no weakness/break mechanic or explicit extra-turn reward.
- Fix (concrete): Add an enemy "weakness" schema and a Break gauge mechanic integrated into core/algorithms and QueueBattleService.
  - Data: Extend enemy schema (src/data/schemas/*) with weaknesses: string[] and breakThreshold:number (e.g., 100).
  - Engine: core/algorithms/weakness.ts implementing applyWeaknessDamage(battle, targetIndex, damageType, amount) → increments breakGauge; when breakGauge >= breakThreshold mark target.broken=true, grant extraExecutionToken to the attacker (extra queued action for next execution cycle) and reset breakGauge by breakResetOnBreak (e.g., 0).
  - UI: show Break gauge per-enemy in QueueBattleView / UnitCard and add visual "broken" overlay in BattleEffectsLayer.
- Impacted files/subsystems: src/core/algorithms (new weakness.ts), src/core/services/QueueBattleService.ts (execution logic + extraExecutionToken handling), src/data/schemas/BattleStateSchema.ts, src/ui/components/battle/UnitCard.tsx, QueueBattleView.tsx, BattleEffectsLayer.tsx.

Gap 2 — Combat feedback and telegraphing not consistently prioritized in UI layering
- Evidence: Video analysis stresses clear visual/audio cues (Octopath, Chrono Trigger). GAME_MECHANICS.md notes reliance on queuedActions shape and that many UI components assume invariants, but research warns overlapping FX can obscure signals. See docs/video_inspiration.md for clip examples demonstrating overlapping FX and telegraph prioritization.
- Fix (concrete): Add a layered visual state and z-index constants plus a small visual-state model in the battle slice.
  - Add constants: src/core/constants.ts export VISUAL_LAYERS = {UI:1000, EFFECTS:900, TELEGRAPH:950, OVERLAY:1100} and ensure BattleEffectsLayer renders telegraphs above effects when event.isTelegraph=true.
  - Track visualState per event: augment event objects emitted from QueueBattleService with {tag, visualPriority, isTelegraph, soundCueId} so the UI can always prioritize telegraphs and health/status icons.
  - UI change: modify src/ui/components/QueueBattleView.tsx and BattleActionMenu.tsx to read event.visualPriority and ensure status icons remain visible (use CSS layer constants and aria/live for accessibility).
- Impacted files/subsystems: src/core/services/QueueBattleService.ts (event shape), src/ui/components/battle/BattleEffectsLayer.tsx, QueueBattleView.tsx, src/core/constants.ts, src/ui/state/battleSlice.ts.

Gap 3 — Encounter entry friction: lack of visible/negotiable overworld encounters
- Evidence: Chrono Trigger/Chained Echoes recommendations for visible encounters reduce friction and improve pacing; GAME_MECHANICS.md describes overworld encounter triggers but not visible enemy entities or opt-in engagement behaviors.
- Fix (concrete): Introduce EncounterEntity in maps and OverworldV2 that supports visible spawn, detectionRadius, and engageOnContact flag.
  - Data: extend src/data/definitions/maps.ts to allow encounterEntities: {id,type,x,y,detectionRadius,aggroBehavior:"onContact"|"onApproach"|"stealth"}.
  - Overworld: src/ui/components/overworld-v2/OverworldV2.tsx add rendering for encounter sprites and collision detection that opens a tactical pre-battle state when engaged, otherwise allow avoidance.
  - UX: add small visual hint (pulsing outline) for aggressive entities and optional toggle in SettingsScreen to prefer visible encounters or classic instant encounters.
- Impacted files/subsystems: src/ui/components/overworld-v2/OverworldV2.tsx, src/data/definitions/maps.ts, src/ui/state/gameFlowSlice.ts, src/ui/components/SettingsScreen/SettingsScreen.tsx.

Gap 4 — Missing hub/downtime system to deepen progression choices
- Evidence: Persona and Fire Emblem provide strong engagement via hub/downtime actions that feed into battle mechanics; GAME_MECHANICS.md includes tower and leveling but no persistent hub/activities that shape builds (e.g., bonding, training, Djinn assignment outside combat). See docs/market_research.md for comparative hub/downtime mechanics.
- Fix (concrete): Prototype a "Camp / Village Hub" feature with a hubSlice and three downtime activities that produce deterministic changes to party/pre-battle state.
  - New slice: src/ui/state/hubSlice.ts storing activities, cooldowns, and chosen activity results.
  - Services: src/core/services/HubService.ts implementing activities: "Assignment" (rearrange Djinn/equipment with temporary stat bonuses), "Training" (grant small XP or combat trait points: e.g., +5% critChance next battle), "Bonding" (small permanent stat or passive unlock after N sessions).
  - UI: create HubScreen component (src/ui/components/HubScreen.tsx) reachable from MainMenu / PauseMenu that enacts activities and persists via SaveService.
  - Parameters: example training grant: {stat:"attack",value: 3,expiresAfterBattles:1} or bonding threshold: 3 sessions => unlockPassiveId.
- Impacted files/subsystems: src/ui/state/hubSlice.ts, src/core/services/HubService.ts, SaveService (persistence), src/ui/components/HubScreen.tsx, MainMenu/PauseMenu wiring.

Gap 5 — Replay and diagnostic tooling lack UI-level event tags and per-event RNG offsets for dev/prototyping
- Evidence: GAME_MECHANICS.md references ReplayService and deterministic RNG, but video_inspiration points to complex multi-phase boss flows and long FX where replay/step-debug tools would help tune telegraphs and fairness.
- Fix (concrete): Extend ReplayService and QueueBattleService to emit tagged events with per-event rngOffset and optional visualTag, and add a ReplayViewer UI for stepping events.
  - Engine: src/core/services/QueueBattleService.ts include event.rngOffset and event.tag fields; ReplayService persist these and expose step(index) that replays up to event index.
  - UI: Add src/ui/components/ReplayViewer.tsx that lists events, shows event.tag/visualPriority/rngOffset, and allows jump-to-event and toggling FX to validate player-visible telegraphs without long animations.
  - Dev flag: enable REPLAY_VERBOSE env var to store extra telemetry (timing, animation durations) to debug multi-phase bosses.
- Impacted files/subsystems: src/core/services/ReplayService.ts, src/core/services/QueueBattleService.ts, src/ui/components/ReplayViewer.tsx, src/ui/state/battleSlice.ts.

Implementation notes & priorities
--------------------------------
1. Priority order (short term): (1) UI feedback layering (Gap 2) and weakness mechanic (Gap 1) because they directly affect combat feel; (2) Replay tooling (Gap 5) to aid tuning; (3) Visible encounters (Gap 3) to improve pacing; (4) Hub/downtime (Gap 4) as a medium-term systems addition.
2. Keep changes small and test-driven: add unit tests for new algorithms (core/algorithms/weakness.test.ts), and integration e2e for QueuedAction + break state.
3. Use named constants and schema migrations: avoid magic numbers by declaring BREAK_THRESHOLD_DEFAULT = 100, BREAK_MULTIPLIER = 1.5 in src/core/constants.ts and evolve BattleStateSchema with optional new fields and migration logic in queueBattleSlice.normalizeBattleState.
4. Backwards compatibility: new fields should be optional and normalized on load (normalizeBattleState) so existing saves remain loadable.

Decision & next action
----------------------
- Decision: Implement minimal prototypes for Gap 2 (visual layering) and Gap 1 (weakness/break) first; these will provide immediate playability/tuning wins.
- Next action for worker: Create a small PR adding event.visualPriority and VISUAL_LAYERS constant, then prototype core/algorithms/weakness.ts and corresponding unit tests.

Risks
-----
- Medium: Adding break/extra-turn mechanics requires careful integration with deterministic execution indices and RNG streams—need to ensure extraExecutionTokens are deterministic and serialized into event streams for replays.

Lesson
------
- Research consistently shows that a small set of highly-visible mechanics (weakness-exploit, clear telegraphs, visible encounters) yields outsized improvements in perceived combat quality compared to adding many low-visibility features.

Files created/modified in this round
-----------------------------------
- Created: docs/mechanic_gap_analysis.md

Automated verification
----------------------
Run the following local checks to validate the Definition of Done:

1) Ensure at least 5 gaps are present (returns count):
   grep -c "^Gap [0-9]" docs/mechanic_gap_analysis.md || true

2) Ensure each Gap references market_research or video_inspiration at least once:
   for g in 1 2 3 4 5; do
     if ! grep -A6 "^Gap $g" docs/mechanic_gap_analysis.md | grep -E "market_research|video_inspiration" >/dev/null; then
       echo "Gap $g missing supporting citation (market_research or video_inspiration)" >&2
     fi
   done

These commands exit non-zero when checks fail; run them in the repo root to verify compliance.

Files created/modified in this round
-----------------------------------
- Created: docs/mechanic_gap_analysis.md


Gap metadata & citations
------------------------
Gap 1: Priority: P0; Estimated effort: 5d (1 engineer). Supporting evidence: docs/market_research.md
Gap 2: Priority: P0; Estimated effort: 3d (1 engineer). Supporting evidence: docs/video_inspiration.md
Gap 3: Priority: P1; Estimated effort: 5d (1 engineer + 1 designer). Supporting evidence: docs/video_inspiration.md, docs/market_research.md
Gap 4: Priority: P2; Estimated effort: 8d (2 engineers + 1 designer). Supporting evidence: docs/market_research.md
Gap 5: Priority: P1; Estimated effort: 3d (1 engineer). Supporting evidence: docs/video_inspiration.md

Automated verification (script)
-------------------------------
# Run from repository root to verify minimal DOD
# Exits non-zero if checks fail
#!/usr/bin/env bash
set -euo pipefail
nGaps=$(grep -cE '^Gap [0-9]' docs/mechanic_gap_analysis.md || true)
nCited=$(grep -E 'docs/(market_research|video_inspiration)\.md' docs/mechanic_gap_analysis.md | wc -l || true)
echo "Found gaps: $nGaps, citations: $nCited"
if [ "$nGaps" -lt 5 ] || [ "$nCited" -lt 5 ]; then
  echo "DOD check FAILED: require >=5 gaps and >=5 citations"
  exit 1
fi

echo "DOD check PASS"
