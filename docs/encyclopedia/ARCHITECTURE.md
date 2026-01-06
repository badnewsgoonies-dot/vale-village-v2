# Vale Village Architecture
<!-- Generated: 2026-01-06T09:18:24-05:00 -->

## Core Directories
### src/core
algorithms
config
constants.ts
migrations
models
random
save
services
utils
validation
### src/game
flow
menus
scenes
systems
### src/ui
components
constants
hooks
SettingsHowToPlayMenu.ts
sprites
state
styles
TouchOverlay.tsx
types
utils
### src/world
transitions
### src/data
credits.json
definitions
schemas
types
validateData.ts
### src/infra
save

## Most Imported
```
     49 preact/hooks
     44 preact
     32 ../models/Unit
     24 zod
     24 ./types
     21 ../state/store
     20 ../../core/models/Unit
     18 ../models/Team
     17 ../engine/types
     16 ../sprites/SimpleSprite
     16 ../models/BattleState
     15 ../utils/result
     14 ../../data/schemas/AbilitySchema
     13 zustand
     12 @/core/models/Unit
     11 @/core/models/Equipment
     10 ../random/prng
     10 ../models/types
      9 ../sprites/mappings
      9 ../../data/schemas/EquipmentSchema
```

## Services
src/core/services/AIService.ts
src/core/services/LevelNormalizationService.ts
src/core/services/BattleService.ts
src/core/services/ShopService.ts
src/core/services/QueueBattleService.ts
src/core/services/DevModeService.ts
src/core/services/StoryService.ts
src/core/services/TowerService.ts
src/core/services/SaveService.ts
src/core/services/RngService.ts
src/core/services/DialogueService.ts
src/core/services/RewardsService.ts
src/core/services/DjinnService.ts
src/core/services/EncounterService.ts
src/core/services/OverworldService.ts

## State
src/main.tsx
src/ui/state/queueBattleSlice.ts
src/ui/state/dialogueSlice.ts
src/ui/state/saveSlice.ts
src/ui/state/store.ts
src/ui/state/gameFlowSlice.ts
src/ui/state/overworldSlice.ts
src/ui/SettingsHowToPlayMenu.ts
src/ui/components/SaveMenu.tsx
src/ui/components/QueueBattleView.tsx
src/ui/components/PostBattleCutscene.tsx
src/ui/components/TitleScreen.tsx
src/ui/components/overworld-v2/layers/TreeLayer.tsx
src/ui/components/overworld-v2/layers/PlayerLayer.ts
src/ui/components/overworld-v2/layers/TerrainLayer.ts
