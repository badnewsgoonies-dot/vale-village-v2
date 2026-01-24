import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 5173);
const HOST = process.env.PLAYWRIGHT_HOST ?? '127.0.0.1';
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://${HOST}:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  expect: {
    timeout: 60 * 1000, // increase default expect timeout to 60s for CI stability
  },
  reporter: [['list']],
  timeout: 600 * 1000,
  use: {
    baseURL: BASE_URL,
    headless: process.env.CI ? true : true,
    actionTimeout: 60 * 1000,
    navigationTimeout: 60 * 1000,
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: `pnpm exec vite --host ${HOST} --port ${PORT} --strictPort`,
    url: BASE_URL,
    timeout: 600 * 1000,
    reuseExistingServer: process.env.CI ? false : true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
