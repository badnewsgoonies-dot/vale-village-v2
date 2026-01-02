import { expect, type Page } from '@playwright/test';
import { defaultDelay, type DelayFn } from './timing';

export type DialogueDismissOptions = {
  screenshotName?: string;
  takeScreenshot?: (name: string) => Promise<void>;
  useCloseButton?: boolean;
  ensureClosed?: boolean;
  maxSteps?: number;
  overlayTimeoutMs?: number;
  closeTimeoutMs?: number;
  stepTimeoutMs?: number;
  stepDelayMs?: number;
  delay?: DelayFn;
};

export async function dismissDialogueIfPresent(
  page: Page,
  options: DialogueDismissOptions = {},
) {
  const {
    screenshotName,
    takeScreenshot,
    useCloseButton = false,
    ensureClosed = false,
    maxSteps = 40,
    overlayTimeoutMs = 1200,
    closeTimeoutMs = 800,
    stepTimeoutMs = 200,
    stepDelayMs = 120,
    delay = defaultDelay,
  } = options;

  const chatOverlay = page.locator('.dialogue-chat-overlay');
  if (!(await chatOverlay.isVisible({ timeout: overlayTimeoutMs }).catch(() => false))) return;

  if (screenshotName && takeScreenshot) {
    await takeScreenshot(screenshotName);
  }

  if (useCloseButton) {
    const closeButton = page.locator('.dialogue-chat-close');
    if (await closeButton.isVisible({ timeout: closeTimeoutMs }).catch(() => false)) {
      await closeButton.click();
      if (ensureClosed) {
        await expect(chatOverlay).not.toBeVisible({ timeout: 10_000 });
      }
      return;
    }
  }

  for (let i = 0; i < maxSteps; i++) {
    if (!(await chatOverlay.isVisible({ timeout: stepTimeoutMs }).catch(() => false))) return;

    const choice = page.locator('.dialogue-chat-choice').first();
    if (await choice.isVisible({ timeout: stepTimeoutMs }).catch(() => false)) {
      await choice.click();
      await delay(page, stepDelayMs);
      continue;
    }

    const nextButton = page.locator('.dialogue-chat-next');
    if (await nextButton.isVisible({ timeout: stepTimeoutMs }).catch(() => false)) {
      await nextButton.click();
      await delay(page, stepDelayMs);
      continue;
    }

    await page.keyboard.press('Space');
    await delay(page, stepDelayMs);
  }

  if (ensureClosed) {
    await expect(chatOverlay).not.toBeVisible({ timeout: 10_000 });
  }
}
