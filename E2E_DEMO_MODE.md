# E2E Demo Mode - Watch the Game Play Automatically

## Overview

The game has full E2E (End-to-End) tests with all moves and actions already registered. You can watch the game play through automatically in **demo mode** - a slower, more visual-friendly version designed for watching rather than testing.

## Quick Start

### Basic Demo (Browser Window)
```bash
cd /home/geni/Documents/vale-village-v2
pnpm test:e2e:demo
```

This will:
- Open a browser window
- Play through the game automatically
- Run at 3x slower speed for better viewing
- Show console progress messages

### Interactive Demo (Playwright UI)
```bash
pnpm test:e2e:demo:ui
```

This opens Playwright's interactive UI where you can:
- Watch the test run step-by-step
- Pause/step through actions
- See the browser in real-time
- Inspect elements

## Available Commands

| Command | Description |
|---------|-------------|
| `pnpm test:e2e:demo` | Run demo in headed browser (recommended) |
| `pnpm test:e2e:demo:ui` | Run demo in interactive Playwright UI |
| `pnpm test:e2e:headed` | Run normal E2E tests with browser visible |
| `pnpm test:e2e:ui` | Run normal E2E tests in Playwright UI |
| `pnpm test:e2e:journey` | Run journey test (normal speed) |

## What the Demo Does

The demo automatically plays through:

1. **Title Screen** → Waits 2 seconds
2. **Main Menu** → Selects "Battle Tower"
3. **Tower Hub** → Starts a tower run
4. **Team Selection** → Confirms team (Enter key)
5. **Battle** → 
   - Skips tutorial if present
   - Clicks attack button
   - Selects first enemy
   - Queues actions (up to 8 per round)
   - Executes rounds
   - Handles victory/defeat screens
   - Advances through cutscenes
6. **Rewards Screen** → Waits 2 seconds to view rewards
7. **Return to Tower** → Completes the journey

## Demo Mode Features

### Slower Timing
- **3x slower** than normal tests
- All delays multiplied by 3
- Dialogue pauses: 300ms → 900ms
- Action pauses: 200ms → 600ms
- Battle execution: 500ms → 1500ms pauses

### Visual-Friendly Delays
- Title screen: 2 second pause
- Menu transitions: 1.5 second pause
- Battle actions: 200-300ms pauses between clicks
- Victory screens: 3 second pause
- Rewards screen: 2 second pause

### Console Logging
The demo outputs progress messages:
```
🎮 Starting gameplay demo...
📺 DEMO MODE: Running at 3x slower speed for better viewing
⚔️ Starting battle...
✅ Battle complete!
🎉 Demo complete!
```

## Technical Details

### File Location
- Demo test: `tests/e2e/gameplay-demo.spec.ts`
- Based on: `tests/e2e/gameplay-journey.spec.ts`
- Config: `playwright.config.ts`

### How It Works

The demo mode uses an environment variable:
```bash
DEMO_MODE=true
```

When enabled:
- `DEMO_DELAY_MULTIPLIER = 3` (3x slower)
- All `waitForTimeout()` calls are multiplied
- Action delays are increased for visibility

### All Moves Registered

The game already has all PC moves registered in the E2E tests:

**Menu Navigation:**
- Keyboard navigation (Arrow keys, Enter)
- Button clicks
- Option selection

**Overworld:**
- Movement (Arrow keys)
- Space bar interactions
- House entry/exit

**Battle System:**
- Attack button clicks
- Enemy selection
- Action queuing
- Round execution
- Victory/defeat handling

**Dialogue System:**
- Dialogue advancement
- Choice selection
- Close button clicks
- Space bar to continue

**Tower System:**
- Start tower run
- Begin battle
- Skip rest
- Continue after rewards

## Customization

### Adjust Speed

Edit `tests/e2e/gameplay-demo.spec.ts`:

```typescript
const DEMO_DELAY_MULTIPLIER = DEMO_MODE ? 3 : 1; // Change 3 to 5 for even slower
```

### Add More Pauses

Add delays at key moments:
```typescript
await demoDelay(page, 2000); // 2 second pause
```

### Run Specific Scenarios

Create new demo tests based on existing E2E tests:
- `gameplay-tour.spec.ts` - Full game tour with screenshots
- `gameplay-journey.spec.ts` - Journey through tower
- `battle-animations.spec.ts` - Battle animations
- `djinn-sprites.spec.ts` - Djinn sprite tests

## Troubleshooting

### Browser Doesn't Open
- Make sure you're using `--headed` flag (included in `test:e2e:demo`)
- Check that display is available: `echo $DISPLAY`

### Test Runs Too Fast
- Verify `DEMO_MODE=true` is set
- Check console for "DEMO MODE: Running at 3x slower speed" message
- Increase `DEMO_DELAY_MULTIPLIER` in the test file

### Test Fails
- Make sure dev server is running (Playwright starts it automatically)
- Check browser console for errors
- Try running normal test first: `pnpm test:e2e:journey --headed`

### Want Even Slower
Edit the multiplier:
```typescript
const DEMO_DELAY_MULTIPLIER = DEMO_MODE ? 5 : 1; // 5x slower
```

## Examples

### Watch Full Journey
```bash
pnpm test:e2e:demo
```

### Watch with Interactive Controls
```bash
pnpm test:e2e:demo:ui
```

### Watch Normal Speed (but visible)
```bash
pnpm test:e2e:journey --headed
```

### Watch Tour (with screenshots)
```bash
DEMO_MODE=true playwright test --headed tests/e2e/gameplay-tour.spec.ts
```

## Related Files

- `tests/e2e/gameplay-demo.spec.ts` - Demo mode test
- `tests/e2e/gameplay-journey.spec.ts` - Original journey test
- `tests/e2e/gameplay-tour.spec.ts` - Full game tour with screenshots
- `playwright.config.ts` - Playwright configuration
- `package.json` - NPM scripts

## Notes

- Demo mode is designed for **watching**, not testing
- Normal E2E tests are optimized for speed
- Demo mode uses the same actions as normal tests, just slower
- All game moves are already registered - no manual coding needed
- The game will play through automatically from start to finish

## Future Enhancements

Possible additions:
- Continuous loop mode (play through multiple times)
- Random scenario selection
- Multiple battle types
- Overworld exploration demo
- House entry/recruitment demo
