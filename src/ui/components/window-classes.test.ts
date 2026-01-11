import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';

describe('Window CSS classes', () => {
  it('GoldenSunTheme.css defines layered and solid window classes', () => {
    const cssPath = path.resolve(__dirname, '../styles/GoldenSunTheme.css');
    const content = fs.readFileSync(cssPath, 'utf8');
    expect(content).toContain('.gs-window--layered');
    expect(content).toContain('.gs-window--solid');
  });
});
