import { expect, type Page } from '@playwright/test';

export async function advanceToMainMenu(
  page: Page,
  options: { timeoutMs?: number; attemptTimeoutMs?: number } = {},
) {
  const timeoutMs = options.timeoutMs ?? 10_000;
  const attemptTimeoutMs = options.attemptTimeoutMs ?? 1_000;

  const titleScreen = page.locator('.title-screen');
  const mainMenu = page.locator('.main-menu');
  const mainMenuOption = page.locator('.main-menu-option').first();
  const toolboxToggle = page.locator('.toolbox-toggle');
  const toolboxPanel = page.locator('.toolbox-panel');
  const titleContent = page.locator('.title-screen-content');

  await expect(titleScreen).toBeVisible({ timeout: timeoutMs });
  await page.focus('body').catch(() => {});

  const waitForMenu = async (timeout = attemptTimeoutMs) => {
    if (await mainMenuOption.isVisible({ timeout: attemptTimeoutMs }).catch(() => false)) return true;
    if (await mainMenu.isVisible({ timeout }).catch(() => false)) return true;
    return false;
  };

  const actions: Array<() => Promise<void>> = [
    async () => {
      await titleContent.click({ timeout: attemptTimeoutMs, force: true }).catch(() => {});
    },
    async () => {
      await titleScreen.click({ timeout: attemptTimeoutMs, force: true }).catch(() => {});
    },
    async () => {
      await page.keyboard.press('Enter').catch(() => {});
    },
    async () => {
      await page.keyboard.press('Space').catch(() => {});
    },
    async () => {
      await page.evaluate(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      });
    },
    async () => {
      await page.evaluate(() => {
        const target = document.querySelector('.title-screen');
        if (target) {
          target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
      });
    },
    async () => {
      await page.keyboard.press('F1').catch(() => {});
      await page.keyboard.press('Digit4').catch(() => {});
      await page.keyboard.press('F1').catch(() => {});
    },
  ];

  const forceMenuState = async () => {
    await page.evaluate(async () => {
      const results = await Promise.allSettled([
        import('/src/ui/state/store.ts').then((mod) => {
          if (mod.store?.getState) {
            mod.store.getState().setMode('main-menu');
          }
        }),
        import('/src/store/gameStore.ts').then((mod) => {
          if (mod.useGameStore?.getState) {
            mod.useGameStore.getState().setScreen('menu');
            mod.useGameStore.getState().startTransition('menu');
          }
        }),
      ]);

      // Silence unused results to avoid lint noise in devtools.
      return results.length;
    }).catch(() => {});
  };

  const openToolbox = async () => {
    if (await toolboxPanel.isVisible({ timeout: 200 }).catch(() => false)) return;
    if (await toolboxToggle.isVisible({ timeout: 200 }).catch(() => false)) {
      await toolboxToggle.click({ timeout: attemptTimeoutMs }).catch(() => {});
    }
  };

  const tryDevOverlayJump = async () => {
    await openToolbox();
    const devToggle = page.locator('button').filter({ hasText: /Show Dev Overlay/i }).first();
    if (await devToggle.isVisible({ timeout: 500 }).catch(() => false)) {
      await devToggle.click().catch(() => {});
      await page.keyboard.press('Digit4').catch(() => {});
    }
  };

  const startedAt = Date.now();
  let forced = false;
  let devJumped = false;
  while (Date.now() - startedAt < timeoutMs) {
    if (await waitForMenu(300)) return;

    for (const action of actions) {
      await action();
      if (await waitForMenu(500)) return;
    }

    if (!forced) {
      await forceMenuState();
      forced = true;
      if (await waitForMenu(500)) return;
    }

    if (!devJumped) {
      await tryDevOverlayJump();
      devJumped = true;
      if (await waitForMenu(800)) return;
    }

    await page.waitForTimeout(150);
  }

  await expect(mainMenuOption).toBeVisible({ timeout: timeoutMs });
}
