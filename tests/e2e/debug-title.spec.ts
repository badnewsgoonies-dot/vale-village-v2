import { test } from '@playwright/test';

// Debug helper: dump page content to stdout for troubleshooting title-screen visibility
test('debug title content', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForSelector('canvas, #app, .game-root, [data-testid="game-root"]', { timeout: 5000 }).catch(() => {});
  await page.waitForLoadState('networkidle');
  const html = await page.content();
  // Print a prefix and suffix so it's easy to find in logs
  console.log('===PAGE_HTML_START===');
  console.log(html.substring(0, 12000));
  console.log('===PAGE_HTML_END===');
});
