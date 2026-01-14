// @ts-nocheck
import { useMemo, useState } from 'preact/hooks';
import type { BattleState } from '../../core/models/BattleState';
import type { Ability } from '../../data/schemas/AbilitySchema';
import type { Unit } from '../../core/models/Unit';
import { canAffordAction, getAbilityManaCost } from '../../core/algorithms/mana';
import { DJINN_ABILITIES } from '../../data/definitions/djinnAbilities';
import { getLockedDjinnAbilityMetadataForUnit } from '../../core/algorithms/djinnAbilities';
import { getSetDjinnIds } from '../../core/algorithms/djinn';
import { useStore } from '../state/store';
import { DJINN } from '../../data/definitions/djinn';
import { audio } from '../../core/services/AudioService';

const ACTION_ICONS: Record<string, string> = {
  attack: '/sprites/icons/buttons/Attack.gif',
  abilities: '/sprites/icons/buttons/Psynergy.gif',
  djinn: '/sprites/icons/buttons/Djinni.gif',
  summon: '/sprites/icons/buttons/Summon.gif',
  defend: '/sprites/icons/buttons/Defend.gif',
};

// Element star icons (fallback by element)
const ELEMENT_ICONS: Record<string, string> = {
  Venus: '/sprites/icons/misc/Venus_Star.gif',
  Mars: '/sprites/icons/misc/Mars_Star.gif',
  Mercury: '/sprites/icons/misc/Mercury_Star.gif',
  Jupiter: '/sprites/icons/misc/Jupiter_Star.gif',
  Neutral: '/sprites/icons/buttons/Attack.gif',
  neutral: '/sprites/icons/buttons/Psynergy.gif',
};

// Ability type icons (fallback by type)
const TYPE_ICONS: Record<string, string> = {
  physical: '/sprites/icons/buttons/Attack.gif',
  healing: '/sprites/icons/misc/Mercury_Star.gif',
  buff: '/sprites/icons/misc/Stat-Up.gif',
  debuff: '/sprites/icons/misc/Stat-Down.gif',
  summon: '/sprites/icons/buttons/Summon.gif',
  psynergy: '/sprites/icons/buttons/Psynergy.gif',
};

// Target type icons/labels
const TARGET_LABELS: Record<string, { icon: string; label: string }> = {
  'single-enemy': { icon: 'T', label: '1' },
  'all-enemies': { icon: 'A', label: 'ALL' },
  'single-ally': { icon: '+', label: '1' },
  'all-allies': { icon: '++', label: 'ALL' },
  self: { icon: '*', label: 'SELF' },
};

export type ActionMenuMode = 'root' | 'abilities' | 'summon';

interface BattleActionMenuProps {
  battle: BattleState;
  currentUnit: Unit | null;
  selectedAbilityId: string | null;
  mode: ActionMenuMode;
  onModeChange: (mode: ActionMenuMode) => void;
  onSelectAttack: () => void;
  onSelectAbility: (id: string | null, ability?: Ability) => void;
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div class="gs-label" style={{ marginBottom: 8, fontSize: '0.7rem' }}>
      {title}
    </div>
  );
}

function AbilityGrid({
  abilities,
  selectedAbilityId,
  battle,
  lockedAbilityIds,
  currentUnit,
  onSelect,
  onPreview,
}: {
  abilities: readonly Ability[];
  selectedAbilityId: string | null;
  battle: BattleState;
  lockedAbilityIds: readonly string[];
  currentUnit: Unit;
  onSelect: (id: string, ability: Ability) => void;
  onPreview?: (ability: Ability) => void;
}) {
  const currentQueuedAction = battle.queuedActions[battle.currentQueueIndex];
  const refundAmount = currentQueuedAction?.unitId === currentUnit.id
    ? currentQueuedAction.manaCost
    : 0;
  const effectiveRemainingMana = battle.remainingMana + refundAmount;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, maxHeight: 240, overflowY: 'auto', padding: '2px' }}>
      {abilities.map((ability) => {
        const manaCost = getAbilityManaCost(ability.id, ability);
        const canAfford = canAffordAction(effectiveRemainingMana, manaCost);
        const isLocked = lockedAbilityIds.includes(ability.id);
        const isSelected = selectedAbilityId === ability.id;
                const abilityType = (ability as any).type || 'psynergy';
                const element = (ability as any).element || 'Neutral';
                const iconSrc = ELEMENT_ICONS[element] || TYPE_ICONS[abilityType] || ACTION_ICONS.abilities;
                const borderColors: Record<string, string> = { Venus: '#FFC107', Mars: '#F44336', Mercury: '#2196F3', Jupiter: '#9C27B0', Neutral: 'transparent' };
                const borderColor = borderColors[element] || 'transparent';

                return (
                  <div
                    key={ability.id}
                    className={`gs-list-item ${isSelected ? 'selected' : ''} ${!canAfford || isLocked ? 'disabled' : ''}`}
                    onClick={() => {
                      if (canAfford && !isLocked) {
                        audio.playSFX('menu_select');
                        onSelect(ability.id, ability);
                      }
                    }}
                    onMouseEnter={() => onPreview?.(ability)}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px', opacity: isLocked ? 0.5 : 1 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, width: '100%' }}>
                      <img
                        src={iconSrc}
                        alt=""
                        width={14}
                        height={14}
                        style={{ imageRendering: 'pixelated', border: `2px solid ${borderColor}`, borderRadius: 2 }}
                      />
                      <span class="gs-value" style={{ fontSize: '0.75rem', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ability.name}
                      </span>
                      <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>{manaCost}</span>
                    </div>
                    <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>{abilityType}</div>
                  </div>
                );
              })}
            </div>
          );
        }

export function BattleActionMenu({
  battle,
  currentUnit,
  selectedAbilityId,
  mode,
  onModeChange,
  onSelectAbility,
}: BattleActionMenuProps) {
  const queueDjinnActivation = useStore((s) => s.queueDjinnActivation);
  const setSummonScreenOpen = useStore((s) => s.setSummonScreenOpen);
  const [selectedDjinnIds, setSelectedDjinnIds] = useState<string[]>([]);
  const [previewAbility, setPreviewAbility] = useState<Ability | null>(null);

  const lockedAbilityIds = useMemo(
    () => currentUnit ? getLockedDjinnAbilityMetadataForUnit(currentUnit, battle.playerTeam).map((m) => m.abilityId) : [],
    [currentUnit, battle.playerTeam]
  );
  const setDjinnIds = useMemo(() => getSetDjinnIds(battle.playerTeam), [battle.playerTeam]);

  if (!currentUnit) return null;

  const unlocked = currentUnit.abilities.filter((a) => currentUnit.unlockedAbilityIds.includes(a.id));
  const djinnAbilities = unlocked.filter((a) => DJINN_ABILITIES[a.id]);
  const regularAbilities = unlocked.filter((a) => !DJINN_ABILITIES[a.id]);

  if (mode === 'abilities') {
    const allAbilities = [...regularAbilities, ...djinnAbilities];
    const order = ['Venus', 'Mars', 'Mercury', 'Jupiter', 'Neutral'];
    const groups = order
      .map((el) => ({ element: el, abilities: allAbilities.filter((a) => ((a as any).element || 'Neutral') === el) }))
      .filter((g) => g.abilities.length > 0);

    return (
      <div class="gs-window gs-window--layered" role="dialog" aria-modal="true" aria-label="Battle Actions - Abilities" data-testid="battle-action-menu-abilities" tabIndex={-1} style={{ width: 360, padding: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <SectionHeader title="PSYNERGY" />
          <button class="gs-button" data-testid="battle-back-btn" onClick={() => onModeChange('root')} style={{ padding: '2px 8px', fontSize: '0.7rem' }}>BACK</button>
        </div>
        
        {previewAbility && (
          <div class="gs-window gs-window--layered" style={{ background: 'rgba(0,0,0,0.2)', marginBottom: 10, padding: 8, fontSize: '0.75rem' }}>
            <div class="gs-value">{previewAbility.name}</div>
            <div style={{ marginTop: 4, opacity: 0.8 }}>{previewAbility.description}</div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {groups.map((g) => (
            <div key={g.element} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <img src={ELEMENT_ICONS[g.element] || ACTION_ICONS.abilities} width={16} height={16} alt={g.element} style={{ imageRendering: 'pixelated' }} />
                <div class="gs-label" style={{ fontSize: '0.75rem' }}>{g.element.toUpperCase()}</div>
              </div>
              <AbilityGrid
                abilities={g.abilities}
                selectedAbilityId={selectedAbilityId}
                battle={battle}
                lockedAbilityIds={lockedAbilityIds}
                currentUnit={currentUnit}
                onSelect={onSelectAbility}
                onPreview={setPreviewAbility}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (mode === 'summon') {
    return (
      <div class="gs-window gs-window--layered" role="dialog" aria-modal="true" aria-label="Battle Actions - Summon" data-testid="battle-action-menu-summon" tabIndex={-1} style={{ width: 300, padding: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <SectionHeader title="SUMMON" />
          <button class="gs-button" data-testid="battle-back-btn" onClick={() => onModeChange('root')} style={{ padding: '2px 8px', fontSize: '0.7rem' }}>BACK</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {setDjinnIds.map(id => {
            const djinn = DJINN[id];
            const isSelected = selectedDjinnIds.includes(id);
            return (
              <button 
                key={id} 
                class={`gs-button ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedDjinnIds(prev => isSelected ? prev.filter(d => d !== id) : [...prev, id].slice(0, 3))}
              >
                <img src={`/sprites/icons/misc/${djinn.element}_Star.gif`} width={16} height={16} />
                <span style={{ flex: 1 }}>{djinn.name}</span>
              </button>
            );
          })}
          <button 
            class={`gs-button ${selectedDjinnIds.length > 0 ? 'selected' : 'disabled'}`}
            disabled={selectedDjinnIds.length === 0}
            onClick={() => {
              selectedDjinnIds.forEach(id => queueDjinnActivation(id));
              setSummonScreenOpen(false);
              onModeChange('root');
            }}
            style={{ justifyContent: 'center', marginTop: 8 }}
          >
            SUMMON ({selectedDjinnIds.length})
          </button>
        </div>
      </div>
    );
  }

  return (
    <div class="gs-window gs-window--layered" role="dialog" aria-modal="true" aria-label="Battle Actions" data-testid="battle-action-menu" tabIndex={-1} style={{ width: 180, padding: 12 }}>
      <SectionHeader title="ACTIONS" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button class="gs-button" data-testid="action-psynergy" onClick={() => onModeChange('abilities')}>
          <img src={ACTION_ICONS.abilities} width={20} height={20} alt="Psynergy" />
          <span>PSYNERGY</span>
        </button>
        <button class={`gs-button ${setDjinnIds.length > 0 ? '' : 'disabled'}`} data-testid="action-summon" onClick={() => onModeChange('summon')} disabled={setDjinnIds.length === 0} aria-disabled={setDjinnIds.length === 0}>
          <img src={ACTION_ICONS.summon} width={20} height={20} alt="Summon" />
          <span>SUMMON</span>
        </button>
      </div>
    </div>
  );
}
