import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../../src/store/gameStore';

describe('Modal Stacking Logic', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useGameStore.getState().resetFlow();
  });

  it('should open a single modal correctly', () => {
    const { openModal } = useGameStore.getState();
    openModal('pause');
    
    const state = useGameStore.getState();
    expect(state.flow.modal).toBe('pause');
    expect(state.flow.modalReturnTo).toBeNull();
  });

  it('should stack modals correctly (nested modals)', () => {
    const { openModal } = useGameStore.getState();
    
    // Open first modal (e.g. Pause Menu)
    openModal('pause');
    expect(useGameStore.getState().flow.modal).toBe('pause');
    expect(useGameStore.getState().flow.modalReturnTo).toBeNull();
    
    // Open second modal (e.g. Settings from Pause Menu)
    openModal('settings');
    expect(useGameStore.getState().flow.modal).toBe('settings');
    expect(useGameStore.getState().flow.modalReturnTo).toBe('pause');
  });

  it('should return to previous modal when closing a nested modal', () => {
    const { openModal, closeModal } = useGameStore.getState();
    
    openModal('pause');
    openModal('settings');
    
    // Close settings, should return to pause
    closeModal();
    const state = useGameStore.getState();
    expect(state.flow.modal).toBe('pause');
    expect(state.flow.modalReturnTo).toBeNull();
  });

  it('should close completely when closing the base modal', () => {
    const { openModal, closeModal } = useGameStore.getState();
    
    openModal('pause');
    closeModal();
    
    const state = useGameStore.getState();
    expect(state.flow.modal).toBeNull();
    expect(state.flow.modalReturnTo).toBeNull();
  });

  it('should NOT stack if opening the same modal again', () => {
    const { openModal } = useGameStore.getState();
    
    openModal('pause');
    openModal('pause'); // Re-opening same modal should not stack it
    
    const state = useGameStore.getState();
    expect(state.flow.modal).toBe('pause');
    expect(state.flow.modalReturnTo).toBeNull();
  });

  it('should support deeper nesting (replacing returnTo)', () => {
    // Current implementation supports 1 level of return history by replacing it
    const { openModal, closeModal } = useGameStore.getState();
    
    openModal('pause');
    openModal('settings');
    expect(useGameStore.getState().flow.modalReturnTo).toBe('pause');
    
    openModal('inventory');
    expect(useGameStore.getState().flow.modal).toBe('inventory');
    expect(useGameStore.getState().flow.modalReturnTo).toBe('settings');
    
    // Closing inventory should return to settings
    closeModal();
    expect(useGameStore.getState().flow.modal).toBe('settings');
    expect(useGameStore.getState().flow.modalReturnTo).toBeNull();
    
    // Closing settings should return to null (since we only keep 1 level of history)
    closeModal();
    expect(useGameStore.getState().flow.modal).toBeNull();
  });

  it('should not allow opening modals during transitions', () => {
    const { setTransitioning, openModal } = useGameStore.getState();
    
    setTransitioning(true);
    openModal('pause');
    
    const state = useGameStore.getState();
    expect(state.flow.modal).toBeNull();
  });
});