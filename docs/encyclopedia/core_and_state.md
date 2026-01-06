# Core Domain Logic and State Management (Zustand)

This document maps the system 'brain': core domain models/algorithms and the UI-facing Zustand slices. It lists responsibilities, public actions/selectors and key invariants needed by engineers working on game logic and UI integration.

---

## High-level responsibilities

- Core (/src/core): pure domain models (POJOs), deterministic algorithms (damage, turn-order, rewards, djinn), services that coordinate algorithms and state transitions (BattleService, QueueBattleService, RewardsService, etc.), RNG stream utilities and validation.
- State (/src/ui/state): small, focused Zustand slices that expose public actions and selectors for UI components and orchestrate calls into core services.

---

## Store entrypoints

- createStore() / useStore / store (src/ui/state/store.ts)
  - Combines slices: Team, QueueBattle, Save, Story, Inventory, Rewards, GameFlow, Overworld, Dialogue, DevMode, Tower.
  - UI components should import/use `useStore()` selectors or the exported `store` for imperative calls (e.g., handleRewardsContinue).

---

## Zustand slices (summary of responsibilities and public API)

- battleSlice (src/ui/state/battleSlice.ts)
  - Purpose: turn-based service wrapper for the legacy/non-queue battle flow; processes status ticks, performs actions, advances turns and notifies story/rewards.
  - Public actions: setBattle(battle, seed), startTurnTick(), perform(casterId, abilityId, targetIds), endTurn(), dequeueEvent(), performAIAction(), preview(casterId, abilityId, targets)
  - Notes: produces BattleEvent objects; uses RNG stream separation (STATUS_EFFECTS, ACTIONS, END_TURN).

- queueBattleSlice (src/ui/state/queueBattleSlice.ts)
  - Purpose: queue-based battle UI backing store (planning/executing phases), mana/pending mana tracking, queued actions/djinn and event queue.
  - Public actions: setBattle(battle, seed), setActivePortrait(), setActionMenuOpen(), setSummonScreenOpen(), showTutorialMessage(), updateManaState(), incrementCritCounter(), resetCritCounter(), triggerCritFlash(), clearError(), queueUnitAction(unitIndex,...), clearUnitAction(unitIndex), queueDjinnActivation(djinnId), unqueueDjinnActivation(djinnId), executeQueuedRound(), dequeueEvent()
  - Selectors/state: currentMana, maxMana, pendingManaThisRound, pendingManaNextRound, events, lastError
  - Notes: normalizes battle state on setBattle() and syncs team djinn trackers after round execution.

- gameFlowSlice (src/ui/state/gameFlowSlice.ts)
  - Purpose: global mode management and high-level flow (team-select, battle, overworld transitions, shop, compendium).
  - Public actions: setMode(), setPendingBattle(encounterId), handleTrigger(trigger, skipPreBattleDialogue), openShopFromMainMenu(), exitShop(), openCompendium(), closeCompendium(), confirmBattleTeam(), updateBattleConfigSlot(), updateBattleSlotEquipment(), setBattleConfigDjinnSlot(), clearBattleConfig(), resetLastTrigger(), returnToOverworld()
  - Notes: confirmBattleTeam() validates BattleConfig, builds Team and calls createBattleFromEncounter + setBattle + setTeam.

- towerSlice (src/ui/state/towerSlice.ts)
  - Purpose: tower-run campaign flow, floor/battle orchestration, milestones and reward plumbing.
  - Public actions: getCurrentTowerFloor(), startTowerRun(opts), beginTowerFloorBattle(), handleTowerBattleCompleted(payload), applyTowerRest(), quitTowerRun(), enterTowerFromOverworld(context), openTowerFromMainMenu(), exitTowerMode(), setTowerRecord(record)

- overworldSlice (src/ui/state/overworldSlice.ts)
  - Purpose: player position/facing, triggers and basic movement. Integrates with Story and Dialogue slices.
  - Public actions: setFacing(dir), movePlayer(dir), teleportPlayer(mapId, position), clearTrigger()

- saveSlice (src/ui/state/saveSlice.ts)
  - Purpose: save/load, slot-based operations, createSaveData from current state and hydrate state on load.
  - Public actions: hasSave(), loadGame(), saveGame(), deleteSave(), saveGameSlot(slot), loadGameSlot(slot), hasSaveSlot(slot), deleteSaveSlot(slot), getSaveSlotMetadata(slot), autoSave(), setRecruitmentFlag(id, bool), setNpcState(id, patch), incrementBattleStats(delta), addPlaytime(seconds)
  - Notes: persists battle snapshot to localStorage separately.

- dialogueSlice (src/ui/state/dialogueSlice.ts)
  - Purpose: manage dialogue tree/state and execute dialogue effects (which map to high-level events like start-battle, grant-djinn, recruit-unit, open-shop, set-story-flag, auto-save).
  - Public actions: startDialogueTree(tree), makeChoice(choiceId), advanceCurrentDialogue(), endDialogue()
  - Effects → Events mapping: processDialogueEffects() → applyDialogueEvents()

- inventorySlice (src/ui/state/inventorySlice.ts)
  - Purpose: manage gold and equipment list.
  - Public actions: setGold(), setEquipment(), addGold(amount), addEquipment(items), removeEquipment(itemId)

- teamSlice (src/ui/state/teamSlice.ts)
  - Purpose: roster and active Team management, team composition mutations.
  - Public actions: setTeam(team), setRoster(units), addUnitToRoster(unit), getUnitFromRoster(unitId), updateTeam(updates), updateTeamUnits(units), swapPartyMember(partyIndex, unitId)
  - Notes: ensures roster sync when team changes; supports variable party sizes (1-4), no padding.

- rewardsSlice (src/ui/state/rewardsSlice.ts)
  - Purpose: post-battle reward distribution, reward screen mode, claiming rewards.
  - Public actions: processVictory(battle, options), claimRewards(), setShowRewards(visible), selectEquipmentChoice(equipment)

- storySlice (src/ui/state/storySlice.ts)
  - Purpose: canonical story flags, chapter progression, onBattleEvents processing for Djinn and recruitment.
  - Public actions: setShowCredits(show), setStoryFlag(key, value), getStoryFlag(key), setStoryState(story), onBattleEvents(events)

- devModeSlice (src/ui/state/devModeSlice.ts)
  - Purpose: development-only overlays and toggles.
  - Public actions: toggleDevMode(), setDevModeEnabled(bool), setSelectedHouse(houseId)

---

## Battle configuration helpers (src/ui/state/battleConfig.ts)

- Exports DEFAULT_BATTLE_SLOT_COUNT, DEFAULT_DJINN_SLOT_COUNT
- Helpers: buildBattleConfigForNextBattle(team, roster), getActiveSlotUnitIds(config), getEquipmentLoadoutForSlot(config, slotIndex), updateDjinnSlots(slots, index, djinnId), validateBattleConfig(config, inventory, roster, team)
- Responsibility: create and validate UI-facing battle configuration objects used by gameFlowSlice.

---

## Core domain models (POJOs) and key functions

- Unit (src/core/models/Unit.ts)
  - Fields: id, name, element, role, baseStats, growthRates, level, xp, currentHp, equipment, djinn, djinnStates, abilities, unlockedAbilityIds, statusEffects, battleStats
  - Helpers: createUnit(def, level, xp), updateUnit(unit, updates), calculateMaxHp(unit), isUnitKO(unit)

- Team (src/core/models/Team.ts)
  - Fields: equippedDjinn (<=3), djinnTrackers, units (1-4), collectedDjinn (≤12), currentTurn, activationsThisTurn
  - Helpers: createTeam(units), updateTeam(team, updates)

- BattleState (src/core/models/BattleState.ts)
  - Composed of: BattleTurnOrder, BattleQueue, BattleProgress, BattleMetadata; includes playerTeam, enemies, unitById index, remainingMana, maxMana, djinnRecoveryTimers
  - Helpers: createBattleState(playerTeam, enemies, turnOrder), updateBattleState(state, updates) (rebuilds unitById and runs validation in dev), buildUnitIndex(player, enemies), calculateTeamManaPool(team), getEncounterId(battle)

---

## Key algorithms (src/core/algorithms)

- Damage (damage.ts)
  - calculatePhysicalDamage(attacker, defender, team, ability)
  - calculatePsynergyDamage(...)
  - calculateHealAmount(...)
  - applyDamageWithShields(unit, damage) – handles invulnerability, shield consumption, applyDamage, auto-revive
  - isInvulnerable / hasShieldCharges / consumeShieldCharge
  - Implements element modifiers and damage reduction hooks; respects BATTLE_CONSTANTS (MINIMUM_DAMAGE, DEFENSE_MULTIPLIER, etc.)

- Turn order (turn-order.ts)
  - calculateTurnOrder(units, team, rng, turnNumber)
  - Deterministic tiebreakers via PRNG clone + turnNumber; prioritizes player units on ties; respects priority boots (alwaysFirstTurn) and effective SPD.

- Djinn (djinn.ts)
  - calculateDjinnSynergy(djinnElements) → returns atk/def/class change/abilitiesUnlocked
  - DJINN_SUMMON_DAMAGE and calculateSummonDamage
  - canActivateDjinn(team, djinnId), getSetDjinnIds(team), getDjinnReadyForRecovery(team, currentRound)

- Rewards (rewards.ts)
  - calculateBattleRewards(encounterId, partySize, survivorCount)
  - distributeRewards(team, rewards) → applies XP, creates level-up events and returns updatedTeam + distribution

- Other algorithms: stats.ts (effective stat calculations), xp.ts (leveling), status.ts (status ticks), targeting.ts (resolveTargets/filterValidTargets)

---

## Public state actions / selectors mapping (quick reference)

- useStore().setBattle(battle, seed) — battleSlice / queueBattleSlice
- useStore().setTeam(team), useStore().updateTeamUnits(units) — teamSlice
- useStore().queueUnitAction(unitIndex, abilityId, targetIds, ability) — queueBattleSlice
- useStore().executeQueuedRound() — queueBattleSlice
- useStore().confirmBattleTeam() — gameFlowSlice (validates config + creates battle)
- useStore().processVictory(battle, opts) — rewardsSlice
- useStore().startDialogueTree(tree), makeChoice(id), advanceCurrentDialogue() — dialogueSlice
- useStore().saveGame(), loadGame(), autoSave(), saveGameSlot(n), loadGameSlot(n) — saveSlice
- useStore().startTowerRun(opts), handleTowerBattleCompleted(payload) — towerSlice
- useStore().teleportPlayer(mapId, pos), movePlayer(dir) — overworldSlice

---

## Invariants and design notes

- Core models are POJOs; update functions return new objects (immutability pattern) to simplify state management.
- No magic numbers in algorithms: central constants in src/core/constants.ts (BATTLE_CONSTANTS, RNG streams, MIN/MAX party size).
- BattleState includes unitById index for O(1) lookups — services and slices rely on this for performance.
- Queue and non-queue battle flows coexist; UI chooses queue-based flow (queueBattleSlice) for modern UX.
- RNG streams use createRNGStream(seed, turnNumber, stream) to separate deterministic sequences per-turn and per-purpose.

---

## Next steps / recommended reads

- Read src/core/services/BattleService.ts and QueueBattleService to understand how slices call into core to mutate battle state.
- Review src/core/validation for invariants tested in development mode.
- Use this doc as the single source when wiring new UI components to the store.


(Generated by worker: lane 1, round 1)