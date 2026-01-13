import { test, expect } from 'vitest';
import { readFile } from 'fs/promises';

test('useBattleController source exists and exports useBattleController', async () => {
  const path = 'src/ui/hooks/useBattleController.ts';
  const content = await readFile(path, 'utf8');
  expect(content).toContain('export function useBattleController');
});
