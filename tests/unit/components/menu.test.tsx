import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/preact';

const startTransition = vi.fn();

vi.mock('../../../src/store/gameStore', () => ({
  useGameStore: vi.fn((selector) => (selector ? selector({ startTransition }) : { startTransition })),
}));

const saveGameSlot = vi.fn(async () => {});
const loadGameSlot = vi.fn(async () => {});
const deleteSaveSlot = vi.fn(() => {});
const getSaveSlotMetadata = vi.fn((i: number) => ({ exists: false }));
const setMode = vi.fn();

const storeState: any = {
  story: { chapter: 'Prologue' },
  gold: 100,
  roster: [1],
  saveGameSlot,
  loadGameSlot,
  deleteSaveSlot,
  getSaveSlotMetadata,
  setMode,
};

const useStoreMock: any = vi.fn((selector) => (selector ? selector(storeState) : storeState));
useStoreMock.getState = () => storeState;

vi.mock('../../../src/ui/state/store', () => ({
  useStore: useStoreMock,
}));

describe('Menu testids', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders PauseMenu with pause-menu testid', async () => {
    const { PauseMenu } = await import('../../../src/ui/components/PauseMenu');
    render(<PauseMenu onClose={() => {}} onTeamManagement={() => {}} onInventory={() => {}} onDjinnCollection={() => {}} onSaveGame={() => {}} onSettings={() => {}} onHowToPlay={() => {}} onReturnToTitle={() => {}} />);

    expect(screen.getByTestId('pause-menu')).toBeTruthy();
  });

  it('renders SaveMenu with save-menu testid', async () => {
    const { SaveMenu } = await import('../../../src/ui/components/SaveMenu');
    render(<SaveMenu onClose={() => {}} />);

    expect(screen.getByTestId('save-menu')).toBeTruthy();
  });
});
