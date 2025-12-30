import { describe, it, expect } from 'vitest';
import { createStore } from '../../../src/ui/state/store';

describe('transition race (dialogue -> battle)', () => {
  it('preserves pending battle intent when dialogue triggers a battle', () => {
    const store = createStore();

    // Simulate an active dialogue that would normally return to overworld
    store.setState({
      currentDialogueTree: { id: 'dt:1', nodes: [] } as any,
      currentDialogueState: { treeId: 'dt:1', currentNodeId: 'n1' } as any,
      dialogueReturnMode: 'overworld',
      mode: 'dialogue',
    });

    // Dialogue effect triggers a battle (skip pre-battle dialogue)
    store.getState().handleTrigger(
      {
        id: 'dialogue-battle',
        type: 'battle',
        position: { x: 0, y: 0 },
        data: { encounterId: 'house-01' },
      },
      true
    );

    // End the dialogue shell (what used to race and clear intent)
    store.getState().endDialogue();

    const state = store.getState();
    expect(state.pendingBattleEncounterId).toBe('house-01');
    expect(['team-select', 'battle']).toContain(state.mode);
  });
});
