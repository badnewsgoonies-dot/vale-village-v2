/**
 * Unit tests for dialogue slice state machine invariants
 */

import { describe, expect, it } from 'vitest';

import type { DialogueTree } from '../../../src/core/models/dialogue';
import { createUnit } from '../../../src/core/models/Unit';
import { createTeam } from '../../../src/core/models/Team';
import { UNIT_DEFINITIONS } from '../../../src/data/definitions/units';
import { createStore as createVV2Store } from '../../../src/ui/state/store';

function createTestDialogueTree(overrides: Partial<DialogueTree> = {}): DialogueTree {
  const baseTree: DialogueTree = {
    id: 'test-dialogue',
    name: 'Test Dialogue',
    startNodeId: 'start',
    nodes: [
      { id: 'start', speaker: 'NPC', text: 'Hello there.', nextNodeId: 'end' },
      { id: 'end', speaker: 'NPC', text: 'Goodbye.' },
    ],
  };

  return {
    ...baseTree,
    ...overrides,
    nodes: overrides.nodes ?? baseTree.nodes,
  };
}

describe('DialogueSlice', () => {
  it('startDialogueTree sets mode=dialogue and preserves return mode', () => {
    const store = createVV2Store();
    store.setState({ mode: 'overworld' });

    const tree = createTestDialogueTree({ id: 'tree-1' });
    store.getState().startDialogueTree(tree);

    const state = store.getState();
    expect(state.mode).toBe('dialogue');
    expect(state.dialogueReturnMode).toBe('overworld');
    expect(state.currentDialogueTree?.id).toBe('tree-1');
    expect(state.currentDialogueState?.treeId).toBe('tree-1');
    expect(state.currentDialogueState?.currentNodeId).toBe('start');
    expect(state.currentDialogueState?.history.at(-1)).toBe('start');
  });

  it('endDialogue clears dialogue state and returns to return mode', () => {
    const store = createVV2Store();
    store.setState({ mode: 'battle' });

    store.getState().startDialogueTree(createTestDialogueTree());
    expect(store.getState().mode).toBe('dialogue');

    store.getState().endDialogue();
    const state = store.getState();

    expect(state.mode).toBe('battle');
    expect(state.currentDialogueTree).toBeNull();
    expect(state.currentDialogueState).toBeNull();
    expect(state.dialogueReturnMode).toBeNull();
  });

  it('startDialogueTree while already in dialogue preserves initial return mode', () => {
    const store = createVV2Store();
    store.setState({ mode: 'shop' });

    store.getState().startDialogueTree(createTestDialogueTree({ id: 'tree-1' }));
    expect(store.getState().dialogueReturnMode).toBe('shop');

    store.getState().startDialogueTree(createTestDialogueTree({ id: 'tree-2', startNodeId: 'end' }));
    const state = store.getState();

    expect(state.mode).toBe('dialogue');
    expect(state.dialogueReturnMode).toBe('shop');
    expect(state.currentDialogueTree?.id).toBe('tree-2');
    expect(state.currentDialogueState?.currentNodeId).toBe('end');
  });

  it('endDialogue preserves mode when dialogue effects already changed mode', () => {
    const store = createVV2Store();
    store.setState({ mode: 'overworld' });

    store.getState().startDialogueTree(createTestDialogueTree());
    expect(store.getState().mode).toBe('dialogue');

    // Simulate an effect (e.g., starting battle) changing us out of dialogue mode.
    store.setState({ mode: 'battle' });
    store.getState().endDialogue();

    expect(store.getState().mode).toBe('battle');
  });

  it('closing tutorial:djinn-intro marks story flag and ensures Flint is collected+equipped', () => {
    const store = createVV2Store();
    store.setState({ mode: 'overworld' });

    const adeptDef = UNIT_DEFINITIONS['adept'];
    expect(adeptDef).toBeDefined();

    const team = createTeam([createUnit(adeptDef!, 1, 0)]);
    store.getState().setTeam(team);

    const tutorialTree = createTestDialogueTree({
      id: 'tutorial:djinn-intro',
      name: "Djinn Tutorial: Flint's Guidance",
    });

    store.getState().startDialogueTree(tutorialTree);
    store.getState().endDialogue();

    const state = store.getState();
    expect(state.story.flags.first_djinn_intro_completed).toBe(true);
    expect(state.team?.collectedDjinn).toContain('flint');
    expect(state.team?.equippedDjinn).toContain('flint');
  });
});

