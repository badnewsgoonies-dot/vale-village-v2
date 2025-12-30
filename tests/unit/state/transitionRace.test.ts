import { describe, it, expect } from 'vitest';
import { createStore as createVV2Store } from '../../../src/ui/state/store';

describe('Transition race guard', () => {
  it('endDialogue should preserve pendingBattleEncounterId and move to team-select when intent exists', () => {
    const store = createVV2Store();

    // Simulate being in dialogue with a pending battle intent set by dialogue effects
    store.setState({ mode: 'dialogue', dialogueReturnMode: 'overworld', pendingBattleEncounterId: 'enc:test-01' });

    // Ending the dialogue should respect the pending battle intent and go to team-select
    store.getState().endDialogue();

    expect(store.getState().mode).toBe('team-select');
    expect(store.getState().pendingBattleEncounterId).toBe('enc:test-01');
  });
});
