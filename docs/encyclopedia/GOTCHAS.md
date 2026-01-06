# Vale Village Gotchas
<!-- Generated: 2026-01-06T09:18:24-05:00 -->

## TODOs
```
src/ui/components/RewardsScreen.tsx:84:          // TODO: Add proper error logging for missing unit
src/core/validation/saveFileValidation.ts:340: * TODO (Issue #20): Format validation error for user display
src/core/services/SaveService.ts:536:      chapter: 1, // TODO: Add chapter to SaveV1Schema
src/core/save/SaveService.ts:104:    // TODO: Create separate ReplayPort interface
```

## Type Assertions
```
src/main.tsx:17:  (window as any).gameStore = useGameStore;
src/main.tsx:18:  (window as any).v1Store = v1Store;
src/main.tsx:19:  (window as any).createBattleFromEncounter = createBattleFromEncounter;
src/main.tsx:20:  (window as any).makePRNG = makePRNG;
src/main.tsx:21:  (window as any).createTeam = createTeam;
src/main.tsx:22:  (window as any).createUnit = createUnit;
src/main.tsx:23:  (window as any).UNIT_DEFINITIONS = UNIT_DEFINITIONS;
src/main.tsx:24:  (window as any).ENCOUNTERS = ENCOUNTERS;
src/ui/SettingsHowToPlayMenu.ts:25:  return setTimeout(fn, 0) as unknown as number;
src/ui/components/RewardsScreen.tsx:34:        <div key={i} class="sparkle" style={{ '--delay': `${i * 0.25}s`, '--left': `${5 + i * 8}%` } as any} />
src/ui/components/RewardsScreen.tsx:159:            <div key={unit.id} class="party-member" style={{ '--index': index } as any}>
src/ui/components/SettingsScreen/SettingsScreen.tsx:132:                      style={{ '--value': `${masterVolume}%` } as any}
src/ui/components/SettingsScreen/SettingsScreen.tsx:151:                      style={{ '--value': `${musicVolume}%` } as any}
src/ui/components/SettingsScreen/SettingsScreen.tsx:170:                      style={{ '--value': `${sfxVolume}%` } as any}
src/ui/components/VirtualJoystick.tsx:184:    joystick.addEventListener('pointerdown', handlePointerDown as any, { passive: false });
```

## Console Statements
```
src/main.tsx:39:  console.error(formatValidationResult(validationResult));
src/ui/utils/text.ts:64:      console.warn(`Unhandled event type:`, _exhaustive);
src/ui/state/teamSlice.ts:71:        console.warn('Roster full (10 units max), cannot add unit');
src/ui/state/teamSlice.ts:132:          console.error(`Unit ${unitId} not found in roster or definitions`);
src/ui/state/queueBattleSlice.ts:70:    console.error('Invalid battle state: missing player team or enemies');
src/ui/state/queueBattleSlice.ts:301:      console.warn(`Failed to queue action: ${result.error}`);
src/ui/state/queueBattleSlice.ts:328:      console.warn(`Failed to clear action: ${result.error}`);
src/ui/state/queueBattleSlice.ts:354:      console.warn(`Failed to queue Djinn: ${result.error}`);
src/ui/state/queueBattleSlice.ts:371:      console.warn(`Failed to unqueue Djinn: ${result.error}`);
src/ui/state/queueBattleSlice.ts:454:          console.warn('Auto-save failed after battle victory:', error);
src/ui/state/queueBattleSlice.ts:457:        console.warn('Auto-save failed after battle victory:', error);
src/ui/state/dialogueSlice.ts:177:    console.warn(`[endDialogue] prevMode=${prevMode}, returnMode=${returnMode}, nextMode=${nextMode}`);
src/ui/state/dialogueSlice.ts:269:          console.warn('Quest accepted!');
src/ui/state/dialogueSlice.ts:271:          console.warn('setStoryFlag not available - quest flag not saved');
src/ui/state/dialogueSlice.ts:287:        console.warn(`Starting battle from dialogue: ${encounterId}`);
```
