import { test } from '@playwright/test';

test('debug boot', async ({ page }) => {
  page.on('console', msg => console.log('PAGE_CONSOLE', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE_ERROR', err.message));
  page.on('response', resp => console.log('PAGE_RESPONSE', resp.status(), resp.url()));

  await page.goto('/');
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForSelector('canvas, #app, .game-root, [data-testid="game-root"]', { timeout: 5000 }).catch(() => {});
  // wait a bit for app to mount or show boot errors
  await page.waitForTimeout(2000);
  const html = await page.$eval('#root', el => el.innerHTML || '');
  console.log('ROOT_HTML_SNIPPET', html.substring(0,1000));
});
