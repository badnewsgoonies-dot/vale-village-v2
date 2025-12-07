/**
 * Command Panel Component
 *
 * Displays command buttons and the ability panel for the current unit.
 */

import { JSX } from 'preact';
import { AbilityPanel } from './AbilityPanel';
import type { CommandPanelProps, CommandType } from './types';
import { SimpleSprite } from '../../sprites/SimpleSprite';

export function CommandPanel({
  currentUnit,
  selectedCommand,
  coreAbilities,
  djinnAbilities,
  onCommandSelect,
  onSelectAbility,
}: CommandPanelProps): JSX.Element {
  const renderCommandButton = (command: CommandType, label: string, icon?: string) => (
    <div
      class={`command-button${selectedCommand === command ? ' selected' : ''}`}
      onClick={() => onCommandSelect(command)}
    >
      {icon && (
        <SimpleSprite
          id={`/sprites/icons/buttons/${icon}.gif`}
          width={32}
          height={32}
          style={{ borderRadius: 6 }}
        />
      )}
      <span>{label}</span>
    </div>
  );

  return (
    <div class="command-bar">
      {/* Header */}
      <div class="command-header">
        {currentUnit ? (
          <>
            Current Unit: <strong>{currentUnit.name} ({currentUnit.element} Adept)</strong>
          </>
        ) : (
          'Waiting...'
        )}
      </div>

      {/* Command Buttons */}
      <div class="command-buttons">
        {renderCommandButton('attack', '[A] Attack', 'Attack')}
        {renderCommandButton('psynergy', '[S] Psynergy', 'Psynergy')}
        {renderCommandButton('djinn', '[D] Djinn', 'Djinni')}
        {renderCommandButton('abilities', '[F] Abilities', 'Summon')}
      </div>

      {/* Ability Panel */}
      <AbilityPanel
        coreAbilities={coreAbilities}
        djinnAbilities={djinnAbilities}
        onSelectAbility={onSelectAbility}
      />
    </div>
  );
}
