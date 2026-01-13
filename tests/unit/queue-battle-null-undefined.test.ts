import { test, expect } from 'vitest';
import { readFile } from 'fs/promises';

test('QueueBattleView source exists and exports QueueBattleView', async () => {
  const path = 'src/ui/components/QueueBattleView.tsx';
  const content = await readFile(path, 'utf8');
  expect(content).toContain('export function QueueBattleView');
});
