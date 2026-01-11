import { test, expect } from '@playwright/test'

test('parity - playwright smoke', async () => {
  // simple smoke assertion to ensure CI job can run a playwright test
  expect(2 + 2).toBe(4)
})
