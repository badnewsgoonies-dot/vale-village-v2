/**
 * Component unit tests
 * Tests individual UI components in isolation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import { h } from 'preact';

// Mock the stores
vi.mock('../../src/store/gameStore', () => ({
  useGameStore: vi.fn((selector) => {
    const mockState = {
      flow: { screen: 'title', modal: null, isTransitioning: false },
      setScreen: vi.fn(),
      openModal: vi.fn(),
      closeModal: vi.fn(),
    };
    return selector ? selector(mockState) : mockState;
  }),
}));

vi.mock('../../src/ui/state/store', () => ({
  useStore: vi.fn((selector) => {
    const mockState = {
      mode: 'title-screen',
      setMode: vi.fn(),
    };
    return selector ? selector(mockState) : mockState;
  }),
}));

describe('Component Tests', () => {
  describe('Basic Rendering', () => {
    it('should render text correctly', () => {
      const TestComponent = () => h('div', { 'data-testid': 'test' }, 'Hello World');
      render(h(TestComponent, null));

      expect(screen.getByTestId('test')).toBeDefined();
      expect(screen.getByText('Hello World')).toBeDefined();
    });

    it('should handle click events', () => {
      const handleClick = vi.fn();
      const TestComponent = () =>
        h('button', { onClick: handleClick, 'data-testid': 'btn' }, 'Click me');

      render(h(TestComponent, null));
      fireEvent.click(screen.getByTestId('btn'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Menu Button Component', () => {
    interface MenuButtonProps {
      label: string;
      selected?: boolean;
      disabled?: boolean;
      onClick?: () => void;
    }

    const MenuButton = ({ label, selected = false, disabled = false, onClick }: MenuButtonProps) =>
      h(
        'button',
        {
          class: `menu-button ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`,
          disabled,
          onClick,
          'data-testid': 'menu-button',
        },
        label
      );

    it('should render with label', () => {
      render(h(MenuButton, { label: 'New Game' }));
      expect(screen.getByText('New Game')).toBeDefined();
    });

    it('should apply selected class when selected', () => {
      render(h(MenuButton, { label: 'New Game', selected: true }));
      const button = screen.getByTestId('menu-button');
      expect(button.className).toContain('selected');
    });

    it('should apply disabled class when disabled', () => {
      render(h(MenuButton, { label: 'Continue', disabled: true }));
      const button = screen.getByTestId('menu-button');
      expect(button.className).toContain('disabled');
      expect(button.hasAttribute('disabled')).toBe(true);
    });

    it('should call onClick when clicked', () => {
      const onClick = vi.fn();
      render(h(MenuButton, { label: 'New Game', onClick }));

      fireEvent.click(screen.getByTestId('menu-button'));
      expect(onClick).toHaveBeenCalled();
    });

    it('should not call onClick when disabled', () => {
      const onClick = vi.fn();
      render(h(MenuButton, { label: 'Continue', disabled: true, onClick }));

      fireEvent.click(screen.getByTestId('menu-button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Screen Container Component', () => {
    interface ScreenContainerProps {
      title: string;
      children?: preact.ComponentChildren;
    }

    const ScreenContainer = ({ title, children }: ScreenContainerProps) =>
      h('div', { class: 'screen-container', 'data-testid': 'screen' }, [
        h('h1', { key: 'title', class: 'screen-title' }, title),
        h('div', { key: 'content', class: 'screen-content' }, children),
      ]);

    it('should render with title', () => {
      render(h(ScreenContainer, { title: 'Main Menu' }));
      expect(screen.getByText('Main Menu')).toBeDefined();
    });

    it('should render children', () => {
      render(
        h(ScreenContainer, { title: 'Menu' }, h('span', { 'data-testid': 'child' }, 'Child content'))
      );
      expect(screen.getByTestId('child')).toBeDefined();
      expect(screen.getByText('Child content')).toBeDefined();
    });
  });

  describe('Loading State Component', () => {
    interface LoadingProps {
      isLoading: boolean;
      children?: preact.ComponentChildren;
    }

    const LoadingWrapper = ({ isLoading, children }: LoadingProps) =>
      isLoading
        ? h('div', { class: 'loading', 'data-testid': 'loading' }, 'Loading...')
        : h('div', { 'data-testid': 'content' }, children);

    it('should show loading state when isLoading is true', () => {
      render(h(LoadingWrapper, { isLoading: true }, 'Content'));
      expect(screen.getByTestId('loading')).toBeDefined();
      expect(screen.queryByTestId('content')).toBeNull();
    });

    it('should show content when isLoading is false', () => {
      render(h(LoadingWrapper, { isLoading: false }, 'Content'));
      expect(screen.getByTestId('content')).toBeDefined();
      expect(screen.queryByTestId('loading')).toBeNull();
    });
  });
});

describe('Keyboard Event Handling', () => {
  it('should handle keyboard events', () => {
    const handleKeyDown = vi.fn();
    const KeyboardComponent = () =>
      h('input', {
        onKeyDown: handleKeyDown,
        'data-testid': 'input',
      });

    render(h(KeyboardComponent, null));
    const input = screen.getByTestId('input');

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleKeyDown).toHaveBeenCalled();
  });

  it('should detect specific keys', () => {
    const keys: string[] = [];
    const handleKeyDown = (e: KeyboardEvent) => keys.push(e.key);
    const KeyboardComponent = () =>
      h('input', {
        onKeyDown: handleKeyDown,
        'data-testid': 'input',
      });

    render(h(KeyboardComponent, null));
    const input = screen.getByTestId('input');

    fireEvent.keyDown(input, { key: 'ArrowUp' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(keys).toEqual(['ArrowUp', 'ArrowDown', 'Enter', 'Escape']);
  });
});

describe('State Hooks', () => {
  it('should update state on interaction', async () => {
    const { useState } = await import('preact/hooks');

    const Counter = () => {
      const [count, setCount] = useState(0);
      return h('div', null, [
        h('span', { key: 'count', 'data-testid': 'count' }, String(count)),
        h('button', { key: 'btn', 'data-testid': 'increment', onClick: () => setCount(count + 1) }, '+'),
      ]);
    };

    render(h(Counter, null));

    expect(screen.getByTestId('count').textContent).toBe('0');

    fireEvent.click(screen.getByTestId('increment'));
    expect(screen.getByTestId('count').textContent).toBe('1');

    fireEvent.click(screen.getByTestId('increment'));
    expect(screen.getByTestId('count').textContent).toBe('2');
  });
});
