/**
 * E2E Smoke Tests
 * Tests the core game flow: title -> menu -> overworld/battle
 */

import { test, expect, Page } from '@playwright/test';

test.describe('Game Flow Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display title screen on load', async ({ page }) => {
    // Check for title screen elements
    await expect(page.locator('.title-screen')).toBeVisible();
    await expect(page.locator('.title-screen-logo')).toContainText('Vale Chronicles');
    await expect(page.locator('.title-screen-subtitle')).toContainText('Press any key');
  });

  test('should navigate from title to menu on keypress', async ({ page }) => {
    // Start on title screen
    await expect(page.locator('.title-screen')).toBeVisible();

    // Press any key to continue
    await page.keyboard.press('Enter');

    // Should now be on main menu
    await expect(page.locator('.main-menu')).toBeVisible();
    await expect(page.locator('.main-menu-title')).toContainText('Vale Chronicles');
  });

  test('should navigate from title to menu on click', async ({ page }) => {
    // Start on title screen
    await expect(page.locator('.title-screen')).toBeVisible();

    // Click to continue
    await page.click('.title-screen');

    // Should now be on main menu
    await expect(page.locator('.main-menu')).toBeVisible();
  });

  test('should display menu options', async ({ page }) => {
    // Navigate to menu
    await page.keyboard.press('Enter');
    await expect(page.locator('.main-menu')).toBeVisible();

    // Check menu options
    await expect(page.locator('.main-menu-option').filter({ hasText: 'New Game' })).toBeVisible();
    await expect(page.locator('.main-menu-option').filter({ hasText: 'Continue' })).toBeVisible();
    await expect(page.locator('.main-menu-option').filter({ hasText: 'Compendium' })).toBeVisible();
    await expect(page.locator('.main-menu-option').filter({ hasText: 'Battle Tower' })).toBeVisible();
  });

  test('should highlight menu options with keyboard navigation', async ({ page }) => {
    // Navigate to menu
    await page.keyboard.press('Enter');
    await expect(page.locator('.main-menu')).toBeVisible();

    // First option should be selected by default
    const newGameOption = page.locator('.main-menu-option').filter({ hasText: 'New Game' });
    await expect(newGameOption).toHaveClass(/selected/);

    // Navigate down
    await page.keyboard.press('ArrowDown');

    // New Game should no longer be selected, next enabled option should be
    await expect(newGameOption).not.toHaveClass(/selected/);
  });

  test('should start new game and go to overworld', async ({ page }) => {
    // Navigate to menu
    await page.keyboard.press('Enter');
    await expect(page.locator('.main-menu')).toBeVisible();

    // Select "New Game" and press Enter
    await page.keyboard.press('Enter');

    // Should now be on overworld
    await expect(page.locator('.overworld-shell')).toBeVisible({ timeout: 5000 });
  });

  test('should go to team select from Battle Tower option', async ({ page }) => {
    // Navigate to menu
    await page.keyboard.press('Enter');
    await expect(page.locator('.main-menu')).toBeVisible();

    // Navigate to Battle Tower option
    // Menu order: New Game (selected), Continue (disabled/skipped), Compendium, Battle Tower
    // Enabled options: New Game(0), Compendium(1), Battle Tower(2)
    await page.keyboard.press('ArrowDown'); // New Game -> Compendium (skips disabled Continue)
    await page.keyboard.press('ArrowDown'); // Compendium -> Battle Tower

    // Verify Battle Tower is selected
    const battleTowerOption = page.locator('.main-menu-option').filter({ hasText: 'Battle Tower' });
    await expect(battleTowerOption).toHaveClass(/selected/);

    // Press Enter to start
    await page.keyboard.press('Enter');

    // Should navigate away from main menu to team-select screen
    await expect(page.locator('.main-menu')).not.toBeVisible({ timeout: 5000 });

    // Team select screen shows either the team selection UI or "No battle pending" (if no roster)
    // Since we haven't started a New Game, we may see the fallback message
    const teamSelectUI = page.locator('.prebattle-v2-overlay');
    const fallbackMessage = page.getByText('No battle pending');
    // Either the team select UI or the fallback should be visible
    await expect(teamSelectUI.or(fallbackMessage)).toBeVisible({ timeout: 5000 });
  });

  test('should return to title screen with Escape from menu', async ({ page }) => {
    // Navigate to menu
    await page.keyboard.press('Enter');
    await expect(page.locator('.main-menu')).toBeVisible();

    // Press Escape to go back
    await page.keyboard.press('Escape');

    // Should be back on title screen
    await expect(page.locator('.title-screen')).toBeVisible();
  });
});

test.describe('Keyboard Navigation', () => {
  test('should wrap around menu options', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Enter');
    await expect(page.locator('.main-menu')).toBeVisible();

    // Count enabled options
    const enabledOptions = page.locator('.main-menu-option:not(.disabled)');
    const count = await enabledOptions.count();

    // Navigate up from first option - should wrap to last
    await page.keyboard.press('ArrowUp');

    // Last enabled option should now be selected
    const lastOption = enabledOptions.last();
    await expect(lastOption).toHaveClass(/selected/);
  });

  test('should ignore disabled menu options during navigation', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Enter');
    await expect(page.locator('.main-menu')).toBeVisible();

    // Continue option should be disabled (no save file)
    const continueOption = page.locator('.main-menu-option').filter({ hasText: 'Continue' });
    await expect(continueOption).toHaveClass(/disabled/);
  });
});

test.describe('Visual Regression', () => {
  test('title screen matches snapshot', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.title-screen')).toBeVisible();

    // Take screenshot for visual comparison
    await expect(page).toHaveScreenshot('title-screen.png', {
      maxDiffPixels: 100,
    });
  });

  test('main menu matches snapshot', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Enter');
    await expect(page.locator('.main-menu')).toBeVisible();

    await expect(page).toHaveScreenshot('main-menu.png', {
      maxDiffPixels: 100,
    });
  });
});
