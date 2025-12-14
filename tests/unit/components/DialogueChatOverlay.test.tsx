/**
 * DialogueChatOverlay component tests
 */

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { h } from 'preact';

vi.mock('../../../src/ui/sprites/SimpleSprite', () => ({
  SimpleSprite: (props: { id: string }) => h('div', { 'data-testid': 'sprite', 'data-id': props.id }),
}));

vi.mock('../../../src/ui/sprites/utils/warnIfPlaceholderSprite', () => ({
  warnIfPlaceholderSprite: () => undefined,
}));

vi.mock('../../../src/ui/state/store', () => ({
  useStore: vi.fn((selector) => {
    const tree = {
      id: 'shopkeeper-weapons',
      name: 'Weapon Shop Owner',
      startNodeId: 'greeting',
      nodes: [
        {
          id: 'greeting',
          speaker: 'Shopkeeper',
          text: 'Welcome to my shop!',
          choices: [
            { id: 'buy', text: 'Show me your wares.', nextNodeId: 'show-shop' },
            { id: 'leave', text: 'Just browsing.', nextNodeId: 'farewell' },
          ],
        },
        {
          id: 'show-shop',
          speaker: 'Shopkeeper',
          text: 'Here are my finest weapons!',
        },
        {
          id: 'farewell',
          speaker: 'Shopkeeper',
          text: 'Come back anytime!',
        },
      ],
    };

    const mockState = {
      currentDialogueTree: tree,
      currentDialogueState: {
        treeId: tree.id,
        currentNodeId: 'show-shop',
        history: ['greeting', 'show-shop'],
        variables: {},
      },
      makeChoice: vi.fn(),
      advanceCurrentDialogue: vi.fn(),
      endDialogue: vi.fn(),
      story: { flags: {} },
      gold: 0,
      equipment: [],
      team: { units: [{ name: 'Adept' }] },
    };

    return selector ? selector(mockState) : mockState;
  }),
}));

import { DialogueChatOverlay } from '../../../src/ui/components/DialogueChatOverlay';

describe('DialogueChatOverlay', () => {
  it('renders inferred player choice as a chat message', () => {
    render(h(DialogueChatOverlay, null));

    expect(screen.getByText('Welcome to my shop!')).toBeDefined();
    expect(screen.getByText('Show me your wares.')).toBeDefined();
  });
});

