/**
 * DialogueChatOverlay component tests
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/preact';
import { h } from 'preact';

vi.mock('../../../src/ui/sprites/SimpleSprite', () => ({
  SimpleSprite: (props: { id: string }) => h('div', { 'data-testid': 'sprite', 'data-id': props.id }),
}));

vi.mock('../../../src/ui/sprites/utils/warnIfPlaceholderSprite', () => ({
  warnIfPlaceholderSprite: () => undefined,
}));

const dialogueTree = {
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

const makeChoice = vi.fn();
const advanceCurrentDialogue = vi.fn();
const endDialogue = vi.fn();

const { useStoreMock } = vi.hoisted(() => ({
  useStoreMock: vi.fn(),
}));

let storeState = {
  currentDialogueTree: dialogueTree,
  currentDialogueState: {
    treeId: dialogueTree.id,
    currentNodeId: 'show-shop',
    history: ['greeting', 'show-shop'],
    variables: {},
  },
  makeChoice,
  advanceCurrentDialogue,
  endDialogue,
  story: { flags: {} },
  gold: 0,
  equipment: [],
  team: { units: [{ name: 'Adept' }] },
};

vi.mock('../../../src/ui/state/store', () => ({
  useStore: useStoreMock,
}));

import { DialogueChatOverlay } from '../../../src/ui/components/DialogueChatOverlay';

describe('DialogueChatOverlay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storeState = {
      currentDialogueTree: dialogueTree,
      currentDialogueState: {
        treeId: dialogueTree.id,
        currentNodeId: 'show-shop',
        history: ['greeting', 'show-shop'],
        variables: {},
      },
      makeChoice,
      advanceCurrentDialogue,
      endDialogue,
      story: { flags: {} },
      gold: 0,
      equipment: [],
      team: { units: [{ name: 'Adept' }] },
    };
    useStoreMock.mockImplementation((selector: any) => (selector ? selector(storeState) : storeState));
    (useStoreMock as any).getState = () => storeState;
  });

  it('renders inferred player choice as a chat message', () => {
    render(h(DialogueChatOverlay, null));

    expect(screen.getByText('Welcome to my shop!')).toBeDefined();
    expect(screen.getByText('Show me your wares.')).toBeDefined();
  });

  it('tap skips typing before advancing when there are no choices', async () => {
    render(h(DialogueChatOverlay, null));

    await new Promise((resolve) => setTimeout(resolve, 0));

    const overlay = document.querySelector('.dialogue-chat-overlay');
    expect(overlay).toBeTruthy();

    expect(screen.queryByText('Here are my finest weapons!')).toBeNull();
    fireEvent.click(overlay as HTMLElement);

    expect(advanceCurrentDialogue).not.toHaveBeenCalled();
    expect(screen.getByText('Here are my finest weapons!')).toBeDefined();
  });

  it('tap advances when not typing and there are no choices', async () => {
    render(h(DialogueChatOverlay, null));

    await new Promise((resolve) => setTimeout(resolve, 0));
    const skipButton = screen.getByRole('button', { name: 'Skip' });
    fireEvent.click(skipButton);

    const overlay = document.querySelector('.dialogue-chat-overlay');
    expect(overlay).toBeTruthy();

    fireEvent.click(overlay as HTMLElement);

    expect(advanceCurrentDialogue).toHaveBeenCalledTimes(1);
  });

  it('tap does not interfere with choice buttons', async () => {
    storeState = {
      ...storeState,
      currentDialogueState: {
        treeId: dialogueTree.id,
        currentNodeId: 'greeting',
        history: ['greeting'],
        variables: {},
      },
    };

    render(h(DialogueChatOverlay, null));
    await new Promise((resolve) => setTimeout(resolve, 0));

    const skipButton = screen.getByRole('button', { name: 'Skip' });
    fireEvent.click(skipButton);

    const choice = screen.getByRole('button', { name: /Show me your wares/ });
    fireEvent.click(choice);

    expect(makeChoice).toHaveBeenCalledTimes(1);
    expect(advanceCurrentDialogue).not.toHaveBeenCalled();
  });
});
