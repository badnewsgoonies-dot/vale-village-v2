/**
 * Visual Verification Tests - Djinn Sprites
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const SCREENSHOT_DIR = '/tmp/vv2-screenshots';

test.beforeAll(() => {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }
});

test.describe('Djinn Sprites E2E Test', () => {
  test('should display djinn sprites in DjinnCollectionScreen', async ({ page }) => {
    // Increase test timeout
    test.setTimeout(60000); // 1 minute

    await page.goto('/');

    // 1. Title Screen
    await expect(page.locator('.title-screen')).toBeVisible();
    await page.keyboard.press('Enter');

    // 2. Main Menu
    await expect(page.locator('.main-menu')).toBeVisible();

    // 3. Navigate to Battle Tower
    await page.keyboard.press('ArrowDown'); // Compendium
    await page.keyboard.press('ArrowDown'); // Battle Tower
    await page.keyboard.press('Enter');

    // 4. Battle Tower Entry
    await page.waitForTimeout(1000);

    // 5. Click "Start Tower Run"
    const startButton = page.locator('button').filter({ hasText: /start tower run/i });
    await expect(startButton).toBeVisible({ timeout: 5000 });
    await startButton.click();
    await page.waitForTimeout(2000);

    // 6. Manipulate store to jump to floor 4 (REST floor) for quick Djinn access
    console.log('Advancing tower to Floor 4 (REST floor) via store manipulation...');
    const manipulated = await page.evaluate(() => {
      try {
        // Access the Zustand store
        const storeElement = document.querySelector('[data-store]');
        if (!storeElement) {
          // Try window.__store or similar
          const win = window as any;
          if (win.__STORE__) {
            const store = win.__STORE__;
            const currentState = store.getState();
            if (!currentState.towerRun) return false;

            store.setState({
              towerRun: {
                ...currentState.towerRun,
                floorIndex: 3, // Floor 4 (0-indexed)
                stats: {
                  ...currentState.towerRun.stats,
                  highestFloor: 4,
                  victories: 3,
                },
                history: [
                  { floorNumber: 1, outcome: 'victory', turnsTaken: 5, damageDealt: 100, damageTaken: 20, rewardsGranted: [] },
                  { floorNumber: 2, outcome: 'victory', turnsTaken: 6, damageDealt: 120, damageTaken: 25, rewardsGranted: [] },
                  { floorNumber: 3, outcome: 'victory', turnsTaken: 7, damageDealt: 140, damageTaken: 30, rewardsGranted: [] },
                ],
              },
            });
            return true;
          }
        }
        return false;
      } catch (e) {
        console.error('Store manipulation failed:', e);
        return false;
      }
    });

    console.log('Store manipulated:', manipulated);
    await page.waitForTimeout(1000);

    // 7. Look for "Djinn" button (should be visible on rest floor)
    const djinnButton = page.locator('button').filter({ hasText: /^Djinn$/i });
    const djinnVisible = await djinnButton.isVisible({ timeout: 5000 }).catch(() => false);
    console.log('Djinn button visible:', djinnVisible);

    if (!djinnVisible) {
      console.log('Djinn button not found - checking page state...');

      // Log page text for debugging
      const pageText = await page.evaluate(() => document.body.innerText);
      console.log('Page text:', pageText.substring(0, 500));

      // Take a screenshot only if needed (with timeout)
      try {
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, '05b-no-djinn-button.png'),
          timeout: 5000
        });
      } catch (e) {
        console.log('Screenshot failed:', e);
      }

      throw new Error('Djinn button not found on page. Store manipulation may have failed.');
    }

    // Click Djinn button
    await djinnButton.click();
    await page.waitForTimeout(1000);
    try {
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, '06-djinn-collection.png'),
        timeout: 5000
      });
    } catch (e) {
      console.log('Screenshot failed:', e);
    }

    // 8. Check for djinn sprites
    const allImages = await page.locator('img').all();
    console.log(`\n=== DJINN SPRITE VERIFICATION ===`);
    console.log(`Total images on page: ${allImages.length}`);

    const imgSrcs = await page.locator('img').evaluateAll(imgs =>
      imgs.map(img => ({ src: (img as HTMLImageElement).src, naturalWidth: (img as HTMLImageElement).naturalWidth }))
    );
    console.log('Images:', JSON.stringify(imgSrcs, null, 2));

    // Look for djinn-related images
    const djinnImages = imgSrcs.filter(i => i.src.toLowerCase().includes('djinn'));
    console.log(`Djinn images found: ${djinnImages.length}`);

    if (djinnImages.length > 0) {
      console.log('✓ DJINN SPRITES: PASS - Found djinn images');
      console.log('Djinn sprite sources:', djinnImages.map(img => img.src));
    } else {
      console.log('✗ DJINN SPRITES: FAIL - No djinn images found');
    }

    // Close djinn modal
    const closeBtn = page.locator('button').filter({ hasText: /close|×/i }).first();
    if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await closeBtn.click();
      await page.waitForTimeout(500);
    }

    console.log('\n=== Screenshots saved to /tmp/vv2-screenshots/ ===');

    // Assert that we found djinn sprites
    expect(djinnImages.length).toBeGreaterThan(0);
  });
});
