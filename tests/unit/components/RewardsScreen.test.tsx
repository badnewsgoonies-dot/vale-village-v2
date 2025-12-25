import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { RewardsScreen } from '../../../src/ui/components/RewardsScreen';

describe('RewardsScreen', () => {
  it('shows per-member XP and clarifies splitting (incl. KO + rounding)', () => {
    render(
      <RewardsScreen
        rewards={{
          rewards: {
            totalXp: 70,
            totalGold: 123,
            xpPerUnit: 17,
            partySize: 4,
            survivorCount: 3,
            allSurvived: false,
            enemiesDefeated: 2,
            equipmentReward: { type: 'none' },
          },
          levelUps: [],
          goldEarned: 123,
        }}
        team={{
          units: [
            { id: 'test-warrior-1', name: 'Test 1', currentHp: 10, djinn: [] },
            { id: 'test-warrior-2', name: 'Test 2', currentHp: 10, djinn: [] },
            { id: 'test-warrior-3', name: 'Test 3', currentHp: 10, djinn: [] },
            { id: 'test-warrior-4', name: 'Test 4', currentHp: 0, djinn: [] },
          ],
        }}
        onContinue={vi.fn()}
        onSelectEquipment={vi.fn()}
      />
    );

    expect(screen.getByText('+17 XP each')).toBeDefined();
    expect(screen.getByText(/Total \+70 XP/)).toBeDefined();
    expect(screen.getByText(/split among 4/)).toBeDefined();
    expect(screen.getByText(/rounded down/)).toBeDefined();
    expect(screen.getByText(/KO'd members still gain XP/)).toBeDefined();
  });
});
