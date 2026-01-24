import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/preact';

vi.mock('../../../src/store/gameStore', () => ({
  useGameStore: vi.fn((selector) => {
    const mockState = {
      startTransition: vi.fn(),
    };
    return selector ? selector(mockState) : mockState;
  }),
}));

vi.mock('../../../src/ui/state/store', () => ({
  useStore: vi.fn((selector) => {
    const towerRun = {
      seed: 123,
      difficulty: 'normal',
      floorIndex: 0,
      floorIds: ['floor-1'],
      isCompleted: false,
      isFailed: false,
      stats: {
        highestFloor: 1,
        totalBattles: 0,
        victories: 0,
        defeats: 0,
        retreats: 0,
        turnsTaken: 0,
        totalDamageDealt: 0,
        totalDamageTaken: 0,
      },
      history: [
        {
          floorId: 'floor-1',
          floorNumber: 1,
          type: 'battle',
          outcome: 'pending',
          rewardsGranted: [],
        },
      ],
      pendingRewards: [],
      config: {},
    };

    const mockState = {
      towerRun,
      towerStatus: 'in-run',
      towerRecord: { highestFloorEver: 6, totalRuns: 0, bestRunTurns: null, bestRunDamageDealt: null },
      getCurrentTowerFloor: () => ({ id: 'floor-1', floorNumber: 1, type: 'battle', encounterId: 'house-01' }),
      startTowerRun: vi.fn(),
      beginTowerFloorBattle: vi.fn(),
      applyTowerRest: vi.fn(),
      quitTowerRun: vi.fn(),
      exitTowerMode: vi.fn(),
      towerEntryContext: { type: 'main-menu' },
      team: null,
      mode: 'tower',
      startDialogueTree: vi.fn(),
    };

    return selector ? selector(mockState) : mockState;
  }),
}));

describe('TowerHubScreen', () => {
  it('shows the next unclaimed milestone reward beyond personal best', async () => {
    const { TowerHubScreen } = await import('../../../src/ui/components/TowerHubScreen');
    render(<TowerHubScreen />);

    // With highestFloorEver=6, floor 6 milestone is already claimed; next is floor 7 (Nova).
    expect(screen.getByText('Floor 7')).toBeDefined();
    expect(screen.getByText(/Djinn: Nova/)).toBeDefined();
  }, 15000);
});
