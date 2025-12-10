# Screenshot Capture System

This document explains the automated screenshot capture system for Vale Village v2.

## Overview

The screenshot system uses a **manifest-driven approach** where all screen states that need capturing are defined in `docs/screenshot-manifest.json`. A capture tool reads this manifest and navigates to each state via debug routes.

## How It Works

1. **Debug Router** (`src/debug/DebugRouter.tsx`) parses URL hashes like `#/debug/battle?phase=planning`
2. Based on the route, it sets up mock data and navigates to the appropriate screen state
3. The capture tool waits for the specified delay, then takes a screenshot
4. Screenshots are saved to `docs/screenshots/<category>/<id>.png`

## Adding New Screenshots

When you add a new screen or state that needs capturing:

1. **Add to manifest** - Add an entry to `docs/screenshot-manifest.json`:
```json
{
  "id": "my-new-screen",
  "category": "battle",
  "route": "/debug/my-screen?variant=special",
  "description": "Description of what this shows",
  "delayMs": 1000,
  "notes": "Optional notes for the capture"
}
```

2. **Add debug route** (if needed) - If the state isn't reachable via existing routes, add a handler in `src/debug/DebugRouter.tsx`:
```typescript
'my-screen': () => {
  setupMockTeam();
  // Set up any required state
  setScreen('my-screen');
},
```

## Debug Routes Reference

### URL Format
```
http://localhost:5173/#/debug/{route}?{params}
```

### Available Routes

| Route | Description | Params |
|-------|-------------|--------|
| `/debug/title` | Title screen | - |
| `/debug/menu` | Main menu | `hasSave=true` |
| `/debug/settings` | Settings modal | `tab=audio\|display\|gameplay` |
| `/debug/overworld` | Overworld map | `location=vale`, `party=isaac,garet` |
| `/debug/battle` | Battle screen | `phase=planning\|executing`, `encounter=X` |
| `/debug/victory` | Victory overlay | `variant=normal\|flawless\|boss`, `levelup=true`, `drops=true` |
| `/debug/defeat` | Defeat overlay | - |
| `/debug/rewards` | Rewards screen | `type=basic\|equipment-choice\|levelup` |
| `/debug/pause` | Pause menu | - |
| `/debug/save` | Save menu | - |
| `/debug/help` | How to play | - |
| `/debug/inventory` | Inventory modal | - |
| `/debug/shop` | Shop screen | `type=weapons\|armor\|items` |
| `/debug/compendium` | Compendium | `tab=units\|djinn\|equipment\|enemies` |
| `/debug/dialogue` | Dialogue box | `scene=village-intro\|yes-no` |
| `/debug/team-select` | Pre-battle team select | `boss=true` |
| `/debug/djinn-collection` | Djinn collection | - |
| `/debug/party` | Party management | - |
| `/debug/tower` | Battle Tower hub | `floor=N` |
| `/debug/credits` | Credits scroll | - |
| `/debug/epilogue` | Epilogue screen | - |

## Categories

Screenshots are organized into categories:

- `main-menu` - Title and main menu screens
- `settings` - Settings modal tabs
- `overworld` - Overworld exploration
- `battle` - Battle system screens
- `victory` - Victory overlays and rewards
- `defeat` - Defeat overlay
- `pause-menu` - Pause menu and sub-modals
- `shops` - Shop interfaces
- `compendium` - Encyclopedia screens
- `dialogue` - Dialogue box variations
- `pre-battle` - Team selection
- `djinn` - Djinn management
- `debug-other` - Miscellaneous

## Running the Capture Tool

```bash
# Capture all screenshots
pnpm capture-screenshots

# Capture specific category
pnpm capture-screenshots --category battle

# Capture single screenshot
pnpm capture-screenshots --id battle-planning
```

## Development Tips

- **Wait for animations**: Use `delayMs` in the manifest to wait for animations
- **Mock data**: Debug routes automatically set up mock team data
- **Overlays**: Victory/defeat overlays don't auto-dismiss in debug mode
- **Testing routes**: Visit `#/debug/{route}` directly in the browser to test
