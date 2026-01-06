# Vale Village Improvement Backlog
<!-- Generated: 2026-01-06T09:20:20-05:00 -->
<!-- Source: docs/encyclopedia/ audit -->

This is an AI-generated backlog of bugs, improvements, and technical debt identified from systematic codebase analysis.

---

## 🔴 CRITICAL: Bugs & Errors

### Type Safety Issues (as any / as unknown)
```
- [ ] src/main.tsx:17:  (window as any).gameStore = useGameStore;
- [ ] src/main.tsx:18:  (window as any).v1Store = v1Store;
- [ ] src/main.tsx:19:  (window as any).createBattleFromEncounter = createBattleFromEncounter;
- [ ] src/main.tsx:20:  (window as any).makePRNG = makePRNG;
- [ ] src/main.tsx:21:  (window as any).createTeam = createTeam;
- [ ] src/main.tsx:22:  (window as any).createUnit = createUnit;
- [ ] src/main.tsx:23:  (window as any).UNIT_DEFINITIONS = UNIT_DEFINITIONS;
- [ ] src/main.tsx:24:  (window as any).ENCOUNTERS = ENCOUNTERS;
- [ ] src/ui/SettingsHowToPlayMenu.ts:25:  return setTimeout(fn, 0) as unknown as number;
- [ ] src/ui/components/RewardsScreen.tsx:34:        <div key={i} class="sparkle" style={{ '--delay': `${i * 0.25}s`, '--left': `${5 + i * 8}%` } as any} />
- [ ] src/ui/components/RewardsScreen.tsx:159:            <div key={unit.id} class="party-member" style={{ '--index': index } as any}>
- [ ] src/ui/components/SettingsScreen/SettingsScreen.tsx:132:                      style={{ '--value': `${masterVolume}%` } as any}
- [ ] src/ui/components/SettingsScreen/SettingsScreen.tsx:151:                      style={{ '--value': `${musicVolume}%` } as any}
- [ ] src/ui/components/SettingsScreen/SettingsScreen.tsx:170:                      style={{ '--value': `${sfxVolume}%` } as any}
- [ ] src/ui/components/VirtualJoystick.tsx:184:    joystick.addEventListener('pointerdown', handlePointerDown as any, { passive: false });
- [ ] src/ui/components/VirtualJoystick.tsx:185:    window.addEventListener('pointermove', handlePointerMove as any, { passive: false });
- [ ] src/ui/components/VirtualJoystick.tsx:186:    window.addEventListener('pointerup', handlePointerUp as any, { passive: false });
- [ ] src/ui/components/VirtualJoystick.tsx:195:      joystick.removeEventListener('pointerdown', handlePointerDown as any);
- [ ] src/ui/components/VirtualJoystick.tsx:196:      window.removeEventListener('pointermove', handlePointerMove as any);
- [ ] src/ui/components/VirtualJoystick.tsx:197:      window.removeEventListener('pointerup', handlePointerUp as any);
```

### Non-null Assertions (potential runtime errors)
```
- [ ] src/ui/components/ShopEquipScreen.tsx:150:    const updatedUnits = team!.units.map((u) => (u.id === selectedUnit.id ? updatedUnit : u));
- [ ] src/ui/components/ShopEquipScreen.tsx:170:    const updatedUnits = team!.units.map((u) => (u.id === selectedUnit.id ? updatedUnit : u));
- [ ] src/core/services/AIService.ts:222:      return [koTargets[0]!.id];
- [ ] src/core/services/AIService.ts:266:          return [nonOverkill[0]!.target.id];
- [ ] src/core/services/AIService.ts:276:        return [scored[0]!.target.id];
- [ ] src/core/services/AIService.ts:286:          return [validTargets[0]!.id];
- [ ] src/core/services/AIService.ts:301:        return [scored[0]!.target.id];
- [ ] src/core/services/AIService.ts:313:        return [healers[0]!.id];
- [ ] src/core/services/AIService.ts:317:        return [validTargets[0]!.id];
- [ ] src/core/services/AIService.ts:337:      return [validTargets[index]!.id];
- [ ] src/core/services/AIService.ts:360:        return [scored[0]!.target.id];
- [ ] src/core/services/AIService.ts:368:        return [validTargets[0]!.id];
- [ ] src/core/services/AIService.ts:467:  let chosenAbility = scored[0]!.ability;
- [ ] src/core/services/AIService.ts:469:  if (scored.length > 1 && scored[0]!.score - scored[1]!.score < 2.0) {
- [ ] src/core/services/AIService.ts:473:    chosenAbility = topTwo[index]!.ability;
```

## 🟡 TODO: Developer-Marked Items

- [ ] `src/ui/components/RewardsScreen.tsx:84`           // TODO: Add proper error logging for missing unit
- [ ] `src/core/validation/saveFileValidation.ts:340`  * TODO (Issue #20): Format validation error for user display
- [ ] `src/core/services/SaveService.ts:536`       chapter: 1, // TODO: Add chapter to SaveV1Schema
- [ ] `src/core/save/SaveService.ts:104`     // TODO: Create separate ReplayPort interface

## 🟠 CLEANUP: Debug Statements

Console statements to remove before production:

- [x] `src/main.tsx:39` - remove console statement (AUTO-FIXED)
- [x] `src/ui/utils/text.ts:64` - remove console statement (AUTO-FIXED)
- [x] `src/ui/state/teamSlice.ts:71` - remove console statement (AUTO-FIXED)
- [x] `src/ui/state/teamSlice.ts:132` - remove console statement (AUTO-FIXED)
- [x] `src/ui/state/queueBattleSlice.ts:70` - remove console statement (AUTO-FIXED)
- [x] `src/ui/state/queueBattleSlice.ts:301` - remove console statement (AUTO-FIXED)
- [x] `src/ui/state/queueBattleSlice.ts:328` - remove console statement (AUTO-FIXED)
- [x] `src/ui/state/queueBattleSlice.ts:354` - remove console statement (AUTO-FIXED)
- [x] `src/ui/state/queueBattleSlice.ts:371` - remove console statement (AUTO-FIXED)
- [x] `src/ui/state/queueBattleSlice.ts:454` - remove console statement (AUTO-FIXED)
- [x] `src/ui/state/queueBattleSlice.ts:457` - remove console statement (AUTO-FIXED)
- [x] `src/ui/state/dialogueSlice.ts:177` - remove console statement (AUTO-FIXED)
- [x] `src/ui/state/dialogueSlice.ts:269` - remove console statement (AUTO-FIXED)
- [x] `src/ui/state/dialogueSlice.ts:271` - remove console statement (AUTO-FIXED)
- [x] `src/ui/state/dialogueSlice.ts:287` - remove console statement (AUTO-FIXED)
- [x] `src/ui/state/dialogueSlice.ts:318` - remove console statement (AUTO-FIXED)
- [x] `src/ui/state/dialogueSlice.ts:320` - remove console statement (AUTO-FIXED)
- [x] `src/ui/state/dialogueSlice.ts:337` - remove console statement (AUTO-FIXED)
- [x] `src/ui/state/dialogueSlice.ts:340` - remove console statement (AUTO-FIXED)
- [x] `src/ui/state/dialogueSlice.ts:343` - remove console statement (AUTO-FIXED)
- [x] `src/ui/state/dialogueSlice.ts:346` - remove console statement (AUTO-FIXED)
- [x] `src/ui/state/dialogueSlice.ts:353` - remove console statement (AUTO-FIXED)
- [x] `src/ui/state/dialogueSlice.ts:359` - remove console statement (AUTO-FIXED)
- [x] `src/ui/state/dialogueSlice.ts:374` - remove console statement (AUTO-FIXED)
- [x] `src/ui/state/saveSlice.ts:186` - remove console statement (AUTO-FIXED)

## 🔴 ERROR HANDLING: Silent Failures

Empty or minimal catch blocks that swallow errors:

- [ ] `src/ui/state/queueBattleSlice.ts:453` - review error handling
- [ ] `src/ui/state/queueBattleSlice.ts:456` - review error handling
- [ ] `src/ui/state/dialogueSlice.ts:373` - review error handling
- [ ] `src/ui/state/saveSlice.ts:308` - review error handling
- [ ] `src/ui/state/saveSlice.ts:456` - review error handling
- [ ] `src/ui/state/gameFlowSlice.ts:114` - review error handling
- [ ] `src/ui/state/gameFlowSlice.ts:361` - review error handling
- [ ] `src/ui/state/gameFlowSlice.ts:392` - review error handling
- [ ] `src/ui/state/battleSlice.ts:217` - review error handling
- [ ] `src/ui/components/SaveMenu.tsx:102` - review error handling
- [ ] `src/ui/components/SaveMenu.tsx:122` - review error handling
- [ ] `src/ui/components/overworld-v2/OverworldV2.tsx:264` - review error handling
- [ ] `src/ui/components/overworld-v2/OverworldV2.tsx:297` - review error handling
- [ ] `src/ui/components/overworld/layers/EntityLayer.ts:436` - review error handling
- [ ] `src/ui/components/overworld/systems/SceneTransition.ts:66` - review error handling

## 🟡 TESTING: Coverage Gaps

### Services without test files
- [ ] `src/core/services/AIService.ts` - needs test file
- [ ] `src/core/services/LevelNormalizationService.ts` - needs test file
- [ ] `src/core/services/BattleService.ts` - needs test file
- [ ] `src/core/services/ShopService.ts` - needs test file
- [ ] `src/core/services/QueueBattleService.ts` - needs test file
- [ ] `src/core/services/DevModeService.ts` - needs test file
- [ ] `src/core/services/StoryService.ts` - needs test file
- [ ] `src/core/services/TowerService.ts` - needs test file
- [ ] `src/core/services/SaveService.ts` - needs test file
- [ ] `src/core/services/RngService.ts` - needs test file
- [ ] `src/core/services/DialogueService.ts` - needs test file
- [ ] `src/core/services/RewardsService.ts` - needs test file
- [ ] `src/core/services/DjinnService.ts` - needs test file
- [ ] `src/core/services/EncounterService.ts` - needs test file
- [ ] `src/core/services/OverworldService.ts` - needs test file

## 🟠 COMPLEXITY: Large Files (>300 lines)

- [ ] `src/ui/sprites/sprite-list-generated.ts` (6303 lines) - consider splitting
- [ ] `src/data/definitions/abilities.ts` (3633 lines) - consider splitting
- [ ] `src/data/definitions/enemies.ts` (2718 lines) - consider splitting
- [ ] `src/data/definitions/djinnAbilities.ts` (2120 lines) - consider splitting
- [ ] `src/ui/components/QueueBattleView.tsx` (1935 lines) - consider splitting
- [ ] `src/data/definitions/dialogues.ts` (1853 lines) - consider splitting
- [ ] `src/ui/components/overworld/engine/OverworldEngine.ts` (1278 lines) - consider splitting
- [ ] `src/data/definitions/djinn.ts` (1278 lines) - consider splitting
- [ ] `src/data/definitions/equipment.ts` (1121 lines) - consider splitting
- [ ] `src/core/services/QueueBattleService.ts` (1026 lines) - consider splitting
- [ ] `src/data/definitions/encounters.ts` (926 lines) - consider splitting
- [ ] `src/core/services/BattleService.ts` (899 lines) - consider splitting
- [ ] `src/data/definitions/banterDialogues.ts` (866 lines) - consider splitting
- [ ] `src/ui/components/CompendiumScreen.tsx` (827 lines) - consider splitting
- [ ] `src/ui/components/BattleActionMenu.tsx` (808 lines) - consider splitting

## 🟡 DEPENDENCIES: Import Health

### Deeply nested imports (../../../)
- [ ] Deep import: `import { loadSprite } from '../../../sprites/loader';` - consider path aliases
- [ ] Deep import: `import { loadSprite } from '../../../sprites/loader';` - consider path aliases
- [ ] Deep import: `import { getPlayerSprite, shouldMirrorSprite, type Direction } from '../../../sprites/mappings/overworldSprites';` - consider path aliases
- [ ] Deep import: `import { loadSprite } from '../../../sprites/loader';` - consider path aliases
- [ ] Deep import: `import { getNPCSprite } from '../../../sprites/mappings/overworldSprites';` - consider path aliases
- [ ] Deep import: `import { loadSprite } from '../../../sprites/loader';` - consider path aliases
- [ ] Deep import: `import { useGameStore } from '../../../store/gameStore';` - consider path aliases
- [ ] Deep import: `import { isHouseUnlocked } from '../../../core/services/StoryService';` - consider path aliases
- [ ] Deep import: `import type { GameMap, NPC } from '../../../../data/schemas/mapSchema';` - consider path aliases
- [ ] Deep import: `import { loadSprite } from '../../../sprites/loader';` - consider path aliases

## 🟢 ACCESSIBILITY: A11y Audit

### onClick without keyboard handler
- [ ] `src/ui/components/EquipmentChoicePicker.tsx:30` - add keyboard handler
- [ ] `src/ui/components/SaveMenu.tsx:146` - add keyboard handler
- [ ] `src/ui/components/SaveMenu.tsx:147` - add keyboard handler
- [ ] `src/ui/components/SaveMenu.tsx:164` - add keyboard handler
- [ ] `src/ui/components/SaveMenu.tsx:185` - add keyboard handler
- [ ] `src/ui/components/SaveMenu.tsx:201` - add keyboard handler
- [ ] `src/ui/components/SaveMenu.tsx:223` - add keyboard handler
- [ ] `src/ui/components/SaveMenu.tsx:290` - add keyboard handler
- [ ] `src/ui/components/SaveMenu.tsx:296` - add keyboard handler
- [ ] `src/ui/components/SaveMenu.tsx:312` - add keyboard handler

---

## Summary

| Category | Count |
|----------|-------|
| Type Safety Issues | 54 |
| TODOs/FIXMEs | 4 |
| Console Statements | 113 |
| Large Files (>300 lines) | 55 |

<!-- END BACKLOG -->
