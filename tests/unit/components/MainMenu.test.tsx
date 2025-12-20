import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';

const startTransition = vi.fn();
const openCompendium = vi.fn();
const openModal = vi.fn();
const gameStoreState = {
  startTransition,
  openCompendium,
  openModal,
  flow: { modal: null as null | string },
};

vi.mock('../../../src/store/gameStore', () => ({
  useGameStore: vi.fn((selector) => (selector ? selector(gameStoreState) : gameStoreState)),
}));

const openShopFromMainMenu = vi.fn();
const storeState = {
  setTeam: vi.fn(),
  addUnitToRoster: vi.fn(),
  openTowerFromMainMenu: vi.fn(),
  openShopFromMainMenu,
  openCompendium: vi.fn(),
  hasSaveSlot: vi.fn(() => false),
  setMode: vi.fn(),
};

const useStoreMock: any = vi.fn((selector) => (selector ? selector(storeState) : storeState));
useStoreMock.getState = () => storeState;

vi.mock('../../../src/ui/state/store', () => ({
  useStore: useStoreMock,
}));

describe('MainMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    gameStoreState.flow.modal = null;
  });

  it('clicking Shop opens the shop flow', async () => {
    const { MainMenu } = await import('../../../src/ui/components/MainMenu');
    render(<MainMenu />);

    fireEvent.click(screen.getByRole('button', { name: 'Shop' }));

    expect(openShopFromMainMenu).toHaveBeenCalledTimes(1);
    expect(startTransition).toHaveBeenCalledWith('shop');
  });
});
