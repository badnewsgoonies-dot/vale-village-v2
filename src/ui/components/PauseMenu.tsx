/**
 * PauseMenu Component
 *
 * Redesigned with Golden Sun aesthetic
 */

import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
import { useStore } from '../state/store';
import './PauseMenu.css';

interface PauseMenuProps {
  onClose: () => void;
  onTeamManagement?: () => void;
  onInventory?: () => void;
  onDjinnCollection?: () => void;
  onSaveGame?: () => void;
  onSettings?: () => void;
  onHowToPlay?: () => void;
  onReturnToTitle?: () => void;
}

interface MenuItem {
  id: string;
  icon: string;
  label: string;
  shortcut: string;
  action?: () => void;
  dividerAfter?: boolean;
}

export function PauseMenu({
  onClose,
  onTeamManagement,
  onInventory,
  onDjinnCollection,
  onSaveGame,
  onSettings,
  onHowToPlay,
  onReturnToTitle,
}: PauseMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [flashIndex, setFlashIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const prevActiveRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const el = document.activeElement;
      prevActiveRef.current = el instanceof HTMLElement ? el : null;
    }
  }, []);

  const closeWithRestore = () => {
    try {
      if (prevActiveRef.current && prevActiveRef.current.isConnected) prevActiveRef.current.focus();
    } catch (e) {
      // ignore
    }
    onClose();
  };

  // Get game state for status bar
  const story = useStore((s) => s.story);
  const gold = useStore((s) => s.gold);
  const roster = useStore((s) => s.roster);

  // Define menu items
  const menuItems: MenuItem[] = [
    { id: 'resume', icon: '▶️', label: 'Resume Game', shortcut: 'ESC', action: onClose },
    { id: 'team', icon: '👥', label: 'Team Management', shortcut: 'T', action: onTeamManagement },
    { id: 'inventory', icon: '🎒', label: 'Inventory', shortcut: 'I', action: onInventory },
    { id: 'djinn', icon: '✨', label: 'Djinn Collection', shortcut: 'D', action: onDjinnCollection, dividerAfter: true },
    { id: 'save', icon: '💾', label: 'Save Game', shortcut: 'S', action: onSaveGame },
    { id: 'settings', icon: '⚙️', label: 'Settings', shortcut: 'O', action: onSettings },
    { id: 'help', icon: '❓', label: 'How to Play', shortcut: 'H', action: onHowToPlay, dividerAfter: true },
    { id: 'title', icon: '🏠', label: 'Return to Title', shortcut: 'Q', action: onReturnToTitle },
  ];

  // Execute menu action with flash effect
  const executeAction = useCallback((index: number) => {
    const item = menuItems[index];
    if (item?.action) {
      setFlashIndex(index);
      setTimeout(() => {
        setFlashIndex(null);
        // If the selected action is resume, restore focus before closing
        if (item.id === 'resume') {
          closeWithRestore();
        } else {
          item.action?.();
        }
      }, 150);
    }
  }, [menuItems]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for navigation keys
      if (['ArrowUp', 'ArrowDown', 'Enter', ' ', 'Escape'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }

      switch (e.key) {
        case 'ArrowDown':
          setSelectedIndex((prev) => (prev + 1) % menuItems.length);
          break;
        case 'ArrowUp':
          setSelectedIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length);
          break;
        case 'Enter':
        case ' ':
          executeAction(selectedIndex);
          break;
        case 'Escape':
          closeWithRestore();
          break;
        // Keyboard shortcuts
        case 't':
        case 'T':
          if (onTeamManagement) {
            const idx = menuItems.findIndex((m) => m.id === 'team');
            executeAction(idx);
          }
          break;
        case 'i':
        case 'I':
          if (onInventory) {
            const idx = menuItems.findIndex((m) => m.id === 'inventory');
            executeAction(idx);
          }
          break;
        case 'd':
        case 'D':
          if (onDjinnCollection) {
            const idx = menuItems.findIndex((m) => m.id === 'djinn');
            executeAction(idx);
          }
          break;
        case 's':
        case 'S':
          if (onSaveGame) {
            const idx = menuItems.findIndex((m) => m.id === 'save');
            executeAction(idx);
          }
          break;
        case 'o':
        case 'O':
          if (onSettings) {
            const idx = menuItems.findIndex((m) => m.id === 'settings');
            executeAction(idx);
          }
          break;
        case 'h':
        case 'H':
          if (onHowToPlay) {
            const idx = menuItems.findIndex((m) => m.id === 'help');
            executeAction(idx);
          }
          break;
        case 'q':
        case 'Q':
          if (onReturnToTitle) {
            const idx = menuItems.findIndex((m) => m.id === 'title');
            executeAction(idx);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [selectedIndex, menuItems, executeAction, onClose, onTeamManagement, onInventory, onDjinnCollection, onSaveGame, onSettings, onHowToPlay, onReturnToTitle]);

  // Focus management
  useEffect(() => {
    menuRef.current?.focus();
  }, []);

  return (
    <div class="pause-overlay" role="dialog" aria-modal="true" aria-label="Pause Menu" data-testid="pause-menu">
      {/* Status Bar */}
      <div class="pause-status-bar gs-window gs-window--layered">
        <div class="status-item">
          <span class="gs-label">Chapter:</span>
          <span class="gs-value">{story.chapter}</span>
        </div>
        <div class="status-item">
          <span class="gs-label">Units:</span>
          <span class="gs-value">{roster.length}/10</span>
        </div>
        <div class="status-item">
          <span class="gs-label">Gold:</span>
          <span class="gs-value">{gold.toLocaleString()}</span>
        </div>
      </div>

      {/* Pause Menu Container */}
      <div class="pause-menu gs-window gs-window--layered" ref={menuRef} tabIndex={-1}>
        <h1 class="gs-title">PAUSED</h1>

        <div class="menu-options" role="menu">
          {menuItems.map((item, index) => (
            <div key={item.id}>
              <button
                class={`gs-button ${selectedIndex === index ? 'selected' : ''} ${flashIndex === index ? 'flash' : ''}`}
                onClick={() => {
                  setSelectedIndex(index);
                  executeAction(index);
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                role="menuitem"
                aria-selected={selectedIndex === index}
                disabled={!item.action}
              >
                <span class="menu-icon" aria-hidden="true">{item.icon}</span>
                <span class="menu-label">{item.label}</span>
                <span class="menu-hint">{item.shortcut}</span>
              </button>
              {item.dividerAfter && <div class="menu-divider" />}
            </div>
          ))}
        </div>

        <div class="pause-footer">
          <div class="keyboard-hints">
            <div class="hint">
              <span class="key">↑↓</span>
              <span>Navigate</span>
            </div>
            <div class="hint">
              <span class="key">Enter</span>
              <span>Select</span>
            </div>
            <div class="hint">
              <span class="key">ESC</span>
              <span>Resume</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
