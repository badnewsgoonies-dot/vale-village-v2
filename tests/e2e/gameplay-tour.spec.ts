import { test, expect, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

const TOUR_DIR = '/tmp/vv2-gameplay-tour';

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function shot(page: Page, filename: string) {
  await page.screenshot({
    path: path.join(TOUR_DIR, filename),
    fullPage: true,
  });
}

async function hold(page: Page, key: string, ms: number) {
  await page.keyboard.down(key);
  await page.waitForTimeout(ms);
  await page.keyboard.up(key);
}

async function tapSpace(page: Page) {
  await page.keyboard.down('Space');
  await page.waitForTimeout(120);
  await page.keyboard.up('Space');
}

async function dismissDialogueIfPresent(page: Page, screenshotName: string) {
  const chatOverlay = page.locator('.dialogue-chat-overlay');
  if (!(await chatOverlay.isVisible({ timeout: 1200 }).catch(() => false))) return;

  await shot(page, screenshotName);

  const closeButton = page.locator('.dialogue-chat-close');
  if (await closeButton.isVisible({ timeout: 800 }).catch(() => false)) {
    await closeButton.click();
    await expect(chatOverlay).not.toBeVisible({ timeout: 10_000 });
    return;
  }

  // Fallback: advance quickly until it closes.
  for (let i = 0; i < 40; i++) {
    if (!(await chatOverlay.isVisible({ timeout: 200 }).catch(() => false))) return;

    const choice = page.locator('.dialogue-chat-choice').first();
    if (await choice.isVisible({ timeout: 200 }).catch(() => false)) {
      await choice.click();
      await page.waitForTimeout(120);
      continue;
    }

    const nextButton = page.locator('.dialogue-chat-next');
    if (await nextButton.isVisible({ timeout: 200 }).catch(() => false)) {
      await nextButton.click();
      await page.waitForTimeout(120);
      continue;
    }

    await page.keyboard.press('Space');
    await page.waitForTimeout(120);
  }

  // Ensure closed before continuing.
  await expect(chatOverlay).not.toBeVisible({ timeout: 10_000 });
}

test.beforeAll(() => {
  ensureDir(TOUR_DIR);
});

test('Gameplay tour (screens + overworld)', async ({ page }) => {
  test.setTimeout(180_000);

  // --- New Game -> Overworld V2 -> Interior ---
  await page.goto('/');
  await expect(page.locator('.title-screen')).toBeVisible();
  await page.waitForTimeout(300);
  await shot(page, '01-title.png');

  await page.keyboard.press('Enter');
  await expect(page.locator('.main-menu')).toBeVisible();
  await shot(page, '02-menu.png');

  const newGameOption = page.locator('.main-menu-option').filter({ hasText: /^New Game$/i });
  await expect(newGameOption).toHaveClass(/selected/);
  await page.keyboard.press('Enter');

  await expect(page.locator('.overworld-shell')).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(1_200);
  await shot(page, '03-overworld-spawn.png');

  // In some flows a tutorial dialogue may pop; dismiss it so the tour can proceed.
  await dismissDialogueIfPresent(page, '03b-dialogue.png');

  // House 01 should be within interaction range from spawn.
  for (let attempt = 0; attempt < 4; attempt++) {
    await tapSpace(page);
    await dismissDialogueIfPresent(page, '03c-djinn-tutorial.png');
    await page.waitForTimeout(250);

    if (
      await page
        .locator('.location-title')
        .getByText('House 1 Interior')
        .isVisible({ timeout: 800 })
        .catch(() => false)
    ) {
      break;
    }
  }
  await expect(page.locator('.location-title')).toContainText('House 1 Interior', { timeout: 10_000 });
  await page.waitForTimeout(900);
  await shot(page, '04-house-01-interior.png');

  // Exit interior: walk down into exit zone.
  await hold(page, 'ArrowDown', 2_200);
  await expect(page.locator('.location-title')).toContainText('Vale Village', { timeout: 10_000 });
  await page.waitForTimeout(900);
  await shot(page, '05-overworld-return.png');

  // Try entering the tower from overworld (helps diagnose flow wiring).
  await hold(page, 'ArrowLeft', 900);
  await tapSpace(page);
  await page.waitForTimeout(1_200);
  await shot(page, '06-enter-tower-from-overworld.png');

  // --- Menu -> Compendium -> Tower -> Team Select -> Battle ---
  await page.goto('/');
  await expect(page.locator('.title-screen')).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.locator('.main-menu')).toBeVisible();

  // Compendium
  await page.keyboard.press('ArrowDown');
  const compendiumOption = page.locator('.main-menu-option').filter({ hasText: /^Compendium$/i });
  await expect(compendiumOption).toHaveClass(/selected/);
  await page.keyboard.press('Enter');
  await expect(page.locator('.compendium-overlay')).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(700);
  await shot(page, '07-compendium-djinn.png');

  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(300);
  await shot(page, '08-compendium-units.png');

  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(300);
  await shot(page, '09-compendium-enemies.png');

  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(300);
  await shot(page, '10-compendium-equipment.png');

  await page.keyboard.press('Escape');
  await expect(page.locator('.main-menu')).toBeVisible({ timeout: 10_000 });
  await shot(page, '11-menu-after-compendium.png');

  // Battle Tower
  await page.keyboard.press('ArrowDown'); // Compendium
  await page.keyboard.press('ArrowDown'); // Battle Tower
  const battleTowerOption = page.locator('.main-menu-option').filter({ hasText: /Battle Tower/i });
  await expect(battleTowerOption).toHaveClass(/selected/);
  await page.keyboard.press('Enter');

  await expect(page.locator('.tower-hub')).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(800);
  await shot(page, '12-tower-hub.png');

  const startRunButton = page.locator('button').filter({ hasText: /start tower run/i });
  await expect(startRunButton).toBeVisible({ timeout: 10_000 });
  await startRunButton.click();
  await page.waitForTimeout(1_200);
  await shot(page, '13-tower-run.png');

  const beginBattleButton = page.locator('button').filter({ hasText: /begin battle/i });
  const skipRestButton = page.locator('button').filter({ hasText: /skip rest/i });

  if (await beginBattleButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await beginBattleButton.click();
  } else if (await skipRestButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await skipRestButton.click();
  } else {
    // Best-effort: click the primary action if neither label matches.
    const primaryAction = page.locator('button.primary').first();
    if (await primaryAction.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await primaryAction.click();
    }
  }

  const teamSelect = page.locator('.prebattle-v2-overlay');
  const fallbackNoBattle = page.getByText('No battle pending');
  await expect(teamSelect.or(fallbackNoBattle)).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(700);
  await shot(page, '14-team-select.png');

  // Start the battle (TeamSelect uses Enter for confirm in current UX).
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2_800);

  const battleView = page.locator('[data-testid="battle-view"]');
  await expect(battleView.or(fallbackNoBattle)).toBeVisible({ timeout: 10_000 });
  await shot(page, '15-battle.png');

  // A second shot a few seconds later helps catch sprite/camera jitter and overlays.
  await page.waitForTimeout(4_000);
  await shot(page, '16-battle-late.png');
});
