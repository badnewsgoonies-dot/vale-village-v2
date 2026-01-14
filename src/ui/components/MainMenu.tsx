/**
 * Main Menu Component
 * Redesigned with Golden Sun aesthetic
 */

import { useEffect, useRef, useState } from 'preact/hooks';
import { useGameStore } from '../../store/gameStore';
import { useStore } from '../../ui/state/store';

import { GameInitializationService } from '../../core/services/GameInitializationService';
import './MainMenu.css';

// Character sprites flanking the menu
const MENU_CHARACTERS = {
  left: [
    { name: 'Isaac', sprite: '/sprites/overworld/protagonists/Isaac.gif' },
    { name: 'Garet', sprite: '/sprites/overworld/protagonists/Garet.gif' },
  ],
  right: [
    { name: 'Ivan', sprite: '/sprites/overworld/protagonists/Ivan.gif' },
    { name: 'Mia', sprite: '/sprites/overworld/protagonists/Mia.gif' },
  ],
};

export function MainMenu() {
  const startTransition = useGameStore((s) => s.startTransition);
  const openCompendium = useGameStore((s) => s.openCompendium);
  const openModal = useGameStore((s) => s.openModal);
  const activeModal = useGameStore((s) => s.flow.modal);
  const openCompendiumFlow = useStore((s) => s.openCompendium);
  const setTeam = useStore((s) => s.setTeam);
  const addUnitToRoster = useStore((s) => s.addUnitToRoster);
  const openTowerFromMainMenu = useStore((s) => s.openTowerFromMainMenu);
  const openShopFromMainMenu = useStore((s) => s.openShopFromMainMenu);
  const hasSaveSlot = useStore((s) => s.hasSaveSlot);
  const setMode = useStore((s) => s.setMode);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hasSaveFile, setHasSaveFile] = useState(false);

  // Check for existing save files on mount
  useEffect(() => {
    // Check if any of the 3 save slots have data
    const hasAnySave = hasSaveSlot(0) || hasSaveSlot(1) || hasSaveSlot(2);
    setHasSaveFile(hasAnySave);
  }, [hasSaveSlot]);

  useEffect(() => {
    setMode('main-menu');
  }, [setMode]);

  const menuOptions = [
    { id: 'new-game', label: 'New Game', enabled: true },
    { id: 'continue', label: 'Continue', enabled: hasSaveFile },
    { id: 'shop', label: 'Shop', enabled: true },
    { id: 'settings', label: 'Settings', enabled: true },
    { id: 'compendium', label: 'Compendium', enabled: true },
    { id: 'how-to-play', label: 'How to Play', enabled: true },
    { id: 'battle-tower', label: 'Battle Tower (Beta)', enabled: true },
  ];

  const enabledOptions = menuOptions.filter(opt => opt.enabled);

  // Ensure selectedIndex is within bounds
  const safeSelectedIndex = Math.min(selectedIndex, enabledOptions.length - 1);

  // Avoid stale key-handler closures by reading the latest selection from refs.
  const enabledOptionsRef = useRef(enabledOptions);
  enabledOptionsRef.current = enabledOptions;
  const selectedIndexRef = useRef(selectedIndex);
  selectedIndexRef.current = selectedIndex;
  const activeModalRef = useRef(activeModal);
  activeModalRef.current = activeModal;

  useEffect(() => {
    // Reset selected index when enabled options change
    if (selectedIndex >= enabledOptions.length) {
      setSelectedIndex(0);
    }
  }, [enabledOptions.length, selectedIndex]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't steal input while a modal is open.
      if (activeModalRef.current !== null) return;

      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        event.stopPropagation();

        if (event.key === 'ArrowUp') {
          setSelectedIndex((prev) => {
            const options = enabledOptionsRef.current;
            const newIndex = prev > 0 ? prev - 1 : Math.max(0, options.length - 1);
            selectedIndexRef.current = newIndex;
            return newIndex;
          });
        } else {
          setSelectedIndex((prev) => {
            const options = enabledOptionsRef.current;
            const newIndex = prev < options.length - 1 ? prev + 1 : 0;
            selectedIndexRef.current = newIndex;
            return newIndex;
          });
        }
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        const options = enabledOptionsRef.current;
        const index = Math.min(selectedIndexRef.current, Math.max(0, options.length - 1));
        const selected = options[index] || options[0];
        if (selected) {
          handleSelectOption(selected.id);
        }
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        startTransition('title');
        return;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [startTransition]);

  const handleSelectOption = (optionId: string) => {
    if (optionId === 'new-game') {
      const starterTeam = GameInitializationService.createStarterTeamWithFlint();
      setTeam(starterTeam);
      
      // Add units to roster for legacy/compatibility if needed, 
      // though GameInitializationService returns a full Team object.
      // We iterate to ensure store consistency.
      starterTeam.units.forEach(unit => addUnitToRoster(unit));

      setMode('overworld');
      startTransition('overworld'); // Start new game -> go to overworld
    } else if (optionId === 'continue') {
      if (hasSaveFile) {
        // Open save menu modal to let user choose which slot to load
        openModal('save');
      }
    } else if (optionId === 'shop') {
      openShopFromMainMenu();
      startTransition('shop');
    } else if (optionId === 'compendium') {
      openCompendiumFlow();
      openCompendium();
    } else if (optionId === 'settings') {
      openModal('settings');
    } else if (optionId === 'how-to-play') {
      openModal('help');
    } else if (optionId === 'battle-tower') {
      // Initialize team if none exists (for Battle Tower quick access)
      const store = useStore.getState();
      if (!store.team || store.team.units.length === 0) {
        const starterTeam = GameInitializationService.createStarterTeamWithFlint();
        setTeam(starterTeam);
        starterTeam.units.forEach(unit => addUnitToRoster(unit));
      }
      // Enter the actual tower system with proper progression
      openTowerFromMainMenu();
      startTransition('tower');
    }
  };

  return (
    <div class="main-menu" role="navigation" aria-label="Main Menu" data-testid="main-menu">
      {/* Left character sprites */}
      <div class="main-menu-characters main-menu-characters--left">
        {MENU_CHARACTERS.left.map((char, i) => (
          <img
            key={char.name}
            src={char.sprite}
            alt={char.name}
            class="main-menu-sprite"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>

      <div class="main-menu-content gs-window gs-window--layered">
        <h1 class="gs-title">Vale Chronicles</h1>
        <div class="main-menu-options">
          {menuOptions.map((option) => {
            const isEnabled = option.enabled;
            const enabledIndex = enabledOptions.findIndex(opt => opt.id === option.id);
            const isSelected = enabledIndex === safeSelectedIndex && isEnabled;

            return (
              <button
                key={option.id}
                class={`gs-button ${isSelected ? 'selected' : ''} ${!isEnabled ? 'disabled' : ''}`}
                onClick={() => isEnabled && handleSelectOption(option.id)}
                disabled={!isEnabled}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right character sprites */}
      <div class="main-menu-characters main-menu-characters--right">
        {MENU_CHARACTERS.right.map((char, i) => (
          <img
            key={char.name}
            src={char.sprite}
            alt={char.name}
            class="main-menu-sprite"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>
    </div>
  );
}
