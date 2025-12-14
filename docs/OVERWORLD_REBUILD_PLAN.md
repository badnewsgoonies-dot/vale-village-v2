# OVERWORLD REBUILD PLAN - Brick by Brick

## Executive Summary

**Goal:** Build a NEW polished overworld from scratch (not patch the old one)

**Vision:** Golden Sun-inspired pseudo-3D village where player walks past 30 houses in a perfect horizontal line, with a visible black road, Battle Tower at the start, and smooth interior transitions.

---

## Analysis Findings

### What the User Wants
1. **30 houses** arranged in a single horizontal row
2. **Black road band** visually present below house entrances
3. **Battle Tower** prominently placed near first house
4. **Hold RIGHT to sweep past all houses** - perfect horizontal alignment
5. **Smooth interior entry** with fade transitions and unique furniture
6. **Golden Sun aesthetic** - warm, nostalgic, pseudo-3D feel
7. **NO minimap** (explicitly removed)

### What's Currently Broken
1. **Coordinate mismatch** - Buildings in screen pixels (Y=280), player in world pixels (Y=0-240), 11x scaling
2. **Missing black road** - TerrainLayer renders grass, skips path tiles
3. **Wrong house count** - 20 houses, need 30
4. **Orphaned systems** - ProximitySystem disabled in scene mode
5. **Stretched terrain** - 16x32px sprites stretched to 48x48 look terrible

### What Works (Keep These)
1. **SkyLayer** - Beautiful time-of-day gradient, clouds, sun/moon, stars
2. **BackgroundLayer** - 3-layer parallax mountains
3. **InteriorFloorLayer** - Angled perspective walls, wood planks
4. **InteriorFurnitureLayer** - 20 unique house layouts
5. **SceneTransition** - Smooth fade-to-black
6. **Safety fixes** - dt clamping, transition guards, null checks

---

## Architecture: Clean Slate Design

### Unified Coordinate System
**DECISION:** Everything in WORLD PIXELS with camera as only transform

**Terminology:**
- **World Pixels** - The "true" coordinate space where everything lives (0 to ~4000px wide)
- **Screen Pixels** - The 960×640 viewport that shows a window into the world
- **Camera Offset** - The ONLY transform: `screenX = worldX - camera.x`

```
World Pixels (horizontal scroll, ~4000px wide):
- Sky: 0-256px height (top 40% of viewport)
- Mountains: 100-300px height (parallax at 0.15-0.35 of camera)
- Road: Y=420-480 (dark band below buildings)
- Buildings: ground line at Y=420 (bottom-center anchored)
- Player: moves on/around road (can step slightly above Y=420 to enter doors)

Viewport (Screen Pixels): 960×640
- Camera.x ranges from 0 to (worldWidth - 960)
- Camera.y = 0 (no vertical scroll)
```

**NO SCALING LAYERS** - The 11× vertical scale from the old system is eliminated entirely.

### Layer Stack (Z-order)
```
0. SkyLayer (KEEP)           - Sky gradient, sun/moon, clouds
1. BackgroundLayer (KEEP)    - Parallax mountains
2. RoadLayer (NEW)           - Black road band
3. VillageLayer (NEW)        - 30 houses + Battle Tower
4. PlayerLayer (NEW)         - Player sprite only
5. UILayer (NEW)             - Door prompts, location banner
6. TransitionLayer (KEEP)    - Fade overlay
```

### Sprite Anchor Convention
**DECISION:** All sprites anchored at BOTTOM-CENTER

```
For a building sprite (e.g., 64×96 pixels):
- position.x = center of building (door center)
- position.y = ground line (bottom of sprite, where it meets road)
- Draw call: ctx.drawImage(sprite, x - width/2, y - height, width, height)

Example:
  House at world position (500, 420)
  - 500 = horizontal center of house
  - 420 = ground line (top of road band)
  - Sprite draws UPWARD from ground line

  Door position = (500, 420) exactly
  Player at (500, 440) is 20px below door = standing on road in front
```

**Benefits:**
- "Doors on the road" stays true for every sprite
- Y-sorting works naturally (higher Y = in front)
- Easy collision: door is at exact sprite position
- Consistent across houses, tower, trees, player

### File Structure (New)
```
src/ui/components/overworld-v2/
├── OverworldV2.tsx          # Main component (clean)
├── engine/
│   ├── OverworldEngineV2.ts # Simplified engine
│   ├── Camera.ts            # Keep existing
│   └── types.ts             # Simplified types
├── layers/
│   ├── SkyLayer.ts          # Keep existing
│   ├── BackgroundLayer.ts   # Keep existing
│   ├── RoadLayer.ts         # NEW - black road band
│   ├── VillageLayer.ts      # NEW - houses + tower
│   └── PlayerLayer.ts       # NEW - player only
├── systems/
│   ├── InputSystem.ts       # NEW - clean input handling
│   ├── InteractionSystem.ts # NEW - door proximity
│   └── SceneTransition.ts   # Keep existing
└── data/
    └── villageLayout.ts     # NEW - 30 house positions
```

---

## BRICK-BY-BRICK IMPLEMENTATION

### Phase 1: Foundation (Bricks 1-5)

#### Brick 1: Create overworld-v2 directory structure
- Create `/src/ui/components/overworld-v2/` directory
- Create subdirectories: engine/, layers/, systems/, data/
- Add barrel exports (index.ts files)

#### Brick 2: Define unified coordinate constants
- Create `data/constants.ts` with viewport dimensions (screen pixels)
- Define layer heights: SKY_HEIGHT=256, ROAD_Y_TOP=420, ROAD_Y_BOTTOM=480, BUILDING_GROUND_Y=420
- Define 30 house X positions (programmatic spacing)
- Define Battle Tower position (near first house)

#### Brick 3: Create OverworldEngineV2 skeleton
- Simple game loop: update(dt) → render(ctx)
- Camera that only scrolls horizontally
- Layer array with z-order rendering
- NO scaling; everything lives in world pixels and renders via camera offset (`screenX = worldX - camera.x`)

#### Brick 4: Create OverworldV2.tsx component
- Canvas element with 960x640 dimensions
- Keyboard input handling (arrow keys, SPACE)
- Connect to gameStore for map/player state
- Initialize engine on mount

#### Brick 5: Copy working layers (Sky, Background)
- Copy SkyLayer.ts as-is
- Copy BackgroundLayer.ts as-is
- Wire into OverworldEngineV2 layer stack
- Verify sky/mountains render correctly

### Phase 2: Road & Village (Bricks 6-10)

#### Brick 6: Create RoadLayer
- Render black/dark gray road band at Y=420-480
- Add subtle texture (not solid flat)
- Road extends full canvas width (scrolls with camera)
- Optional: lane markings or cobblestone pattern

#### Brick 7: Define village layout data
- Create `villageLayout.ts` with 30 house definitions
- Each house: { id, x, y, spriteId, doorX, interiorMapId }
- Battle Tower at x=100
- Houses spaced ~120px apart (100 + 30*120 = 3700px total width)
- All buildings share the same ground line Y=420 (doors on road top)

#### Brick 8: Create VillageLayer (buildings only)
- Load house sprites from public/sprites/buildings/Vale/
- Render all 30 houses at their positions
- Add shadows under each building
- Y-sort by position (all same Y, so left-to-right order)

#### Brick 9: Add door highlighting
- Track "nearest door" based on player X position
- Render yellow glow behind nearest door
- Pulse animation (sin wave opacity)
- "PRESS SPACE" prompt above glowing door

#### Brick 10: Add Battle Tower
- Render Vale_Sanctum.gif at x=100
- Larger than houses, distinctive
- Different door glow color (blue?)
- Tower trigger at its door position

### Phase 3: Player & Movement (Bricks 11-15)

#### Brick 11: Create PlayerLayer
- Render single player sprite
- Position in world pixels (rendered via camera offset)
- 8-directional sprite based on facing
- Shadow under player

#### Brick 12: Implement horizontal movement
- Player moves freely on the road and can step slightly above it to enter doors
- Velocity-based smooth movement (160px/sec)
- Clamp to world bounds (0 to 3700px)
- Clamp Y to a small band around the road (keeps movement intentional)

#### Brick 13: Camera following
- Camera X follows player X with lerp smoothing
- Camera Y fixed (no vertical scroll)
- Clamp camera to world bounds
- All layers use camera offset for rendering

#### Brick 14: Keep position local, hand (mapId, spawnId) on transitions
- Player position lives ONLY in OverworldEngineV2 (world pixels)
- NO continuous sync back to store (avoids reintroducing coordinate glue)
- On house entry: call `store.teleportPlayer(interiorMapId, 'entrance')`
- On interior exit: engine receives callback with (returnX) and repositions player
- Store only needs to know: current mapId + spawn point ID (not pixel coords)

#### Brick 15: Add facing direction
- Track player facing (left/right based on movement)
- Update sprite accordingly
- Keep facing when stopped

### Phase 4: Interactions (Bricks 16-20)

#### Brick 16: Create InteractionSystem
- Check player distance to each door
- Find nearest door within threshold (80px)
- Track "active door" for prompt rendering
- Emit events for VillageLayer to render prompts

#### Brick 17: Implement SPACE to enter
- When SPACE pressed and near door:
  - Start fade-out transition
  - Determine interior map ID from villageLayout
  - Call store.teleportPlayer(interiorMapId, spawnPoint)
- Guard against double-entry during transition

#### Brick 18: Wire interior transitions
- On mode change to 'interior', switch to interior layers
- Use existing InteriorFloorLayer + InteriorFurnitureLayer
- Exit (DOWN at door) triggers reverse transition
- Restore player position on exit

#### Brick 19: Add house unlock progression
- Track which houses are unlocked (from storyFlags)
- Locked doors show different visual (gray, no glow)
- "LOCKED" prompt instead of "ENTER"
- First house always unlocked

#### Brick 20: Battle Tower entry
- Tower door behaves like house door
- Triggers tower mode via enterTowerFromOverworld()
- Different prompt ("CHALLENGE" or "ENTER TOWER")

### Phase 5: Polish & Integration (Bricks 21-25)

#### Brick 21: Location banner
- Show "Vale Village" banner on enter
- Fade in/out animation
- Position at top of screen
- Auto-hide after 3 seconds

#### Brick 22: Expand to 30 exteriors (reuse interiors)
- Add 30 exterior house positions in villageLayout.ts
- REUSE existing 20 interior layouts (houses 21-30 map to layouts 1-10)
- Permute furniture placement slightly via seed offset
- Add 10 more encounters (can share enemy types, vary stats)
- Update progression flags for 30 houses
- **SCOPE CONTROL:** Ship with reused interiors, expand unique layouts incrementally

#### Brick 23: Wire to App.tsx
- Replace OverworldCanvas with OverworldV2
- Keep OverworldCanvas as backup (feature flag?)
- Test full game flow: title → overworld → battle → rewards

#### Brick 24: Performance optimization
- Only render visible buildings (camera culling)
- Cache sprite images
- Dirty flag for static elements
- Profile and fix any frame drops

#### Brick 25: Final testing & cleanup
- Test all 30 house entries
- Test Battle Tower entry
- Test interior transitions
- Remove old overworld code (or archive)

---

## Success Criteria

1. **Visual:** Player can hold RIGHT and sweep past all 30 houses in a straight line
2. **Visual:** Black road clearly visible below house entrances
3. **Visual:** Battle Tower prominent at start of village
4. **Interaction:** SPACE enters nearest house (with fade transition)
5. **Interaction:** Each house has unique interior furniture
6. **Performance:** Smooth 60fps, no jank on transitions
7. **Code:** Clean architecture, unified coordinate system, no hacks

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Store incompatibility | Keep tile-coord conversion at boundary only |
| Sprite loading failures | Preload sprites, use placeholders |
| Transition bugs | Reuse proven SceneTransition system |
| Regression in interiors | Keep InteriorFloorLayer/FurnitureLayer unchanged |

---

## Estimated Effort

- **Phase 1 (Foundation):** 5 bricks → 1 implementation session
- **Phase 2 (Road & Village):** 5 bricks → 1 implementation session
- **Phase 3 (Player & Movement):** 5 bricks → 1 implementation session
- **Phase 4 (Interactions):** 5 bricks → 1 implementation session
- **Phase 5 (Polish):** 5 bricks → 1 implementation session

**Total: 25 bricks across 5 phases**

---

## Next Step

Approve this plan, then launch implementation swarm for Phase 1 (Bricks 1-5).
