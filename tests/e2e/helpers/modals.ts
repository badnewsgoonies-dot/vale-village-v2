import { expect, type Page } from '@playwright/test';

export async function dismissBlockingModals(page: Page) {
  const overlays = [
    page.locator('.shop-screen-overlay'),
    page.locator('.modal-overlay'),
  ];

  for (const overlay of overlays) {
    if (!(await overlay.isVisible({ timeout: 200 }).catch(() => false))) continue;

    const closeButton = overlay.locator('.close-btn').first();
    if (await closeButton.isVisible({ timeout: 200 }).catch(() => false)) {
      await closeButton.click().catch(() => {});
    } else {
      await page.keyboard.press('Escape').catch(() => {});
    }

    await expect(overlay).not.toBeVisible({ timeout: 5_000 });
  }
}
