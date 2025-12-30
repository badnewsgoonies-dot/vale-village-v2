import { test, expect } from '@playwright/test';
import { HOUSE_06 } from '../../src/data/definitions/encounters';

// Quick verification that House 6 has a configured recruitment reward
test('House 06 recruitment is configured', async () => {
  expect(HOUSE_06).toBeDefined();
  expect(HOUSE_06.reward).toBeDefined();
  expect(HOUSE_06.reward.unlockUnit).toBe('stone-guardian');
});
