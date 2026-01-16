# Validation Report

Date: 2026-01-16T03:46:28.610Z

Automated CI-local run summary:
- mem_briefing: completed (see tests/validation/memory_briefing.txt)
- pnpm_install: partial/unknown (see tests/validation/pnpm_install.log)
- typecheck: failed (exit code 2) — see tests/validation/typecheck.log
- lint: passed (exit code 0) — see tests/validation/lint.log
- unit tests: passed (343 passed | 8 skipped | 13 todo) — see tests/validation/unit_test.log
- coverage: generation failed (ENOENT: coverage/.tmp/coverage-*.json) — see tests/validation/unit_test.log
- e2e: partial (Playwright executed partially; see tests/validation/e2e.log)
- visual-regression: not-run (see tests/validation/visual-regression.txt)

Latest run artifact: tests/validation/memory_result.json (updated 2026-01-16T03:46:28.610Z); memory recorded: tests/validation/mem_db_write.txt

Summary:
- CI-local run: PARTIAL - unit tests passed; typecheck/lint reported issues; coverage failed; e2e incomplete. See tests/validation/ for logs.
- Run metadata: Lane 2, Round 1, Worker a
- Unit tests: 343 passed | 8 skipped | 13 todo
- Coverage: generation failed due to remapping error (see tests/validation/unit_tests.txt)
- Next actions:
  1. Fix coverage remapping error by investigating @ampproject/remapping and vitest coverage-v8 integration.
  2. Address TypeScript errors surfaced by pnpm typecheck (see tests/validation/typecheck.txt).
  3. Re-run full CI-local sequence and confirm e2e and visual regression completion.

Artifacts:
- CI run logs: tests/validation/*.log
- CI results JSON: tests/validation/summary.json
- Memory-ready summary: tests/validation/memory_result.json
- Memory file: tests/validation/memory_result.json (created 2026-01-16T03:46:23.567Z)

Artifacts:
- CI run log: tests/validation/ci_run.log
- CI results JSON: tests/validation/ci_results.json
- Memory-ready summary: tests/validation/memory_result.json

Key failure (excerpt from ci run):

=== typecheck ===

> vale-village-v2@0.1.0 typecheck /home/geni/Documents/vale-village-v2
> tsc --noEmit

src/core/algorithms/damage.ts(101,79): error TS2339: Property 'percent' does not exist on type 'never'.
src/core/algorithms/damage.ts(384,56): error TS2339: Property 'hpPercent' does not exist on type 'never'.
src/core/algorithms/status.ts(173,63): error TS2345: Argument of type '{ type?: "buff"; duration?: number; stat?: "hp" | "pp" | "atk" | "def" | "mag" | "spd"; modifier?: number; } | { type?: "debuff"; duration?: number; stat?: "hp" | "pp" | "atk" | "def" | "mag" | "spd"; modifier?: number; } | ... 6 more ... | { ...; }' is not assignable to parameter of type '{ [key: string]: any; type: string; }'.
  Type '{ type?: "buff"; duration?: number; stat?: "hp" | "pp" | "atk" | "def" | "mag" | "spd"; modifier?: number; }' is not assignable to type '{ [key: string]: any; type: string; }'.
    Property 'type' is optional in type '{ type?: "buff"; duration?: number; stat?: "hp" | "pp" | "atk" | "def" | "mag" | "spd"; modifier?: number; }' but required in type '{ [key: string]: any; type: string; }'.
src/core/save/ReplayService.ts(54,48): error TS2339: Property 'error' does not exist on type 'Result<{ state: BattleState; result: ActionResult; events: readonly BattleEvent[]; }, string>'.
  Property 'error' does not exist on type '{ ok: true; value: { state: BattleState; result: ActionResult; events: readonly BattleEvent[]; }; }'.
src/core/save/ReplayService.ts(80,53): error TS2339: Property 'error' does not exist on type 'Result<BattleState, string>'.
  Property 'error' does not exist on type '{ ok: true; value: BattleState; }'.
src/core/save/ReplayService.ts(139,51): error TS2339: Property 'error' does not exist on type 'Result<{ state: BattleState; result: ActionResult; events: readonly BattleEvent[]; }, string>'.
  Property 'error' does not exist on type '{ ok: true; value: { state: BattleState; result: ActionResult; events: readonly BattleEvent[]; }; }'.
src/core/save/SaveService.ts(72,31): error TS2352: Conversion of type '{ state?: { battle?: { status?: "PLAYER_VICTORY" | "PLAYER_DEFEAT" | "ongoing"; currentTurn?: number; playerTeam?: { djinnStates?: Record<string, "Set" | "Standby" | "Recovery">; ... 5 more ...; activationsThisTurn?: Record<...>; }; ... 16 more ...; meta?: { ...; }; }; story?: { ...; }; gold?: number; team?: { ...; ...' to type 'SaveEnvelope' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  The types of 'state.battle' are incompatible between these types.
    Property 'unitById' is missing in type '{ status?: "PLAYER_VICTORY" | "PLAYER_DEFEAT" | "ongoing"; currentTurn?: number; playerTeam?: { djinnStates?: Record<string, "Set" | "Standby" | "Recovery">; equippedDjinn?: string[]; ... 4 more ...; activationsThisTurn?: Record<...>; }; ... 16 more ...; meta?: { ...; }; }' but required in type 'BattleState'.
src/core/save/SaveService.ts(145,31): error TS2352: Conversion of type '{ seed?: number; initial?: { battle?: { status?: "PLAYER_VICTORY" | "PLAYER_DEFEAT" | "ongoing"; currentTurn?: number; playerTeam?: { djinnStates?: Record<string, "Set" | "Standby" | "Recovery">; ... 5 more ...; activationsThisTurn?: Record<...>; }; ... 16 more ...; meta?: { ...; }; }; story?: { ...; }; gold?: numbe...' to type 'ReplayTape' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  The types of 'initial.battle' are incompatible between these types.
    Property 'unitById' is missing in type '{ status?: "PLAYER_VICTORY" | "PLAYER_DEFEAT" | "ongoing"; currentTurn?: number; playerTeam?: { djinnStates?: Record<string, "Set" | "Standby" | "Recovery">; equippedDjinn?: string[]; ... 4 more ...; activationsThisTurn?: Record<...>; }; ... 16 more ...; meta?: { ...; }; }' but required in type 'BattleState'.
src/core/services/BattleService.ts(189,30): error TS2339: Property 'error' does not exist on type 'Result<ActionResult, string>'.
  Property 'error' does not exist on type '{ ok: true; value: ActionResult; }'.
src/core/services/BattleService.ts(356,13): error TS2322: Type '{ type: string; remainingCharges: number; duration: number; }' is not assignable to type 'never'.
src/core/services/BattleService.ts(370,13): error TS2322: Type '{ type: string; percent: number; duration: number; }' is not assignable to type 'never'.
src/core/services/BattleService.ts(385,13): error TS2322: Type '{ type: string; all: boolean; types: ("debuff" | "poison" | "burn" | "freeze" | "paralyze" | "stun")[]; duration: number; }' is not assignable to type 'never'.
src/core/services/BattleService.ts(408,75): error TS2345: Argument of type '{ type?: "buff"; duration?: number; stat?: "hp" | "pp" | "atk" | "def" | "mag" | "spd"; modifier?: number; } | { type?: "debuff"; duration?: number; stat?: "hp" | "pp" | "atk" | "def" | "mag" | "spd"; modifier?: number; } | ... 7 more ... | { ...; }' is not assignable to parameter of type '{ [key: string]: any; type: string; }'.
  Type '{ type?: "buff"; duration?: number; stat?: "hp" | "pp" | "atk" | "def" | "mag" | "spd"; modifier?: number; }' is not assignable to type '{ [key: string]: any; type: string; }'.
    Property 'type' is optional in type '{ type?: "buff"; duration?: number; stat?: "hp" | "pp" | "atk" | "def" | "mag" | "spd"; modifier?: number; }' but required in type '{ [key: string]: any; type: string; }'.
src/core/services/BattleService.ts(693,17): error TS2322: Type '{ type: string; healPerTurn: number; duration: number; }' is not assignable to type 'never'.
src/core/services/DevModeService.ts(139,33): error TS2345: Argument of type '{ id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; description?: string; role?: "Balanced Warrior" | "Pure DPS" | ... 7 more ... | "Master Warrior"; ... 4 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' is not assignable to parameter of type 'UnitDefinition'.
  Property 'id' is optional in type '{ id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; description?: string; role?: "Balanced Warrior" | "Pure DPS" | ... 7 more ... | "Master Warrior"; ... 4 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' but required in type 'UnitDefinition'.
src/core/services/DevModeService.ts(149,33): error TS2345: Argument of type '{ id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; description?: string; role?: "Balanced Warrior" | "Pure DPS" | ... 7 more ... | "Master Warrior"; ... 4 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' is not assignable to parameter of type 'UnitDefinition'.
  Property 'id' is optional in type '{ id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; description?: string; role?: "Balanced Warrior" | "Pure DPS" | ... 7 more ... | "Master Warrior"; ... 4 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' but required in type 'UnitDefinition'.
src/core/services/EncounterService.ts(126,59): error TS2339: Property 'error' does not exist on type 'Result<BattleState, string>'.
  Property 'error' does not exist on type '{ ok: true; value: BattleState; }'.
src/core/services/GameInitializationService.ts(11,30): error TS2345: Argument of type '{ id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; description?: string; role?: "Balanced Warrior" | "Pure DPS" | ... 7 more ... | "Master Warrior"; ... 4 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' is not assignable to parameter of type 'UnitDefinition'.
  Property 'id' is optional in type '{ id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; description?: string; role?: "Balanced Warrior" | "Pure DPS" | ... 7 more ... | "Master Warrior"; ... 4 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' but required in type 'UnitDefinition'.
src/core/services/GameInitializationService.ts(15,30): error TS2345: Argument of type '{ id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; description?: string; role?: "Balanced Warrior" | "Pure DPS" | ... 7 more ... | "Master Warrior"; ... 4 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' is not assignable to parameter of type 'UnitDefinition'.
  Property 'id' is optional in type '{ id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; description?: string; role?: "Balanced Warrior" | "Pure DPS" | ... 7 more ... | "Master Warrior"; ... 4 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' but required in type 'UnitDefinition'.
src/core/services/GameInitializationService.ts(18,29): error TS2345: Argument of type '{ id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; description?: string; role?: "Balanced Warrior" | "Pure DPS" | ... 7 more ... | "Master Warrior"; ... 4 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' is not assignable to parameter of type 'UnitDefinition'.
  Property 'id' is optional in type '{ id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; description?: string; role?: "Balanced Warrior" | "Pure DPS" | ... 7 more ... | "Master Warrior"; ... 4 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' but required in type 'UnitDefinition'.
src/core/services/GameInitializationService.ts(21,28): error TS2345: Argument of type '{ id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; description?: string; role?: "Balanced Warrior" | "Pure DPS" | ... 7 more ... | "Master Warrior"; ... 4 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' is not assignable to parameter of type 'UnitDefinition'.
  Property 'id' is optional in type '{ id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; description?: string; role?: "Balanced Warrior" | "Pure DPS" | ... 7 more ... | "Master Warrior"; ... 4 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' but required in type 'UnitDefinition'.
src/core/services/QueueBattleService.test.ts(34,19): error TS2345: Argument of type '{ id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; description?: string; role?: "Balanced Warrior" | "Pure DPS" | ... 7 more ... | "Master Warrior"; ... 4 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' is not assignable to parameter of type 'UnitDefinition'.
  Property 'id' is optional in type '{ id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; description?: string; role?: "Balanced Warrior" | "Pure DPS" | ... 7 more ... | "Master Warrior"; ... 4 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' but required in type 'UnitDefinition'.
src/core/services/QueueBattleService.test.ts(39,19): error TS2345: Argument of type '{ id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; description?: string; role?: "Balanced Warrior" | "Pure DPS" | ... 7 more ... | "Master Warrior"; ... 4 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' is not assignable to parameter of type 'UnitDefinition'.
  Property 'id' is optional in type '{ id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; description?: string; role?: "Balanced Warrior" | "Pure DPS" | ... 7 more ... | "Master Warrior"; ... 4 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' but required in type 'UnitDefinition'.
src/core/services/QueueBattleService.test.ts(46,40): error TS2345: Argument of type '{ id: string; baseStats: { def: number; hp?: number; pp?: number; atk?: number; mag?: number; spd?: number; }; name: string; element: Element; role: UnitRole; growthRates: Stats; ... 17 more ...; isBroken?: boolean; }[]' is not assignable to parameter of type 'readonly Unit[]'.
  Type '{ id: string; baseStats: { def: number; hp?: number; pp?: number; atk?: number; mag?: number; spd?: number; }; name: string; element: Element; role: UnitRole; growthRates: GrowthRates; ... 17 more ...; isBroken?: boolean; }' is not assignable to type 'Unit'.
    Types of property 'baseStats' are incompatible.
      Type '{ def: number; hp?: number; pp?: number; atk?: number; mag?: number; spd?: number; }' is not assignable to type 'Stats'.
        Property 'hp' is optional in type '{ def: number; hp?: number; pp?: number; atk?: number; mag?: number; spd?: number; }' but required in type 'Stats'.
src/core/services/QueueBattleService.test.ts(58,55): error TS2339: Property 'error' does not exist on type 'Result<BattleState, string>'.
  Property 'error' does not exist on type '{ ok: true; value: BattleState; }'.
src/core/services/QueueBattleService.test.ts(80,23): error TS2339: Property 'error' does not exist on type 'Result<BattleState, string>'.
  Property 'error' does not exist on type '{ ok: true; value: BattleState; }'.
src/core/services/QueueBattleService.test.ts(103,56): error TS2339: Property 'error' does not exist on type 'Result<BattleState, string>'.
  Property 'error' does not exist on type '{ ok: true; value: BattleState; }'.
src/core/services/QueueBattleService.test.ts(127,34): error TS2345: Argument of type '{ baseStats: { spd: number; hp?: number; pp?: number; atk?: number; def?: number; mag?: number; }; id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; ... 5 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' is not assignable to parameter of type 'UnitDefinition'.
  Property 'id' is optional in type '{ baseStats: { spd: number; hp?: number; pp?: number; atk?: number; def?: number; mag?: number; }; id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; ... 5 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' but required in type 'UnitDefinition'.
src/core/services/QueueBattleService.test.ts(128,34): error TS2345: Argument of type '{ baseStats: { spd: number; hp?: number; pp?: number; atk?: number; def?: number; mag?: number; }; id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; ... 5 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' is not assignable to parameter of type 'UnitDefinition'.
  Property 'id' is optional in type '{ baseStats: { spd: number; hp?: number; pp?: number; atk?: number; def?: number; mag?: number; }; id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; ... 5 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' but required in type 'UnitDefinition'.
src/core/services/QueueBattleService.test.ts(131,37): error TS2345: Argument of type '{ baseStats: { spd: number; hp?: number; pp?: number; atk?: number; def?: number; mag?: number; }; id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; ... 5 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' is not assignable to parameter of type 'UnitDefinition'.
  Property 'id' is optional in type '{ baseStats: { spd: number; hp?: number; pp?: number; atk?: number; def?: number; mag?: number; }; id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; ... 5 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' but required in type 'UnitDefinition'.
src/core/services/QueueBattleService.test.ts(138,77): error TS2339: Property 'error' does not exist on type 'Result<BattleState, string>'.
  Property 'error' does not exist on type '{ ok: true; value: BattleState; }'.
src/core/services/QueueBattleService.test.ts(142,77): error TS2339: Property 'error' does not exist on type 'Result<BattleState, string>'.
  Property 'error' does not exist on type '{ ok: true; value: BattleState; }'.
src/core/services/QueueBattleService.test.ts(162,38): error TS2345: Argument of type '{ id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; description?: string; role?: "Balanced Warrior" | "Pure DPS" | ... 7 more ... | "Master Warrior"; ... 4 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' is not assignable to parameter of type 'UnitDefinition'.
  Property 'id' is optional in type '{ id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; description?: string; role?: "Balanced Warrior" | "Pure DPS" | ... 7 more ... | "Master Warrior"; ... 4 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' but required in type 'UnitDefinition'.
src/core/services/QueueBattleService.test.ts(174,56): error TS2339: Property 'error' does not exist on type 'Result<BattleState, string>'.
  Property 'error' does not exist on type '{ ok: true; value: BattleState; }'.
src/core/services/SaveService.ts(267,37): error TS2339: Property 'error' does not exist on type 'Result<{ playerData?: { inventory?: { id?: string; name?: string; slot?: "weapon" | "armor" | "helm" | "boots" | "accessory"; tier?: "basic" | "bronze" | "iron" | "steel" | "silver" | "mythril" | "legendary" | "artifact"; ... 8 more ...; setId?: string; }[]; ... 7 more ...; storyFlags?: Record<...>; }; ... 5 more .....'.
  Property 'error' does not exist on type '{ ok: true; value: { playerData?: { inventory?: { id?: string; name?: string; slot?: "weapon" | "armor" | "helm" | "boots" | "accessory"; tier?: "basic" | "bronze" | "iron" | "steel" | "silver" | "mythril" | "legendary" | "artifact"; ... 8 more ...; setId?: string; }[]; ... 7 more ...; storyFlags?: Record<...>; }; ....'.
src/core/services/SaveService.ts(392,7): error TS2345: Argument of type '{ id?: string; name?: string; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; description?: string; role?: "Balanced Warrior" | "Pure DPS" | "Elemental Mage" | "Healer" | ... 5 more ... | "Master Warrior"; ... 15 more ...; battleStats?: { ...; }; }[]' is not assignable to parameter of type 'readonly Unit[]'.
  Type '{ id?: string; name?: string; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; description?: string; role?: "Balanced Warrior" | "Pure DPS" | "Elemental Mage" | "Healer" | ... 5 more ... | "Master Warrior"; ... 15 more ...; battleStats?: { ...; }; }' is not assignable to type 'Unit'.
    Property 'id' is optional in type '{ id?: string; name?: string; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; description?: string; role?: "Balanced Warrior" | "Pure DPS" | "Elemental Mage" | "Healer" | ... 5 more ... | "Master Warrior"; ... 15 more ...; battleStats?: { ...; }; }' but required in type 'Unit'.
src/core/services/ShopService.ts(41,3): error TS2322: Type 'Result<{ success: true; newGold: number; item: { id?: string; name?: string; slot?: "weapon" | "armor" | "helm" | "boots" | "accessory"; tier?: "basic" | "bronze" | "iron" | "steel" | "silver" | "mythril" | "legendary" | "artifact"; ... 8 more ...; setId?: string; }; }, never>' is not assignable to type 'Result<{ success: boolean; newGold: number; item: Equipment; }, string>'.
  Type '{ ok: true; value: { success: true; newGold: number; item: { id?: string; name?: string; slot?: "weapon" | "armor" | "helm" | "boots" | "accessory"; tier?: "basic" | "bronze" | "iron" | "steel" | "silver" | "mythril" | "legendary" | "artifact"; ... 8 more ...; setId?: string; }; }; }' is not assignable to type 'Result<{ success: boolean; newGold: number; item: Equipment; }, string>'.
    Type '{ ok: true; value: { success: true; newGold: number; item: { id?: string; name?: string; slot?: "weapon" | "armor" | "helm" | "boots" | "accessory"; tier?: "basic" | "bronze" | "iron" | "steel" | "silver" | "mythril" | "legendary" | "artifact"; ... 8 more ...; setId?: string; }; }; }' is not assignable to type '{ ok: true; value: { success: boolean; newGold: number; item: Equipment; }; }'.
      The types of 'value.item' are incompatible between these types.
        Type '{ id?: string; name?: string; slot?: "weapon" | "armor" | "helm" | "boots" | "accessory"; tier?: "basic" | "bronze" | "iron" | "steel" | "silver" | "mythril" | "legendary" | "artifact"; ... 8 more ...; setId?: string; }' is not assignable to type 'Equipment'.
          Property 'id' is optional in type '{ id?: string; name?: string; slot?: "weapon" | "armor" | "helm" | "boots" | "accessory"; tier?: "basic" | "bronze" | "iron" | "steel" | "silver" | "mythril" | "legendary" | "artifact"; ... 8 more ...; setId?: string; }' but required in type 'Equipment'.
src/core/services/ShopService.ts(69,24): error TS2345: Argument of type '{ id?: string; name?: string; slot?: "weapon" | "armor" | "helm" | "boots" | "accessory"; tier?: "basic" | "bronze" | "iron" | "steel" | "silver" | "mythril" | "legendary" | "artifact"; ... 8 more ...; setId?: string; }' is not assignable to parameter of type 'Equipment'.
  Property 'id' is optional in type '{ id?: string; name?: string; slot?: "weapon" | "armor" | "helm" | "boots" | "accessory"; tier?: "basic" | "bronze" | "iron" | "steel" | "silver" | "mythril" | "legendary" | "artifact"; ... 8 more ...; setId?: string; }' but required in type 'Equipment'.
src/core/services/ShopService.ts(96,3): error TS2322: Type 'Result<{ newGold: number; item: { id?: string; name?: string; slot?: "weapon" | "armor" | "helm" | "boots" | "accessory"; tier?: "basic" | "bronze" | "iron" | "steel" | "silver" | "mythril" | "legendary" | "artifact"; ... 8 more ...; setId?: string; }; }, never>' is not assignable to type 'Result<{ newGold: number; item: Equipment; }, string>'.
  Type '{ ok: true; value: { newGold: number; item: { id?: string; name?: string; slot?: "weapon" | "armor" | "helm" | "boots" | "accessory"; tier?: "basic" | "bronze" | "iron" | "steel" | "silver" | "mythril" | "legendary" | "artifact"; ... 8 more ...; setId?: string; }; }; }' is not assignable to type 'Result<{ newGold: number; item: Equipment; }, string>'.
    Type '{ ok: true; value: { newGold: number; item: { id?: string; name?: string; slot?: "weapon" | "armor" | "helm" | "boots" | "accessory"; tier?: "basic" | "bronze" | "iron" | "steel" | "silver" | "mythril" | "legendary" | "artifact"; ... 8 more ...; setId?: string; }; }; }' is not assignable to type '{ ok: true; value: { newGold: number; item: Equipment; }; }'.
      The types of 'value.item' are incompatible between these types.
        Type '{ id?: string; name?: string; slot?: "weapon" | "armor" | "helm" | "boots" | "accessory"; tier?: "basic" | "bronze" | "iron" | "steel" | "silver" | "mythril" | "legendary" | "artifact"; ... 8 more ...; setId?: string; }' is not assignable to type 'Equipment'.
          Property 'id' is optional in type '{ id?: string; name?: string; slot?: "weapon" | "armor" | "helm" | "boots" | "accessory"; tier?: "basic" | "bronze" | "iron" | "steel" | "silver" | "mythril" | "legendary" | "artifact"; ... 8 more ...; setId?: string; }' but required in type 'Equipment'.
src/core/services/StoryService.ts(258,36): error TS2345: Argument of type '{ id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; description?: string; role?: "Balanced Warrior" | "Pure DPS" | ... 7 more ... | "Master Warrior"; ... 4 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' is not assignable to parameter of type 'UnitDefinition'.
  Property 'id' is optional in type '{ id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; description?: string; role?: "Balanced Warrior" | "Pure DPS" | ... 7 more ... | "Master Warrior"; ... 4 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' but required in type 'UnitDefinition'.
src/core/utils/enemyToUnit.ts(35,21): error TS2345: Argument of type '{ id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; description?: string; role?: "Balanced Warrior" | "Pure DPS" | ... 7 more ... | "Master Warrior"; ... 4 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' is not assignable to parameter of type 'UnitDefinition'.
  Property 'id' is optional in type '{ id?: string; name?: string; availableIn?: readonly ("campaign" | "tower")[]; element?: "Venus" | "Mars" | "Mercury" | "Jupiter" | "Neutral"; description?: string; role?: "Balanced Warrior" | "Pure DPS" | ... 7 more ... | "Master Warrior"; ... 4 more ...; autoAttackTiming?: "same-turn" | "next-turn"; }' but required in type 'UnitDefinition'.
src/input/InputManager.ts(27,11): error TS2339: Property 'drain' does not exist on type 'any[]'.
src/input/InputManager.ts(33,7): error TS2741: Property 'drain' is missing in type 'any[]' but required in type '{ push: (cmd: string) => void; drain: () => string[]; }'.
src/state/store.ts(1,43): error TS2307: Cannot find module '../dev/driver' or its corresponding type declarations.
src/ui/components/CompendiumScreen.tsx(219,40): error TS2322: Type '{ id?: string; name?: string; slot?: "weapon" | "armor" | "helm" | "boots" | "accessory"; tier?: "basic" | "bronze" | "iron" | "steel" | "silver" | "mythril" | "legendary" | "artifact"; ... 8 more ...; setId?: string; }' is not assignable to type 'Equipment'.
  Property 'id' is optional in type '{ id?: string; name?: string; slot?: "weapon" | "armor" | "helm" | "boots" | "accessory"; tier?: "basic" | "bronze" | "iron" | "steel" | "silver" | "mythril" | "legendary" | "artifact"; ... 8 more ...; setId?: string; }' but required in type 'Equipment'.
src/ui/components/EquipmentChoicePicker.tsx(56,28): error TS2322: Type '{ id?: string; name?: string; slot?: "weapon" | "armor" | "helm" | "boots" | "accessory"; tier?: "basic" | "bronze" | "iron" | "steel" | "silver" | "mythril" | "legendary" | "artifact"; ... 8 more ...; setId?: string; }' is not assignable to type 'Equipment'.
  Property 'id' is optional in type '{ id?: string; name?: string; slot?: "weapon" | "armor" | "helm" | "boots" | "accessory"; tier?: "basic" | "bronze" | "iron" | "steel" | "silver" | "mythril" | "legendary" | "artifact"; ... 8 more ...; setId?: string; }' but required in type 'Equipment'.
src/ui/components/RewardsScreen.tsx(218,34): error TS2322: Type '{ id?: string; name?: string; slot?: "weapon" | "armor" | "helm" | "boots" | "accessory"; tier?: "basic" | "bronze" | "iron" | "steel" | "silver" | "mythril" | "legendary" | "artifact"; ... 8 more ...; setId?: string; }' is not assignable to type 'Equipment'.
  Property 'id' is optional in type '{ id?: string; name?: string; slot?: "weapon" | "armor" | "helm" | "boots" | "accessory"; tier?: "basic" | "bronze" | "iron" | "steel" | "silver" | "mythril" | "legendary" | "artifact"; ... 8 more ...; setId?: string; }' but required in type 'Equipment'.
src/ui/components/RewardsScreen.tsx(233,34): error TS2322: Type '{ id?: string; name?: string; slot?: "weapon" | "armor" | "helm" | "boots" | "accessory"; tier?: "basic" | "bronze" | "iron" | "steel" | "silver" | "mythril" | "legendary" | "artifact"; ... 8 more ...; setId?: string; }' is not assignable to type 'Equipment'.
  Property 'id' is optional in type '{ id?: string; name?: string; slot?: "weapon" | "armor" | "helm" | "boots" | "accessory"; tier?: "basic" | "bronze" | "iron" | "steel" | "silver" | "mythril" | "legendary" | "artifact"; ... 8 more ...; setId?: string; }' but required in type 'Equipment'.
src/ui/components/ShopEquipScreen.tsx(92,23): error TS2339: Property 'error' does not exist on type 'Result<{ success: boolean; newGold: number; item: Equipment; }, string>'.
  Property 'error' does not exist on type '{ ok: true; value: { success: boolean; newGold: number; item: Equipment; }; }'.
src/ui/components/ShopEquipScreen.tsx(107,23): error TS2339: Property 'error' does not exist on type 'Result<{ newGold: number; equipment: Equipment[]; }, string>'.
  Property 'error' does not exist on type '{ ok: true; value: { newGold: number; equipment: Equipment[]; }; }'.
src/ui/components/ShopEquipScreen.tsx(124,23): error TS2339: Property 'error' does not exist on type 'Result<{ newGold: number; item: Equipment; }, string>'.
  Property 'error' does not exist on type '{ ok: true; value: { newGold: number; item: Equipment; }; }'.
src/ui/components/ShopEquipScreen.tsx(293,52): error TS2322: Type '{ id?: string; name?: string; slot?: "weapon" | "armor" | "helm" | "boots" | "accessory"; tier?: "basic" | "bronze" | "iron" | "steel" | "silver" | "mythril" | "legendary" | "artifact"; ... 8 more ...; setId?: string; }' is not assignable to type 'Equipment'.
  Property 'id' is optional in type '{ id?: string; name?: string; slot?: "weapon" | "armor" | "helm" | "boots" | "accessory"; tier?: "basic" | "bronze" | "iron" | "steel" | "silver" | "mythril" | "legendary" | "artifact"; ... 8 more ...; setId?: string; }' but required in type 'Equipment'.
src/ui/components/ShopEquipScreen.tsx(334,48): error TS2322: Type '{ id?: string; name?: string; slot?: "weapon" | "armor" | "helm" | "boots" | "accessory"; tier?: "basic" | "bronze" | "iron" | "steel" | "silver" | "mythril" | "legendary" | "artifact"; ... 8 more ...; setId?: string; }' is not assignable to type 'Equipment'.
  Property 'id' is optional in type '{ id?: string; name?: string; slot?: "weapon" | "armor" | "helm" | "boots" | "accessory"; tier?: "basic" | "bronze" | "iron" | "steel" | "silver" | "mythril" | "legendary" | "artifact"; ... 8 more ...; setId?: string; }' but required in type 'Equipment'.
src/ui/components/TowerHubScreen.tsx(406,3): error TS2322: Type '{ rewards?: { type?: "equipment" | "djinn" | "recruit"; ids?: string[]; notes?: string; }[]; floorNumber?: number; }' is not assignable to type '{ floorNumber: number; rewards: { type?: "equipment" | "djinn" | "recruit"; ids?: string[]; notes?: string; }[]; }'.
  Property 'floorNumber' is optional in type '{ rewards?: { type?: "equipment" | "djinn" | "recruit"; ids?: string[]; notes?: string; }[]; floorNumber?: number; }' but required in type '{ floorNumber: number; rewards: { type?: "equipment" | "djinn" | "recruit"; ids?: string[]; notes?: string; }[]; }'.

Coverage summary:
- Vitest coverage was not collected (test:coverage not run). See unit test section of log for details.

Next actions (priority order):
1. Fix TypeScript errors reported in src/core/ (see log excerpt above). These are the root cause blocking a green CI.
2. Re-run `pnpm run typecheck` locally and iterate until no tsc errors remain.
3. Once typecheck is clean, run `pnpm run lint` and `pnpm run test` to resolve any remaining failures.
4. Run `pnpm run test:e2e` and `pnpm run test:coverage` to complete full validation and update VALIDATION.md with coverage numbers.

Notes:
- No source code changes were made by this worker; only validation artifacts were produced under tests/validation and VALIDATION.md was updated to reflect the run.
- If permission is granted to patch src/, proceed to fix the TypeScript issues at src/core/algorithms/damage.ts and src/core/algorithms/status.ts (see log excerpt).



## CI Validation run - 2026-01-16T03:43:37.889Z

Results:
- lint: 0
- test: 0
- e2e: 1
- visreg: 1

Logs: tests/validation/lint.log, tests/validation/test.log, tests/validation/e2e.log, tests/validation/visreg.log

Next actions:
- Investigate any non-zero exit codes by reviewing corresponding logs and opening issues.

Coverage summary: see tests/validation/test.log for coverage output if present.

## CI run summary - 2026-01-16T03:57:21Z

- ci log: tests/validation/ci_run.log
- typecheck exit: 0
- lint exit: 0
- unit tests exit: 0
- e2e exit: null

Notes:
- TypeScript errors detected in src/core/*; see tests/validation/ci_run.log for samples and stack traces.

Next actions:
- Investigate and fix TypeScript type issues (core algorithms/save/services).
- Re-run CI after fixes; aim for all exit codes 0 and coverage >= previous baseline.


## Automated CI-local append (timestamp: ${TS})
- pnpm version: see tests/validation/pnpm_version.txt
- typecheck: failed (exit code 2) — see tests/validation/typecheck.log
- lint: passed (exit code 0) — see tests/validation/lint.log
- unit tests: partial pass (343 passed | 8 skipped | 13 todo), coverage generation failed — see tests/validation/unit_test.log
- coverage error: ENOENT: coverage/.tmp/coverage-*.json — investigate coverage provider
- e2e: not completed or interrupted — see tests/validation/e2e.log

Next actions:
- Fix TS errors (see tests/validation/typecheck.log)
- Ensure coverage provider writes temporary files (check permissions/path)
- Install Playwright browsers and re-run e2e: `npx playwright install` then `pnpm run test:e2e`
- After fixes, re-run full CI-local and update VALIDATION.md and tests/validation/memory_result.json
