/**
 * Action bar component
 * Displays available abilities and handles action selection
 */

import { useState } from 'preact/hooks';

interface ActionBarProps {
  disabled?: boolean;
}

// Placeholder types until we port the full battle system
interface Ability {
  id: string;
  name: string;
  manaCost: number;
  targets: 'single-enemy' | 'single-ally' | 'all-enemies' | 'all-allies' | 'self';
}

interface Unit {
  id: string;
  name: string;
  abilities: Ability[];
  unlockedAbilityIds: string[];
}

interface BattleState {
  playerTeam: {
    units: Unit[];
  };
  enemies: Unit[];
  turnOrder: string[];
  currentActorIndex: number;
  remainingMana: number;
}

// Placeholder store hook - will be replaced when we port state management
function useStore<T>(selector: (state: { battle: BattleState | null }) => T): T {
  const mockState = { battle: null };
  return selector(mockState);
}

const isDev = import.meta.env?.DEV ?? false;

export function ActionBar({ disabled = false }: ActionBarProps) {
  const battle = useStore((s) => s.battle);

  const [selectedAbility, setSelectedAbility] = useState<string | null>(null);
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);

  if (!battle || disabled) {
    return (
      <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px', marginTop: '1rem' }}>
        <p>Battle ended. Controls disabled.</p>
      </div>
    );
  }

  const allUnits = [...battle.playerTeam.units, ...battle.enemies];
  const currentActorId = battle.turnOrder[battle.currentActorIndex];
  const currentActor = allUnits.find(u => u.id === currentActorId);

  if (!currentActor) return null;

  const isPlayerUnit = battle.playerTeam.units.some(u => u.id === currentActorId);
  if (!isPlayerUnit) {
    return (
      <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px', marginTop: '1rem' }}>
        <p>Enemy turn: {currentActor.name}</p>
        <p style={{ fontSize: '0.9em', color: '#666' }}>AI is deciding...</p>
      </div>
    );
  }

  const remainingMana = battle.remainingMana;
  const availableAbilities = currentActor.abilities.filter(
    (ability) =>
      currentActor.unlockedAbilityIds.includes(ability.id) &&
      remainingMana >= ability.manaCost
  );

  const handleAbilitySelect = (abilityId: string) => {
    setSelectedAbility(abilityId);
    setSelectedTargets([]);
  };

  const handleTargetSelect = (targetId: string) => {
    if (!selectedAbility) return;
    const ability = currentActor.abilities.find(a => a.id === selectedAbility);
    if (!ability) return;

    if (ability.targets === 'single-enemy' || ability.targets === 'single-ally') {
      setSelectedTargets([targetId]);
    } else {
      if (selectedTargets.includes(targetId)) {
        setSelectedTargets(selectedTargets.filter(id => id !== targetId));
      } else {
        setSelectedTargets([...selectedTargets, targetId]);
      }
    }
  };

  const handleExecute = () => {
    if (!selectedAbility || selectedTargets.length === 0 || !currentActorId) return;
    if (isDev) {
      console.log('Execute:', { actor: currentActorId, ability: selectedAbility, targets: selectedTargets });
    }
    setSelectedAbility(null);
    setSelectedTargets([]);
  };

  const handleEndTurn = () => {
    if (isDev) {
      console.log('End turn');
    }
  };

  return (
    <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px', marginTop: '1rem' }}>
      <h3 style={{ margin: '0 0 1rem 0' }}>Actions for {currentActor.name}</h3>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {availableAbilities.map((ability) => (
          <button
            key={ability.id}
            onClick={() => handleAbilitySelect(ability.id)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: selectedAbility === ability.id ? '#007bff' : '#fff',
              color: selectedAbility === ability.id ? '#fff' : '#333',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {ability.name} ({ability.manaCost} MP)
          </button>
        ))}
      </div>

      {selectedAbility && (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ margin: '0 0 0.5rem 0' }}>Select target:</p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {allUnits.map((unit) => (
              <button
                key={unit.id}
                onClick={() => handleTargetSelect(unit.id)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: selectedTargets.includes(unit.id) ? '#28a745' : '#fff',
                  color: selectedTargets.includes(unit.id) ? '#fff' : '#333',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {unit.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={handleExecute}
          disabled={!selectedAbility || selectedTargets.length === 0}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: selectedAbility && selectedTargets.length > 0 ? 'pointer' : 'not-allowed',
            opacity: selectedAbility && selectedTargets.length > 0 ? 1 : 0.5,
          }}
        >
          Execute
        </button>
        <button
          onClick={handleEndTurn}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6c757d',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          End Turn
        </button>
      </div>

      <p style={{ marginTop: '1rem', fontSize: '0.9em', color: '#666' }}>
        Remaining Mana: {remainingMana}
      </p>
    </div>
  );
}
