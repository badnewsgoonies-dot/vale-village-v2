/**
 * Unit tests for gameStore
 * Tests screen navigation, modals, and battle state
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../../src/store/gameStore';

describe('GameStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useGameStore.setState({
      flow: {
        screen: 'title',
        modal: null,
        isTransitioning: false,
      },
      battleSession: null,
      playerData: {
        team: [],
        inventory: { items: [], capacity: 32 },
        currency: 0,
        storyFlags: new Set(),
        saves: [],
      },
    });
  });

  describe('Screen Navigation', () => {
    it('should start on title screen', () => {
      const state = useGameStore.getState();
      expect(state.flow.screen).toBe('title');
    });

    it('should navigate to menu screen', () => {
      const { setScreen } = useGameStore.getState();
      setScreen('menu');

      const state = useGameStore.getState();
      expect(state.flow.screen).toBe('menu');
    });

    it('should navigate to overworld screen', () => {
      const { setScreen } = useGameStore.getState();
      setScreen('overworld');

      const state = useGameStore.getState();
      expect(state.flow.screen).toBe('overworld');
    });

    it('should navigate to battle screen', () => {
      const { setScreen } = useGameStore.getState();
      setScreen('battle');

      const state = useGameStore.getState();
      expect(state.flow.screen).toBe('battle');
    });
  });

  describe('Modal Management', () => {
    it('should start with no modal open', () => {
      const state = useGameStore.getState();
      expect(state.flow.modal).toBeNull();
    });

    it('should open inventory modal', () => {
      const { openModal } = useGameStore.getState();
      openModal('inventory');

      const state = useGameStore.getState();
      expect(state.flow.modal).toBe('inventory');
    });

    it('should open settings modal', () => {
      const { openModal } = useGameStore.getState();
      openModal('settings');

      const state = useGameStore.getState();
      expect(state.flow.modal).toBe('settings');
    });

    it('should close modal', () => {
      const { openModal, closeModal } = useGameStore.getState();
      openModal('inventory');
      closeModal();

      const state = useGameStore.getState();
      expect(state.flow.modal).toBeNull();
    });

    it('should replace current modal with new modal', () => {
      const { openModal } = useGameStore.getState();
      openModal('inventory');
      openModal('settings');

      const state = useGameStore.getState();
      expect(state.flow.modal).toBe('settings');
    });
  });

  describe('Transition State', () => {
    it('should start without transitioning', () => {
      const state = useGameStore.getState();
      expect(state.flow.isTransitioning).toBe(false);
    });

    it('should set transitioning state', () => {
      const { setTransitioning } = useGameStore.getState();
      setTransitioning(true);

      const state = useGameStore.getState();
      expect(state.flow.isTransitioning).toBe(true);
    });

    it('should reset flow state', () => {
      const { setScreen, openModal, setTransitioning, resetFlow } = useGameStore.getState();
      setScreen('battle');
      openModal('pause');
      setTransitioning(true);

      resetFlow();

      const state = useGameStore.getState();
      expect(state.flow.screen).toBe('title');
      expect(state.flow.modal).toBeNull();
      expect(state.flow.isTransitioning).toBe(false);
    });
  });

  describe('Battle Session', () => {
    it('should start with no battle session', () => {
      const state = useGameStore.getState();
      expect(state.battleSession).toBeNull();
    });

    it('should start a battle', () => {
      const { startBattle } = useGameStore.getState();
      startBattle({ enemyId: 'goblin-1' });

      const state = useGameStore.getState();
      expect(state.battleSession).not.toBeNull();
      expect(state.battleSession?.battle.enemyId).toBe('goblin-1');
      expect(state.battleSession?.battle.phase).toBe('playerTurn');
      expect(state.flow.screen).toBe('battle');
    });

    it('should start battle with custom RNG seed', () => {
      const { startBattle } = useGameStore.getState();
      startBattle({ enemyId: 'goblin-1', rngSeed: 12345 });

      const state = useGameStore.getState();
      expect(state.battleSession?.rngSeed).toBe(12345);
    });

    it('should end battle and return to overworld', () => {
      const { startBattle, endBattle } = useGameStore.getState();
      startBattle({ enemyId: 'goblin-1' });
      endBattle();

      const state = useGameStore.getState();
      expect(state.battleSession).toBeNull();
      expect(state.flow.screen).toBe('overworld');
    });

    it('should set battle phase', () => {
      const { startBattle, setBattlePhase } = useGameStore.getState();
      startBattle({ enemyId: 'goblin-1' });
      setBattlePhase('enemyTurn');

      const state = useGameStore.getState();
      expect(state.battleSession?.battle.phase).toBe('enemyTurn');
    });

    it('should advance turn number', () => {
      const { startBattle, advanceTurn } = useGameStore.getState();
      startBattle({ enemyId: 'goblin-1' });

      const initialTurn = useGameStore.getState().battleSession?.turnNumber;
      advanceTurn();

      const state = useGameStore.getState();
      expect(state.battleSession?.turnNumber).toBe((initialTurn ?? 0) + 1);
    });

    it('should queue battle events', () => {
      const { startBattle, queueBattleEvent } = useGameStore.getState();
      startBattle({ enemyId: 'goblin-1' });
      queueBattleEvent({ id: 'evt-1', type: 'attack' });
      queueBattleEvent({ id: 'evt-2', type: 'ability', description: 'Fire spell' });

      const state = useGameStore.getState();
      expect(state.battleSession?.eventQueue).toHaveLength(2);
      expect(state.battleSession?.eventQueue[0]?.id).toBe('evt-1');
      expect(state.battleSession?.eventQueue[1]?.type).toBe('ability');
    });

    it('should clear battle events', () => {
      const { startBattle, queueBattleEvent, clearBattleEvents } = useGameStore.getState();
      startBattle({ enemyId: 'goblin-1' });
      queueBattleEvent({ id: 'evt-1', type: 'attack' });
      clearBattleEvents();

      const state = useGameStore.getState();
      expect(state.battleSession?.eventQueue).toHaveLength(0);
    });
  });

  describe('Team Management', () => {
    it('should start with empty team', () => {
      const state = useGameStore.getState();
      expect(state.playerData.team).toHaveLength(0);
    });

    it('should set team', () => {
      const { setTeam } = useGameStore.getState();
      const team = [
        { id: 'hero-1', name: 'Isaac', level: 5, stats: { hp: 100, maxHp: 100, attack: 20, defense: 15 } },
      ];
      setTeam(team);

      const state = useGameStore.getState();
      expect(state.playerData.team).toHaveLength(1);
      expect(state.playerData.team[0]?.name).toBe('Isaac');
    });

    it('should add team member', () => {
      const { addTeamMember } = useGameStore.getState();
      addTeamMember({ id: 'hero-1', name: 'Isaac', level: 1, stats: { hp: 50, maxHp: 50, attack: 10, defense: 5 } });

      const state = useGameStore.getState();
      expect(state.playerData.team).toHaveLength(1);
    });

    it('should update team member', () => {
      const { setTeam, updateTeamMember } = useGameStore.getState();
      setTeam([{ id: 'hero-1', name: 'Isaac', level: 1, stats: { hp: 50, maxHp: 50, attack: 10, defense: 5 } }]);

      updateTeamMember('hero-1', (member) => ({ ...member, level: 10 }));

      const state = useGameStore.getState();
      expect(state.playerData.team[0]?.level).toBe(10);
    });

    it('should remove team member', () => {
      const { setTeam, removeTeamMember } = useGameStore.getState();
      setTeam([
        { id: 'hero-1', name: 'Isaac', level: 1, stats: { hp: 50, maxHp: 50, attack: 10, defense: 5 } },
        { id: 'hero-2', name: 'Garet', level: 1, stats: { hp: 60, maxHp: 60, attack: 12, defense: 8 } },
      ]);

      removeTeamMember('hero-1');

      const state = useGameStore.getState();
      expect(state.playerData.team).toHaveLength(1);
      expect(state.playerData.team[0]?.id).toBe('hero-2');
    });
  });

  describe('Inventory Management', () => {
    it('should start with empty inventory', () => {
      const state = useGameStore.getState();
      expect(state.playerData.inventory.items).toHaveLength(0);
    });

    it('should add item to inventory', () => {
      const { addItem } = useGameStore.getState();
      addItem({ id: 'potion', name: 'Healing Potion', quantity: 3 });

      const state = useGameStore.getState();
      expect(state.playerData.inventory.items).toHaveLength(1);
      expect(state.playerData.inventory.items[0]?.quantity).toBe(3);
    });

    it('should stack same items', () => {
      const { addItem } = useGameStore.getState();
      addItem({ id: 'potion', name: 'Healing Potion', quantity: 3 });
      addItem({ id: 'potion', name: 'Healing Potion', quantity: 2 });

      const state = useGameStore.getState();
      expect(state.playerData.inventory.items).toHaveLength(1);
      expect(state.playerData.inventory.items[0]?.quantity).toBe(5);
    });

    it('should remove items from inventory', () => {
      const { addItem, removeItem } = useGameStore.getState();
      addItem({ id: 'potion', name: 'Healing Potion', quantity: 5 });
      removeItem('potion', 2);

      const state = useGameStore.getState();
      expect(state.playerData.inventory.items[0]?.quantity).toBe(3);
    });

    it('should remove item completely when quantity reaches zero', () => {
      const { addItem, removeItem } = useGameStore.getState();
      addItem({ id: 'potion', name: 'Healing Potion', quantity: 3 });
      removeItem('potion', 5); // Remove more than available

      const state = useGameStore.getState();
      expect(state.playerData.inventory.items).toHaveLength(0);
    });

    it('should clear inventory', () => {
      const { addItem, clearInventory } = useGameStore.getState();
      addItem({ id: 'potion', name: 'Healing Potion', quantity: 3 });
      addItem({ id: 'ether', name: 'Ether', quantity: 1 });
      clearInventory();

      const state = useGameStore.getState();
      expect(state.playerData.inventory.items).toHaveLength(0);
    });
  });
});
