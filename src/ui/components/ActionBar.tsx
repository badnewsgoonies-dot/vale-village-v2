/**
 * Action bar component
 * Displays available abilities and handles action selection
 */

import { useEffect, useMemo, useState } from 'preact/hooks';
import type { Unit } from '../../core/models/Unit';
import type { Ability } from '../../data/schemas/AbilitySchema';
import { isUnitKO } from '../../core/models/Unit';
import { canAffordAction, getAbilityManaCost } from '../../core/algorithms/mana';
import { useStore } from '../state/store';

interface ActionBarProps {
  disabled?: boolean;
}

export function ActionBar({ disabled = false }: ActionBarProps) {
  const { battle, queueUnitAction, clearUnitAction, executeQueuedRound, lastError } = useStore((s) => ({
    battle: s.battle,
    queueUnitAction: s.queueUnitAction,
    clearUnitAction: s.clearUnitAction,
    executeQueuedRound: s.executeQueuedRound,
    lastError: s.lastError,
  }));

  const [selectedAbility, setSelectedAbility] = useState<string | null>(null);
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);

  const currentUnitIndex = battle?.currentQueueIndex ?? 0;
  const currentUnit: Unit | null =
    battle?.playerTeam.units?.[currentUnitIndex] ?? null;

  const abilityMap = useMemo(() => {
    const map = new Map<string, Ability>();
    if (currentUnit) {
      for (const ability of currentUnit.abilities) {
        map.set(ability.id, ability);
      }
    }
    return map;
  }, [currentUnit]);

  const selectedAbilityDef = selectedAbility ? abilityMap.get(selectedAbility) ?? null : null;
  const targetType = selectedAbilityDef?.targets ?? 'single-enemy';

  useEffect(() => {
    if (!battle || !currentUnit) return;

    if (targetType === 'self') {
      setSelectedTargets([currentUnit.id]);
      return;
    }

    if (targetType === 'all-allies') {
      setSelectedTargets(battle.playerTeam.units.filter((unit) => !isUnitKO(unit)).map((unit) => unit.id));
      return;
    }

    if (targetType === 'all-enemies') {
      setSelectedTargets(battle.enemies.filter((unit) => !isUnitKO(unit)).map((unit) => unit.id));
      return;
    }

    // For single-target or multi-target abilities, keep existing selections if still valid
    setSelectedTargets((prev) => prev.filter((targetId) => {
      const allUnits = [...battle.playerTeam.units, ...battle.enemies];
      return allUnits.some((unit) => unit.id === targetId && !isUnitKO(unit));
    }));
  }, [battle, currentUnit, targetType]);

  if (!battle || disabled) {
    return (
      <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px', marginTop: '1rem' }}>
        <p>Battle controls unavailable.</p>
      </div>
    );
  }

  if (!currentUnit) {
    return (
      <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px', marginTop: '1rem' }}>
        <p>No active unit available for action selection.</p>
      </div>
    );
  }

  const availableAbilities = useMemo(() => {
    if (!currentUnit) return [];
    return currentUnit.abilities.filter((ability) =>
      currentUnit.unlockedAbilityIds?.includes(ability.id)
    );
  }, [currentUnit]);

  const targetPool = useMemo(() => {
    if (!battle) return [];
    if (targetType === 'single-ally' || targetType === 'all-allies' || targetType === 'self') {
      return battle.playerTeam.units.filter((unit) => !isUnitKO(unit));
    }
    return battle.enemies.filter((unit) => !isUnitKO(unit));
  }, [battle, targetType]);

  const queuedAction = battle?.queuedActions?.[currentUnitIndex] ?? null;
  const refund = queuedAction?.unitId === currentUnit?.id ? queuedAction.manaCost : 0;
  const effectiveRemainingMana = (battle?.remainingMana ?? 0) + refund;

  const handleAbilitySelect = (abilityId: string | null) => {
    const ability = abilityId ? abilityMap.get(abilityId) : null;
    setSelectedAbility(abilityId);

    if (!ability) {
      setSelectedTargets([]);
      return;
    }

    if (ability.targets === 'self') {
      setSelectedTargets([currentUnit.id]);
      return;
    }

    if (ability.targets === 'all-allies') {
      setSelectedTargets(battle.playerTeam.units.filter((unit) => !isUnitKO(unit)).map((unit) => unit.id));
      return;
    }

    if (ability.targets === 'all-enemies') {
      setSelectedTargets(battle.enemies.filter((unit) => !isUnitKO(unit)).map((unit) => unit.id));
      return;
    }

    setSelectedTargets([]);
  };

  const handleTargetSelect = (targetId: string) => {
    const ability = selectedAbilityDef;
    const allowedTarget = targetPool.some((unit) => unit.id === targetId);
    if (!allowedTarget) return;

    const targetMode = ability?.targets ?? 'single-enemy';

    if (targetMode === 'self') {
      setSelectedTargets([currentUnit.id]);
      return;
    }

    if (targetMode === 'single-enemy' || targetMode === 'single-ally') {
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
    if (!battle || battle.phase !== 'planning') return;

    const ability = selectedAbility ? abilityMap.get(selectedAbility) : undefined;
    const abilityTargets = selectedAbilityDef?.targets ?? 'single-enemy';
    const requiresSelection = abilityTargets !== 'self' && abilityTargets !== 'all-allies' && abilityTargets !== 'all-enemies';

    if (requiresSelection && selectedTargets.length === 0) return;

    const queued = queueUnitAction(currentUnitIndex, selectedAbility ?? null, selectedTargets, ability);
    if (queued) {
      setSelectedAbility(null);
      setSelectedTargets([]);
    }
  };

  const handleEndTurn = () => {
    if (!battle || battle.phase !== 'planning') return;
    executeQueuedRound();
  };

  const requiresSelection = targetType !== 'self' && targetType !== 'all-allies' && targetType !== 'all-enemies';
  const targetSelectionMissing = requiresSelection && selectedTargets.length === 0;
  const queueComplete = battle?.queuedActions?.every((action) => action !== null) ?? false;

  return (
    <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px', marginTop: '1rem' }}>
      <h3 style={{ margin: '0 0 1rem 0' }}>Actions for {currentUnit.name}</h3>

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
            disabled={!canAffordAction(effectiveRemainingMana, getAbilityManaCost(ability.id, ability))}
          >
            {ability.name} ({ability.manaCost} MP)
          </button>
        ))}
      </div>

      <button
        onClick={() => handleAbilitySelect(null)}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: selectedAbility === null ? '#007bff' : '#fff',
          color: selectedAbility === null ? '#fff' : '#333',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '1rem',
        }}
      >
        Basic Attack (0 MP)
      </button>

      {(selectedAbility !== null || targetType !== 'self') && (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ margin: '0 0 0.5rem 0' }}>Select target:</p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {targetPool.map((unit) => (
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
          disabled={targetSelectionMissing || battle.phase !== 'planning'}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: !targetSelectionMissing && battle.phase === 'planning' ? 'pointer' : 'not-allowed',
            opacity: !targetSelectionMissing && battle.phase === 'planning' ? 1 : 0.5,
          }}
        >
          Execute
        </button>
        <button
          onClick={handleEndTurn}
          disabled={!queueComplete || battle.phase !== 'planning'}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6c757d',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: queueComplete && battle.phase === 'planning' ? 'pointer' : 'not-allowed',
            opacity: queueComplete && battle.phase === 'planning' ? 1 : 0.5,
          }}
        >
          End Turn
        </button>
        <button
          onClick={() => {
            clearUnitAction(currentUnitIndex);
            setSelectedAbility(null);
            setSelectedTargets([]);
          }}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#dc3545',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Clear Action
        </button>
      </div>

      <p style={{ marginTop: '1rem', fontSize: '0.9em', color: '#666' }}>
        Remaining Mana: {battle.remainingMana}
      </p>
      {queuedAction && (
        <p style={{ marginTop: '0.25rem', fontSize: '0.9em', color: '#333' }}>
          Queued: {queuedAction.abilityId ?? 'Basic attack'} → {queuedAction.targetIds.join(', ')}
        </p>
      )}
      {lastError && (
        <p style={{ marginTop: '0.5rem', fontSize: '0.9em', color: '#b30000' }}>
          {lastError}
        </p>
      )}
    </div>
  );
}
