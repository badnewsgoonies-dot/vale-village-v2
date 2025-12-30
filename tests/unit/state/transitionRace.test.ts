import { describe, expect, it } from 'vitest';
import { createStore as createVV2Store } from '../../../src/ui/state/store';

function makeTestDialogueTree() {
  return {
    id: 'test-dialogue',
    name: 'Test Dialogue',
    startNodeId: 'start',
    nodes: [
      { id: 'start', speaker: 'NPC', text: 'Hello', nextNodeId: 'end' },
      { id: 'end', speaker: 'NPC', text: 'Goodbye' },
    ],
  };
}

describe('transition race (dialogue -> battle)', () => {
  it('endDialogue does not clear pending battle intent started from dialogue', () => {
    const store = createVV2Store();
    // Start from overworld
    store.setState({ mode: 'overworld' });

    // Start a dialogue
    store.getState().startDialogueTree(makeTestDialogueTree());
    expect(store.getState().mode).toBe('dialogue');

    // Simulate the dialogue effect having already initiated the battle flow
    // by directly setting the pending battle and mode (this mirrors what
    // handleTrigger would do inside dialogue effects). Doing this explicitly
    // avoids coupling the unit test to DialogueService implementation.
    store.setState({ mode: 'team-select', pendingBattleEncounterId: 'enc-test-1' });
    expect(store.getState().mode).toBe('team-select');
    expect(store.getState().pendingBattleEncounterId).toBe('enc-test-1');

    // Now close the dialogue; this used to revert the mode back to overworld.
    store.getState().endDialogue();

    // The change set in this round: endDialogue must preserve the pending battle intent.
    expect(store.getState().mode).toBe('team-select');
    expect(store.getState().pendingBattleEncounterId).toBe('enc-test-1');
  });
});
