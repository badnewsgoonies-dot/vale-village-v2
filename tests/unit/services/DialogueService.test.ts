/**
 * Unit tests for DialogueService
 * Tests dialogue tree navigation, choice handling, and effects
 */

import { describe, it, expect } from 'vitest';
import {
  startDialogue,
  selectChoice,
  advanceDialogue,
  getCurrentNode,
  getAvailableChoices,
} from '../../../src/core/services/DialogueService';
import type { DialogueTree, DialogueState, DialogueNode, DialogueChoice } from '../../../src/core/models/dialogue';

// Helper to create a minimal dialogue tree for testing
function createTestDialogueTree(overrides: Partial<DialogueTree> = {}): DialogueTree {
  const baseTree: DialogueTree = {
    id: 'test-dialogue',
    nodes: [
      {
        id: 'start',
        speaker: 'Test NPC',
        text: 'Hello, adventurer!',
        nextNodeId: 'choice-node',
      },
      {
        id: 'choice-node',
        speaker: 'Test NPC',
        text: 'What would you like to do?',
        choices: [
          { id: 'choice-a', text: 'Option A', nextNodeId: 'end-a' },
          { id: 'choice-b', text: 'Option B', nextNodeId: 'end-b' },
        ],
      },
      {
        id: 'end-a',
        speaker: 'Test NPC',
        text: 'You chose option A!',
      },
      {
        id: 'end-b',
        speaker: 'Test NPC',
        text: 'You chose option B!',
      },
    ],
    startNodeId: 'start',
  };
  return {
    ...baseTree,
    ...overrides,
    nodes: overrides.nodes || baseTree.nodes,
  };
}

// Helper to create a minimal dialogue state
function createTestDialogueState(treeId: string, nodeId: string): DialogueState {
  return {
    treeId,
    currentNodeId: nodeId,
    history: [nodeId],
    variables: {},
  };
}

describe('DialogueService', () => {
  describe('startDialogue', () => {
    it('should initialize dialogue state at start node', () => {
      const tree = createTestDialogueTree();
      const state = startDialogue(tree);

      expect(state.treeId).toBe('test-dialogue');
      expect(state.currentNodeId).toBe('start');
      expect(state.history).toContain('start');
      expect(state.variables).toEqual({});
    });

    it('should use specified startNodeId', () => {
      const tree = createTestDialogueTree({ startNodeId: 'choice-node' });
      const state = startDialogue(tree);

      expect(state.currentNodeId).toBe('choice-node');
    });
  });

  describe('getCurrentNode', () => {
    it('should return the current node', () => {
      const tree = createTestDialogueTree();
      const state = createTestDialogueState('test-dialogue', 'start');

      const node = getCurrentNode(tree, state);

      expect(node).toBeDefined();
      expect(node?.id).toBe('start');
      expect(node?.speaker).toBe('Test NPC');
      expect(node?.text).toBe('Hello, adventurer!');
    });

    it('should return undefined for invalid node', () => {
      const tree = createTestDialogueTree();
      const state = createTestDialogueState('test-dialogue', 'invalid-node');

      const node = getCurrentNode(tree, state);

      expect(node).toBeUndefined();
    });
  });

  describe('advanceDialogue', () => {
    it('should advance to next node', () => {
      const tree = createTestDialogueTree();
      const state = createTestDialogueState('test-dialogue', 'start');

      const newState = advanceDialogue(tree, state);

      expect(newState).not.toBeNull();
      expect(newState?.currentNodeId).toBe('choice-node');
    });

    it('should return null when at terminal node', () => {
      const tree = createTestDialogueTree();
      const state = createTestDialogueState('test-dialogue', 'end-a');

      const newState = advanceDialogue(tree, state);

      expect(newState).toBeNull();
    });

    it('should return null when current node has choices (requires selectChoice)', () => {
      const tree = createTestDialogueTree();
      const state = createTestDialogueState('test-dialogue', 'choice-node');

      const newState = advanceDialogue(tree, state);

      expect(newState).toBeNull();
    });
  });

  describe('selectChoice', () => {
    it('should navigate to chosen path', () => {
      const tree = createTestDialogueTree();
      const state = createTestDialogueState('test-dialogue', 'choice-node');

      const newState = selectChoice(tree, state, 'choice-a');

      expect(newState.currentNodeId).toBe('end-a');
      expect(newState.history).toContain('end-a');
    });

    it('should record choice in history', () => {
      const tree = createTestDialogueTree();
      const state = createTestDialogueState('test-dialogue', 'choice-node');

      const newState = selectChoice(tree, state, 'choice-b');

      expect(newState.currentNodeId).toBe('end-b');
      expect(newState.history).toContain('end-b');
    });

    it('should handle invalid choice gracefully', () => {
      const tree = createTestDialogueTree();
      const state = createTestDialogueState('test-dialogue', 'choice-node');

      const newState = selectChoice(tree, state, 'invalid-choice');

      // Should stay at same node if choice is invalid
      expect(newState.currentNodeId).toBe('choice-node');
    });
  });

  describe('getAvailableChoices', () => {
    it('should return all choices when no conditions', () => {
      const tree = createTestDialogueTree();
      const node = tree.nodes.find((n) => n.id === 'choice-node');

      const context = {
        flags: {},
        inventory: { items: [] },
        gold: 0,
        level: 1,
      };

      const choices = getAvailableChoices(node!, context);

      expect(choices.length).toBe(2);
      expect(choices.map((c) => c.id)).toContain('choice-a');
      expect(choices.map((c) => c.id)).toContain('choice-b');
    });

    it('should filter choices based on flag conditions', () => {
      const treeWithConditions: DialogueTree = {
        id: 'conditional-dialogue',
        nodes: [
          {
            id: 'conditional-choice',
            speaker: 'Test NPC',
            text: 'Choose wisely...',
            choices: [
              { id: 'always', text: 'Always available', nextNodeId: 'end' },
              {
                id: 'flag-required',
                text: 'Requires flag',
                nextNodeId: 'end',
                condition: { type: 'flag', key: 'hasKey', value: true },
              },
            ],
          },
          { id: 'end', speaker: 'Test NPC', text: 'The end.' },
        ],
        startNodeId: 'conditional-choice',
      };

      const node = treeWithConditions.nodes[0];

      // Without flag
      const contextNoFlag = {
        flags: {},
        inventory: { items: [] },
        gold: 0,
        level: 1,
      };
      const choicesNoFlag = getAvailableChoices(node!, contextNoFlag);
      expect(choicesNoFlag.length).toBe(1);
      expect(choicesNoFlag[0].id).toBe('always');

      // With flag set to true
      const contextWithFlag = {
        flags: { hasKey: true },
        inventory: { items: [] },
        gold: 0,
        level: 1,
      };
      const choicesWithFlag = getAvailableChoices(node!, contextWithFlag);
      expect(choicesWithFlag.length).toBe(2);
    });

    it('should return empty array for node without choices', () => {
      const tree = createTestDialogueTree();
      const node = tree.nodes.find((n) => n.id === 'end-a');

      const context = {
        flags: {},
        inventory: { items: [] },
        gold: 0,
        level: 1,
      };

      const choices = getAvailableChoices(node!, context);

      expect(choices).toEqual([]);
    });
  });

  describe('Full Dialogue Flow', () => {
    it('should complete a full dialogue with choices', () => {
      const tree = createTestDialogueTree();

      // Start dialogue
      let state = startDialogue(tree);
      expect(state.currentNodeId).toBe('start');

      // Advance to choices
      const state2 = advanceDialogue(tree, state);
      expect(state2).not.toBeNull();
      state = state2!;
      expect(state.currentNodeId).toBe('choice-node');

      // Make a choice
      state = selectChoice(tree, state, 'choice-a');
      expect(state.currentNodeId).toBe('end-a');

      // Try to advance (should end)
      const finalState = advanceDialogue(tree, state);
      expect(finalState).toBeNull();
    });

    it('should track history through dialogue', () => {
      const tree: DialogueTree = {
        id: 'multi-choice',
        nodes: [
          {
            id: 'choice-1',
            speaker: 'NPC',
            text: 'First choice',
            choices: [
              { id: 'c1-a', text: 'A', nextNodeId: 'choice-2' },
              { id: 'c1-b', text: 'B', nextNodeId: 'choice-2' },
            ],
          },
          {
            id: 'choice-2',
            speaker: 'NPC',
            text: 'Second choice',
            choices: [
              { id: 'c2-a', text: 'A', nextNodeId: 'end' },
              { id: 'c2-b', text: 'B', nextNodeId: 'end' },
            ],
          },
          { id: 'end', speaker: 'NPC', text: 'Done.' },
        ],
        startNodeId: 'choice-1',
      };

      let state = startDialogue(tree);
      expect(state.history).toContain('choice-1');

      state = selectChoice(tree, state, 'c1-a');
      expect(state.history).toContain('choice-2');

      state = selectChoice(tree, state, 'c2-b');
      expect(state.history).toContain('end');
      expect(state.currentNodeId).toBe('end');
    });
  });

  describe('Dialogue Effects', () => {
    it('should handle node with effects', () => {
      const treeWithEffects: DialogueTree = {
        id: 'effects-dialogue',
        nodes: [
          {
            id: 'start',
            speaker: 'NPC',
            text: 'Here is a reward!',
            effects: {
              questAccepted: true,
            },
          },
        ],
        startNodeId: 'start',
      };

      const state = startDialogue(treeWithEffects);
      const node = getCurrentNode(treeWithEffects, state);

      expect(node?.effects).toBeDefined();
      expect(node?.effects?.questAccepted).toBe(true);
    });

    it('should handle choice with effects', () => {
      const tree: DialogueTree = {
        id: 'choice-effects',
        nodes: [
          {
            id: 'choice-node',
            speaker: 'NPC',
            text: 'Will you join us?',
            choices: [
              {
                id: 'accept',
                text: 'Yes',
                nextNodeId: 'end',
                effects: { recruitUnit: 'garet' },
              },
              { id: 'decline', text: 'No', nextNodeId: 'end' },
            ],
          },
          { id: 'end', speaker: 'NPC', text: 'Very well.' },
        ],
        startNodeId: 'choice-node',
      };

      const node = tree.nodes[0];
      const acceptChoice = node.choices?.find((c) => c.id === 'accept');

      expect(acceptChoice?.effects).toBeDefined();
      expect(acceptChoice?.effects?.recruitUnit).toBe('garet');
    });
  });
});
