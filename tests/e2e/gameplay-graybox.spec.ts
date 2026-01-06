import { test, expect } from '@playwright/test';
test.skip(!process.env.RUN_STABLE_E2E, 'Skipping heavy e2e tests by default');

test('Gray-box: Direct Battle Injection', async ({ page }) => {
  // 1. Load the game (at root, so we have the environment)
  await page.goto('/');

  // 2. Wait for the test hooks to be available
  await page.waitForFunction(() => 
    (window as any).gameStore && 
    (window as any).v1Store && 
    (window as any).createBattleFromEncounter &&
    (window as any).createTeam &&
    (window as any).createUnit &&
    (window as any).UNIT_DEFINITIONS
  );

  // 3. Direct State Injection: Create and Inject Battle
  await page.evaluate(() => {
    const win = window as any;
    const v1 = win.v1Store.getState();
    const game = win.gameStore.getState();
    
    let team = v1.team; 
    
    // If no team exists (fresh boot), create one
    if (!team) {
      const isaacDef = win.UNIT_DEFINITIONS['adept'];
      if (!isaacDef) throw new Error('Adept definition not found');
      
      const isaac = win.createUnit(isaacDef, 1, 0); // Level 1
      team = win.createTeam([isaac]);
      
      // Inject team into store so the UI can render portraits
      v1.setTeam(team);
    }
    
    // Create deterministic PRNG
    const seed = 12345;
    const rng = win.makePRNG(seed);
    
    // Create battle state using core service (bypassing UI)
    const encounterId = 'house-01'; 
    const result = win.createBattleFromEncounter(encounterId, team, rng);
    
    if (!result || !result.battle) {
      throw new Error('Failed to create battle state');
    }

    // Inject into V1 Store (what UI reads)
    v1.setBattle(result.battle, seed);
    
    // Switch Screen using V2 Store (what Router reads)
    game.setScreen('battle');
  });

  // 4. Verification: State-based wait
  await page.waitForFunction(() => 
    (window as any).gameStore.getState().flow.screen === 'battle'
  );

  // 5. Verification: UI check
  // Now the battle view should render immediately because data is present
  const battleView = page.locator('[data-testid="battle-view"]');
  await expect(battleView).toBeVisible({ timeout: 5000 });

  // Optional: Verify an enemy exists to prove data loaded
  const enemy = page.locator('[data-testid^="battle-enemy-"]').first();
  await expect(enemy).toBeVisible();

  console.log('Successfully injected battle state!');
});
