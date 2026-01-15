
import { test, expect, type Page } from '@playwright/test';

// Constants from game code
const VIEWPORT_WIDTH = 960;
const ROAD_Y_TOP = 460;
const ROAD_Y_BOTTOM = 520;
const PLAYER_SPEED = 160; // px/sec
// Calculate safe walking Y (middle of road)
const SAFE_WALK_Y = (ROAD_Y_TOP + ROAD_Y_BOTTOM) / 2;

// House layout logic from villageLayout.ts (simplified)
// x: 360 + i * 120
// So House 1 is at 360, House 2 at 480, etc.
// House 50 is at 360 + 49 * 120 = 360 + 5880 = 6240
const HOUSE_SPACING = 120;
const FIRST_HOUSE_X = 360;

function getHouseX(houseNum: number) {
  return FIRST_HOUSE_X + (houseNum - 1) * HOUSE_SPACING;
}

// Helper to simulate key hold
async function holdKey(page: Page, key: string, durationMs: number) {
  await page.keyboard.down(key);
  await page.waitForTimeout(durationMs);
  await page.keyboard.up(key);
}

// Helper to handle battle
async function fightBattle(page: Page) {
  console.log('Battle started!');
  
  // Wait for battle view
  await expect(page.locator('[data-testid="battle-view"]')).toBeVisible({ timeout: 5000 });

  // Simple "Attack All" Strategy
  // Loop until victory or defeat overlay appears
  while (true) {
    // Check if battle ended
    if (await page.locator('.victory-overlay').isVisible()) {
      console.log('Victory detected!');
      // Click continue
      await page.keyboard.press('Space');
      await page.waitForTimeout(1000); // Wait for transition back
      break;
    }
    
    if (await page.locator('.defeat-overlay').isVisible()) {
      throw new Error('Party was defeated! Authentic run failed.');
    }

    // Check if it's player turn (Execute button visible and enabled?)
    const executeBtn = page.locator('[data-testid="battle-execute-round"]');
    const quickAttackBtn = page.locator('[data-testid="battle-quick-attack"]');

    if (await executeBtn.isVisible()) {
      // It's planning phase.
      // Try to spam Quick Attack (Q key is wired to handleAutoAttack)
      // This queues a basic attack for current unit and auto-advances
      
      // We need to queue actions for all 4 party members (or however many are alive)
      // Pressing 'Q' queues an attack for current unit.
      // We can just spam 'Q' 4 times.
      await page.keyboard.press('q');
      await page.waitForTimeout(100);
      await page.keyboard.press('q');
      await page.waitForTimeout(100);
      await page.keyboard.press('q');
      await page.waitForTimeout(100);
      await page.keyboard.press('q');
      await page.waitForTimeout(100);

      // Now click Execute
      if (await executeBtn.isEnabled()) {
        await executeBtn.click();
        console.log('Round executed');
        // Wait for execution phase (animations)
        // With normal speed, this takes time. 
        // We can speed up via 'S' key toggle if we want, but let's be "authentic".
        // Just wait a bit for turn to end.
        await page.waitForTimeout(2000); 
      }
    }

    // Safety wait to avoid tight loop
    await page.waitForTimeout(500);
  }
}

test.skip('Authentic Gameplay: Start to Finish (Houses 1-50)', async ({ page }) => {
  // 1. Load Game
  await page.goto('/');
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForSelector('canvas, #app, .game-root, [data-testid="game-root"]', { timeout: 5000 }).catch(() => {});
  
  // 2. Handle Title Screen
  await expect(page.locator('.title-screen')).toBeVisible();
  await page.keyboard.press('Space'); // Start Game
  
  // 3. Handle Intro Dialogue
  // Spam space to clear dialogue
  // (We can detect dialogue overlay presence)
  console.log('Clearing intro dialogue...');
  for (let i = 0; i < 20; i++) {
    if (await page.locator('.dialogue-overlay').isVisible()) {
      await page.keyboard.press('Space');
      await page.waitForTimeout(100);
    } else {
      break;
    }
  }

  // 4. Ensure we are in Overworld
  await expect(page.locator('canvas')).toBeVisible(); // Overworld canvas
  console.log('Overworld loaded.');

  // Set Speed to 2x for sanity (Authentic game feature!)
  await page.keyboard.press('s'); 
  console.log('Speed set to 2x.');

  // 5. The Great Journey
  // We track our current estimated X position.
  // Start X is approx 200 (left side of village).
  let currentX = 200; 

  for (let houseNum = 1; houseNum <= 50; houseNum++) {
    const targetX = getHouseX(houseNum);
    const distance = targetX - currentX;
    
    console.log(`Walking to House ${houseNum} (Target X: ${targetX}, Dist: ${distance})...`);

    if (distance > 0) {
      // Calculate duration
      // speed is 160px/s. 
      const durationSec = distance / PLAYER_SPEED;
      // Buffer slightly to ensure we reach/pass the door
      await holdKey(page, 'ArrowRight', durationSec * 1000 + 200);
      currentX = targetX;
    }

    // Align Y (Just in case, tap Up/Down to center on road)
    // We assume we start on road.

    // Enter House (Move UP into door)
    console.log(`Entering House ${houseNum}...`);
    await holdKey(page, 'ArrowUp', 600); // Walk up into trigger zone

    // Detect Battle (or Interior if peaceful)
    // House 1-50 are battles.
    // Wait for battle view
    try {
      await fightBattle(page);
      console.log(`House ${houseNum} CLEARED!`);
    } catch (e) {
      console.log(`Failed at House ${houseNum}.`);
      throw e;
    }

    // Post-battle: We are returned to Overworld at the house entrance.
    // Wait for overworld
    await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });
    
    // Move DOWN back to road center
    await holdKey(page, 'ArrowDown', 600);
    
    // Loop to next house
  }
  
  console.log('THE GOLDEN SUN HAS BEEN DEFEATED! GAME COMPLETE.');
});
