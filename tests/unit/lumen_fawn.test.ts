import { test, expect } from 'vitest';
import { ENEMIES } from '../../src/data/definitions/enemies';

test('lumen-fawn is defined and has expected properties', () => {
  const e = ENEMIES['lumen-fawn'];
  expect(e).toBeDefined();
  expect(e.id).toBe('lumen-fawn');
  expect(e.level).toBe(1);
  expect(e.element).toBe('Venus');
  expect(e.stats).toHaveProperty('hp');
  expect(Array.isArray(e.abilities)).toBe(true);
});
