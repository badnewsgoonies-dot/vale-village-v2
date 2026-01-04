import { test, expect } from '@playwright/test';

// Verifies focus is restored to the Pause menu Inventory button after closing the Inventory modal.
test('focus restores to pause inventory button after closing inventory modal', async ({ page }) => {
  await page.goto('/');

  // Navigate into the game to reach a state where keyboard dev shortcuts work
  await page.keyboard.press('Enter'); // enter main menu

  // Enable dev mode then open Pause (App listens for F1 -> toggle dev, then 'P' opens pause in dev mode)
  await page.keyboard.press('F1');
  await page.keyboard.press('P');

  const pauseInventory = page.locator('[data-testid="pause-inventory-button"]');
  await expect(pauseInventory).toBeVisible({ timeout: 5000 });

  // Open Inventory
  await pauseInventory.click();

  const inventoryModal = page.locator('[data-testid="inventory-modal"]');
  await expect(inventoryModal).toBeVisible({ timeout: 5000 });

  // Close the inventory via the documented close button
  const closeBtn = page.locator('[data-testid="inventory-close-button"]');
  await expect(closeBtn).toBeVisible({ timeout: 2000 });
  await closeBtn.click();

  // Ensure modal dismissed
  await expect(inventoryModal).not.toBeVisible({ timeout: 5000 });

  // Check focus returned to the pause inventory button
  const activeTestId = await page.evaluate(() => (document.activeElement as HTMLElement | null)?.getAttribute('data-testid'));
  expect(activeTestId).toBe('pause-inventory-button');
});
