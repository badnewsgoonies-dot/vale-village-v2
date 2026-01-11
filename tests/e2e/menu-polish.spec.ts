// Backlog: MENU-FOCUS-RESTORE (P0)
// Target file: src/ui/components/SaveMenu.tsx
// Backlog: MENU-TOOLBOX-TESTID (P1)
// Target file: src/ui/components/MainMenu.tsx

import { test, expect } from '@playwright/test';

test.describe('Menu polish P0/P1', () => {
  test('P0 SaveMenu focus restore (MENU-FOCUS-RESTORE) - should restore focus to pause button after closing SaveMenu', async ({ page }) => {
    // Reference target: src/ui/components/SaveMenu.tsx
    await page.goto('http://localhost:5173/');

    // Try common testids used by menus; tests are best-effort and intentionally assert expected behavior.
    const pauseBtn = page.locator('[data-testid="pause-button"]');
    await pauseBtn.click().catch(() => {});
    const saveBtn = page.locator('[data-testid="open-save-menu"]');
    await saveBtn.click().catch(() => {});
    const closeBtn = page.locator('[data-testid="save-close"]');
    await closeBtn.click().catch(() => {});

    // Assert focus restored to pause button. If focus-restore is broken this will fail (desired).
    const active = await page.evaluate(() => document.activeElement?.getAttribute('data-testid') || null);
    expect(active, 'SaveMenu should restore focus to pause button (see MENU-FOCUS-RESTORE, src/ui/components/SaveMenu.tsx)').toBe('pause-button');
  });

  test('P1 Menu test: toolbox action has testid (MENU-TOOLBOX-TESTID) - toolbox action should have testid for automation', async ({ page }) => {
    // Reference target: src/ui/components/MainMenu.tsx
    await page.goto('http://localhost:5173/');
    const toolbox = page.locator('[data-testid="toolbox-action-button"]');
    // This assertion intentionally fails if the testid is not present, surfacing the P1 polish item.
    await expect(toolbox).toBeVisible();
  });
});
