import { test, expect } from '@playwright/test';
test.skip(!process.env.RUN_STABLE_E2E, 'Skipping heavy e2e tests by default');
import { runBattle } from './helpers/battle';
import { dismissDialogueIfPresent } from './helpers/dialogue';
import { holdKey, tapSpace } from './helpers/input';
import { dismissBlockingModals } from './helpers/modals';
import { startNextFloor, startTowerRun } from './helpers/tower';

test('Full Game Flow - Fast Start', async ({ page }) => {
  test.setTimeout(1800_000);
  page.on('console', msg => console.log('BROWSER: ' + msg.text()));
  page.on('pageerror', err => console.log('BROWSER_ERROR: ' + err.message));

  console.log('🚀 Starting Fast Game E2E...');

  // 1. Direct Boot to Overworld
  await page.goto('/');
  // Wait for store exposure
  await page.waitForFunction(() => (window as any).v1Store && (window as any).gameStore);

  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('battleSpeed', 'instant');
    
    const win = window as any;
    // Setup Starter Team
    const isaac = win.createUnit(win.UNIT_DEFINITIONS['adept'], 1, 0);
    const team = win.createTeam([isaac]);
    // Equip Flint
    // win.collectDjinn(team, 'flint'); // Assuming helpers available or skip
    
    win.v1Store.getState().setTeam(team);
    win.v1Store.getState().setMode('overworld');
    win.gameStore.getState().setScreen('overworld');
  });

  await expect(page.locator('.overworld-shell')).toBeVisible({ timeout: 15000 });
  console.log('🌍 Force-spawned in Overworld');

  // Dismiss any initial tutorials
  await dismissDialogueIfPresent(page);
  await dismissBlockingModals(page);

  // 3. Move to House 1
  console.log('🚶 Moving to House 1...');
  
  // Try teleporting directly to House 1 Interior to save time/flakiness
  await page.evaluate(() => {
    const win = (window as any);
    win.v1Store.getState().teleportPlayer('house-01-interior', { x: 5, y: 6 });
  });
  
  // Wait for transition
  await expect(page.locator('.location-title')).toContainText(/House 1/i, { timeout: 10000 });
  console.log('🏠 Inside House 1');

  // 4. House 1 Battle
  console.log('⚔️ Starting House 1 Battle...');
  await page.keyboard.press('ArrowUp');
  await page.waitForTimeout(500);
  await tapSpace(page); // Talk to enemy/NPC

  await dismissDialogueIfPresent(page);
  
  const teamSelect = page.locator('.prebattle-v2-overlay');
  await expect(teamSelect).toBeVisible({ timeout: 15_000 });
  await page.keyboard.press('Enter'); // Confirm team

  const battleView = page.locator('[data-testid="battle-view"]');
  await expect(battleView).toBeVisible({ timeout: 20_000 });

  const battleResult = await runBattle(page, {
    maxRounds: 20,
    waitTimeoutMs: 60_000,
  });

  if (battleResult.result === 'defeat') throw new Error('Defeated in House 1!');
  console.log('✅ House 1 Victory!');

  // Continue through rewards
  await page.keyboard.press('Enter');
  await expect(page.locator('.rewards-screen')).toBeVisible({ timeout: 15_000 });
  await page.keyboard.press('Enter');

  // Recruit dialogue
  await dismissDialogueIfPresent(page);
  console.log('🤝 Garet recruited');

  // 5. Return to Overworld & Enter Tower
  console.log('🏃 Returning to Overworld...');
  // Force teleport to Tower Entrance to skip walking
  await page.evaluate(() => {
     const win = (window as any);
     // Teleport to Vale Village near Tower
     win.v1Store.getState().teleportPlayer('vale-village', { x: 2, y: 14 }); // Adjusted coords
  });
  
  // Short walk to trigger tower
  await holdKey(page, 'ArrowLeft', 500);
  await tapSpace(page);

  await expect(page.locator('.tower-hub')).toBeVisible({ timeout: 15_000 });
  console.log('🏰 At Tower Hub');

  // 6. Clear Tower Floors 1-5
  await startTowerRun(page, { requireVisible: true });

  for (let floor = 1; floor <= 5; floor++) {
    console.log('🏢 === TOWER FLOOR ' + floor + ' ===');
    await page.waitForTimeout(1000);
    
    // Start next floor
    const action = await startNextFloor(page, { delayMs: 2000 });
    console.log('  Action: ' + action);

    if (action === 'rest') {
      console.log('  🛏️ Rest floor handled');
    } else {
      // Confirm team
      const prebattle = page.locator('.prebattle-v2-overlay');
      if (await prebattle.waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false)) {
        await page.keyboard.press('Enter');
      }

      // Run Battle
      const towerBattleResult = await runBattle(page, {
        maxRounds: 30,
        waitTimeoutMs: 120_000,
      });

      if (towerBattleResult.result === 'defeat') throw new Error('Defeated on Tower Floor ' + floor);
      console.log('  ✅ Floor ' + floor + ' cleared (' + towerBattleResult.rounds + ' rounds)');

      // Rewards
      await page.keyboard.press('Enter');
      await expect(page.locator('.rewards-screen')).toBeVisible({ timeout: 15_000 });
      await page.keyboard.press('Enter');
    }

    // Back to Hub
    await expect(page.locator('.tower-hub')).toBeVisible({ timeout: 20_000 });
    await dismissDialogueIfPresent(page);
  }

  console.log('🎉 MISSION COMPLETE: Prototype Golden Path Cleared!');
});
