import { test, expect } from '@playwright/test';
test.skip(!process.env.RUN_HEAVY, 'Skipping heavy e2e tests by default');
import { runBattle } from './helpers/battle';
import { dismissDialogueIfPresent } from './helpers/dialogue';
import { holdKey, tapSpace } from './helpers/input';
import { advanceToMainMenu } from './helpers/menu';
import { dismissBlockingModals } from './helpers/modals';
import { ensureDir, shot } from './helpers/screenshots';
import { startNextFloor, startTowerRun } from './helpers/tower';

const TOUR_DIR = '/tmp/vv2-gameplay-tour';

test.beforeAll(() => {
  ensureDir(TOUR_DIR);
});

test('Gameplay tour (screens + overworld)', async ({ page }) => {
  test.setTimeout(180_000);

  const shotTour = (filename: string) => shot(page, TOUR_DIR, filename);

  // --- New Game -> Overworld V2 -> Interior ---
  await page.goto('/');
  await expect(page.locator('.title-screen')).toBeVisible();
  await page.waitForTimeout(300);
  await shotTour('01-title.png');

  await advanceToMainMenu(page);
  await expect(page.locator('.main-menu')).toBeVisible();
  await shotTour('02-menu.png');

  const newGameOption = page.locator('.main-menu-option').filter({ hasText: /^New Game$/i });
  await expect(newGameOption).toBeVisible({ timeout: 10_000 });
  await newGameOption.click();

  await expect(page.locator('.overworld-shell')).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(1_200);
  await shotTour('03-overworld-spawn.png');

  // In some flows a tutorial dialogue may pop; dismiss it so the tour can proceed.
  await dismissDialogueIfPresent(page, {
    screenshotName: '03b-dialogue.png',
    takeScreenshot: shotTour,
    useCloseButton: true,
    ensureClosed: true,
    overlayTimeoutMs: 1200,
    closeTimeoutMs: 800,
    stepTimeoutMs: 200,
    stepDelayMs: 120,
  });

  // Move onto the House 1 doorway (spawn is directly below it).
  await page.keyboard.press('ArrowUp');
  await page.waitForTimeout(120);

  // House 01 should be within interaction range from spawn.
  for (let attempt = 0; attempt < 4; attempt++) {
    await tapSpace(page);
    await dismissBlockingModals(page);
    await dismissDialogueIfPresent(page, {
      screenshotName: '03c-djinn-tutorial.png',
      takeScreenshot: shotTour,
      useCloseButton: true,
      ensureClosed: true,
      overlayTimeoutMs: 1200,
      closeTimeoutMs: 800,
      stepTimeoutMs: 200,
      stepDelayMs: 120,
    });
    await page.waitForTimeout(250);

    await dismissBlockingModals(page);

    if (
      await page
        .locator('.location-title')
        .getByText('House 1 Interior')
        .isVisible({ timeout: 800 })
        .catch(() => false)
    ) {
      break;
    }

    // Nudge upward to re-align with the doorway and try again.
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(120);
  }

  const locationTitle = page.locator('.location-title');
  if (
    !(await locationTitle
      .getByText('House 1 Interior')
      .isVisible({ timeout: 800 })
      .catch(() => false))
  ) {
    // Fallback: teleport directly into House 1 if the doorway trigger fails.
    await page.evaluate(async () => {
      const mod = await import('/src/ui/state/store.ts');
      if (mod.store?.getState) {
        mod.store.getState().teleportPlayer('house-01-interior', { x: 5, y: 6 });
      }
    });
  }
  await expect(locationTitle).toContainText('House 1 Interior', { timeout: 10_000 });
  await page.waitForTimeout(900);
  await shotTour('04-house-01-interior.png');

  // Exit interior: walk down into exit zone.
  await holdKey(page, 'ArrowDown', 2_200);
  await expect(page.locator('.location-title')).toContainText('Vale Village', { timeout: 10_000 });
  await page.waitForTimeout(900);
  await shotTour('05-overworld-return.png');

  // Try entering the tower from overworld (helps diagnose flow wiring).
  await holdKey(page, 'ArrowLeft', 900);
  await tapSpace(page);
  await page.waitForTimeout(1_200);
  await shotTour('06-enter-tower-from-overworld.png');

  // --- Menu -> Compendium -> Tower -> Team Select -> Battle ---
  await page.goto('/');
  await expect(page.locator('.title-screen')).toBeVisible();
  await advanceToMainMenu(page);
  await expect(page.locator('.main-menu')).toBeVisible();

  // Compendium
  const compendiumOption = page.locator('.main-menu-option').filter({ hasText: /^Compendium$/i });
  await expect(compendiumOption).toBeVisible({ timeout: 10_000 });
  await compendiumOption.click();
  await expect(page.locator('.compendium-overlay')).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(700);
  await shotTour('07-compendium-djinn.png');

  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(300);
  await shotTour('08-compendium-units.png');

  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(300);
  await shotTour('09-compendium-enemies.png');

  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(300);
  await shotTour('10-compendium-equipment.png');

  await page.keyboard.press('Escape');
  await expect(page.locator('.main-menu')).toBeVisible({ timeout: 10_000 });
  await shotTour('11-menu-after-compendium.png');

  // Battle Tower
  const battleTowerOption = page.locator('.main-menu-option').filter({ hasText: /Battle Tower/i });
  await expect(battleTowerOption).toBeVisible({ timeout: 10_000 });
  await battleTowerOption.click();

  await expect(page.locator('.tower-hub')).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(800);
  await shotTour('12-tower-hub.png');

  await startTowerRun(page, { requireVisible: true, timeoutMs: 10_000, delayMs: 0 });
  await page.waitForTimeout(1_200);
  await shotTour('13-tower-run.png');

  await startNextFloor(page, { delayMs: 0 });

  const teamSelect = page.locator('.prebattle-v2-overlay');
  const fallbackNoBattle = page.getByText('No battle pending');
  await expect(teamSelect.or(fallbackNoBattle)).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(700);
  await shotTour('14-team-select.png');

  // Start the battle (TeamSelect uses Enter for confirm in current UX).
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2_800);

  const battleView = page.locator('[data-testid="battle-view"]');
  await expect(battleView.or(fallbackNoBattle)).toBeVisible({ timeout: 10_000 });
  await shotTour('15-battle.png');

  // A second shot a few seconds later helps catch sprite/camera jitter and overlays.
  await page.waitForTimeout(4_000);
  await shotTour('16-battle-late.png');

  // --- Play the battle to completion (basic attacks) ---
  const battleResult = await runBattle(page, {
    maxRounds: 20,
    battleViewTimeoutMs: 10_000,
    actionTimeoutMs: 10_000,
    queueDelayMs: 120,
    targetDelayMs: 120,
    executingDelayMs: 250,
    executeDelayMs: 0,
    victoryDelayMs: 0,
    rewardsDelayMs: 0,
    tutorialSkipDelayMs: 300,
    pollDelayMs: 250,
    waitTimeoutMs: 25_000,
  });

  if (battleResult.result === 'defeat') {
    throw new Error('Battle ended in defeat.');
  }

  const rewardsScreen = page.locator('.rewards-screen');
  await expect(rewardsScreen).toBeVisible({ timeout: 30_000 });
  await page.waitForTimeout(900);
  await shotTour('17-rewards.png');

  // Continue back to Tower Hub
  await page.keyboard.press('Enter');
  await expect(page.locator('.tower-hub')).toBeVisible({ timeout: 20_000 });
  await page.waitForTimeout(800);
  await shotTour('18-tower-after-rewards.png');
});
