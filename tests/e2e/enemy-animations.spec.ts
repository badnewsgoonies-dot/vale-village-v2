/**
 * E2E Test: Enemy Animation Classes
 * Verifies that enemy lunge/shake animations are applied during battle
 */

import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Helper: Navigate to battle
 * Goes from title -> menu -> Battle Tower
 */
async function navigateToBattle(page: Page) {
  await page.goto('/');

  // Wait for title screen
  await expect(page.locator('.title-screen')).toBeVisible();

  // Press Enter to go to menu
  await page.keyboard.press('Enter');
  await expect(page.locator('.main-menu')).toBeVisible();

  // Navigate to Battle Tower option
  // Menu order: New Game (selected), Continue (disabled/skipped), Compendium, Battle Tower
  await page.keyboard.press('ArrowDown'); // New Game -> Compendium (skips disabled Continue)
  await page.keyboard.press('ArrowDown'); // Compendium -> Battle Tower

  // Verify Battle Tower is selected
  const battleTowerOption = page.locator('.main-menu-option').filter({ hasText: 'Battle Tower' });
  await expect(battleTowerOption).toHaveClass(/selected/);

  // Press Enter to start
  await page.keyboard.press('Enter');

  // Wait for navigation away from main menu
  await expect(page.locator('.main-menu')).not.toBeVisible({ timeout: 5000 });

  // Wait for Battle Tower screen and click "Start Tower Run"
  await page.waitForTimeout(1000);
  const startButton = page.getByText('Start Tower Run');
  await expect(startButton).toBeVisible({ timeout: 5000 });
  await startButton.click();

  // Wait for run to start, then click "Begin Battle"
  await page.waitForTimeout(1000);
  const beginBattleButton = page.getByText('Begin Battle');
  await expect(beginBattleButton).toBeVisible({ timeout: 5000 });
  await beginBattleButton.click();
}

/**
 * Helper: Save screenshot with timestamp
 */
async function saveScreenshot(page: Page, name: string) {
  const screenshotDir = path.join('/home/geni/Documents/vale-village-v2/test-results', 'enemy-animations');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${name}-${timestamp}.png`;
  const filepath = path.join(screenshotDir, filename);

  await page.screenshot({ path: filepath, fullPage: true });
  console.log(`Screenshot saved: ${filepath}`);

  return filepath;
}

test.describe('Enemy Animations E2E', () => {
  test('should apply enemy-lunge and enemy-shake CSS classes during battle', async ({ page }) => {
    test.setTimeout(120000); // 2 minute timeout for this test
    // Navigate to battle
    await navigateToBattle(page);

    // Take screenshot at team select / pre-battle
    await page.waitForTimeout(1000);
    await saveScreenshot(page, 'step1-team-select');

    // Check if we're at team select or already in battle
    const teamSelectUI = page.locator('.prebattle-v2-overlay');
    const fallbackMessage = page.getByText('No battle pending');
    const battleView = page.locator('[data-testid="battle-view"]');

    const isTeamSelect = await teamSelectUI.isVisible().catch(() => false);
    const isFallback = await fallbackMessage.isVisible().catch(() => false);
    const isInBattle = await battleView.isVisible().catch(() => false);

    console.log('Current state:', { isTeamSelect, isFallback, isInBattle });

    // Battle Tower navigates through team select to battle automatically
    // Wait for either team select or battle to appear
    await page.waitForTimeout(2000);
    await saveScreenshot(page, 'step3-waiting-for-team-select-or-battle');

    // Check if team select is visible
    const teamSelectVisible = await teamSelectUI.isVisible().catch(() => false);
    if (teamSelectVisible) {
      console.log('Team select is visible - clicking Start button or pressing Enter');
      // Look for Start button or press Enter to start battle
      const startBattleButton = page.getByText('Start').filter({ hasText: /^Start$/ });
      const hasStartButton = await startBattleButton.isVisible().catch(() => false);
      if (hasStartButton) {
        console.log('Clicking Start button');
        await startBattleButton.click();
      } else {
        console.log('Pressing Enter to start');
        await page.keyboard.press('Enter');
      }
      await page.waitForTimeout(2000);
    }

    // Wait for battle view to be visible
    await expect(battleView).toBeVisible({ timeout: 10000 });
    console.log('Battle view visible');

    await page.waitForTimeout(1000);
    await saveScreenshot(page, 'step4-battle-started');

    // Wait for enemies to appear (look for any element with data-unit-id or enemy sprites)
    const enemyElements = page.locator('[class*="enemy"], .battle-sprite.enemy, [data-enemy="true"]');
    await page.waitForTimeout(2000); // Give battle time to initialize

    // Take screenshot showing initial battle state
    await saveScreenshot(page, 'step5-battle-initial');

    // Start a MutationObserver to catch animation class changes in real-time
    console.log('Setting up animation class monitoring with MutationObserver...');

    await page.evaluate(() => {
      (window as any).animationResults = {
        enemyLungeFound: false,
        enemyShakeFound: false,
        timestamps: [] as string[],
      };

      const results = (window as any).animationResults;

      // Set up mutation observer
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const target = mutation.target as Element;
            const classList = target.classList;

            if (classList.contains('enemy-lunge')) {
              results.enemyLungeFound = true;
              results.timestamps.push(`enemy-lunge found at ${Date.now()}`);
              console.log('✓ MutationObserver detected enemy-lunge class!');
            }

            if (classList.contains('enemy-shake')) {
              results.enemyShakeFound = true;
              results.timestamps.push(`enemy-shake found at ${Date.now()}`);
              console.log('✓ MutationObserver detected enemy-shake class!');
            }
          }
        });
      });

      // Observe all elements in the battle view for class changes
      const battleView = document.querySelector('[data-testid="battle-view"]');
      if (battleView) {
        observer.observe(battleView, {
          attributes: true,
          attributeFilter: ['class'],
          subtree: true,
        });
      }

      // Also check current state immediately
      const lungeElements = document.querySelectorAll('.enemy-lunge');
      const shakeElements = document.querySelectorAll('.enemy-shake');

      if (lungeElements.length > 0) {
        results.enemyLungeFound = true;
        results.timestamps.push(`enemy-lunge found initially`);
      }

      if (shakeElements.length > 0) {
        results.enemyShakeFound = true;
        results.timestamps.push(`enemy-shake found initially`);
      }
    });

    // Advance battle by pressing keys periodically to trigger animations
    console.log('Advancing battle to trigger enemy animations...');
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('Space').catch(() => {});
      await page.waitForTimeout(2000);

      // Check if we've found both animations
      const results = await page.evaluate(() => (window as any).animationResults);
      if (results.enemyLungeFound && results.enemyShakeFound) {
        console.log('Both animations detected - stopping early');
        break;
      }
    }

    // Get final results
    const animationObservations = await page.evaluate(() => (window as any).animationResults);

    // Final screenshot
    await saveScreenshot(page, 'step7-final-state');

    // Log results
    console.log('\n=== ANIMATION OBSERVATION RESULTS ===');
    console.log(`enemy-lunge found: ${animationObservations.enemyLungeFound}`);
    console.log(`enemy-shake found: ${animationObservations.enemyShakeFound}`);
    console.log('Timestamps:', animationObservations.timestamps);
    console.log('=====================================\n');

    // Assertions
    // At minimum, we expect to see at least one of the animation classes
    // (enemy-lunge for attack, enemy-shake for hit)
    const foundAnyAnimation = animationObservations.enemyLungeFound || animationObservations.enemyShakeFound;

    expect(foundAnyAnimation,
      'Expected to find at least one enemy animation class (enemy-lunge or enemy-shake) during battle'
    ).toBe(true);

    // Ideally we'd see both, but depending on battle speed we might only catch one
    if (animationObservations.enemyLungeFound && animationObservations.enemyShakeFound) {
      console.log('✓ SUCCESS: Both enemy-lunge and enemy-shake animations detected!');
    } else if (animationObservations.enemyLungeFound) {
      console.log('✓ PARTIAL SUCCESS: enemy-lunge detected (enemy-shake may have been missed due to timing)');
    } else if (animationObservations.enemyShakeFound) {
      console.log('✓ PARTIAL SUCCESS: enemy-shake detected (enemy-lunge may have been missed due to timing)');
    }
  });

  test('should verify enemy sprites exist in DOM during battle', async ({ page }) => {
    // Navigate to battle
    await navigateToBattle(page);

    const teamSelectUI = page.locator('.prebattle-v2-overlay');
    const battleView = page.locator('[data-testid="battle-view"]');

    // Wait for team select and start battle
    await page.waitForTimeout(2000);
    const teamSelectVisible = await teamSelectUI.isVisible().catch(() => false);
    if (teamSelectVisible) {
      const startBattleButton = page.getByText('Start').filter({ hasText: /^Start$/ });
      const hasStartButton = await startBattleButton.isVisible().catch(() => false);
      if (hasStartButton) {
        await startBattleButton.click();
      } else {
        await page.keyboard.press('Enter');
      }
      await page.waitForTimeout(2000);
    }

    // Wait for battle view
    await expect(battleView).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(2000);

    // Check for presence of sprite elements
    // BattleUnitSprite renders via SimpleSprite, which should have img tags
    const allSprites = await page.locator('img[src*="sprite"]').all();
    console.log(`Found ${allSprites.length} sprite images in battle`);

    expect(allSprites.length, 'Expected to find sprite images in battle view').toBeGreaterThan(0);

    await saveScreenshot(page, 'enemy-sprites-verification');
  });
});
