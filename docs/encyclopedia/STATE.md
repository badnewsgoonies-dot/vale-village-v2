# Vale Village State Management
<!-- Generated: 2026-01-06T09:18:24-05:00 -->

## Store Files
src/store
src/store/gameStore.ts
src/ui/state/store.ts

## Slices
src/ui/state/teamSlice.ts
src/ui/state/storySlice.ts
src/ui/state/rewardsSlice.ts
src/ui/state/queueBattleSlice.ts
src/ui/state/devModeSlice.ts
src/ui/state/inventorySlice.ts
src/ui/state/dialogueSlice.ts
src/ui/state/saveSlice.ts
src/ui/state/gameFlowSlice.ts
src/ui/state/overworldSlice.ts
src/ui/state/towerSlice.ts
src/ui/state/battleSlice.ts

## State Shape (from slices)
```
    initialState: Partial<PlayerState> = {},
      x: initialState.x ?? 200,
      y: initialState.y ?? 490, // Adjusted for new road position (460-520)
      facing: initialState.facing ?? 'down',
      unitId: initialState.unitId ?? 'adept',
      isMoving: initialState.isMoving ?? false,
```
