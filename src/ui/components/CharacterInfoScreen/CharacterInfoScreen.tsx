/**
 * CharacterInfoScreen Component
 * Detailed character view: portrait, stats, equipment, abilities
 * Golden Sun-inspired two-column layout
 */

import { useEffect, useMemo } from 'preact/hooks';
import type { Unit } from '@/core/models/Unit';
import type { EquipmentLoadout } from '@/core/models/Equipment';
import { calculateEquipmentBonuses } from '@/core/models/Equipment';
import { calculateMaxHp } from '@/core/models/Unit';
import { getXpProgress, getXpForLevel } from '@/core/algorithms/xp';
import { SimpleSprite } from '../../sprites/SimpleSprite';
import { getPortraitSprite } from '../../sprites/mappings';
import { EquipmentIcon } from '../EquipmentIcon';
import './CharacterInfoScreen.css';

interface CharacterInfoScreenProps {
  unit: Unit;
  equipment: EquipmentLoadout;
  onClose: () => void;
  onEquipmentClick?: (slot: string) => void;
}

const ELEMENT_COLORS: Record<string, string> = {
  Venus: '#E8A050',
  Mars: '#FF6B6B',
  Mercury: '#4A9BFF',
  Jupiter: '#9B59B6',
};

const ELEMENT_ICONS: Record<string, string> = {
  Venus: '🌍',
  Mars: '🔥',
  Mercury: '💧',
  Jupiter: '💨',
};

const EQUIPMENT_SLOTS = ['weapon', 'armor', 'helm', 'boots', 'accessory'] as const;

export function CharacterInfoScreen({ unit, equipment, onClose, onEquipmentClick }: CharacterInfoScreenProps) {
  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Calculate XP progress
  const xpInfo = getXpProgress(unit.xp);
  const nextLevelXp = getXpForLevel(unit.level + 1);
  const xpProgress = xpInfo.progress * 100;
  const xpToNext = xpInfo.needed - xpInfo.current;

  // Calculate total stats with equipment
  const equipmentBonuses = useMemo(() => calculateEquipmentBonuses(equipment), [equipment]);
  const maxHp = calculateMaxHp(unit);

  const totalStats = {
    hp: maxHp,
    atk: unit.baseStats.atk + (equipmentBonuses.atk ?? 0),
    def: unit.baseStats.def + (equipmentBonuses.def ?? 0),
    mag: unit.baseStats.mag + (equipmentBonuses.mag ?? 0),
    spd: unit.baseStats.spd + (equipmentBonuses.spd ?? 0),
  };

  const elementColor = ELEMENT_COLORS[unit.element] ?? '#888';
  const elementIcon = ELEMENT_ICONS[unit.element] ?? '?';

  return (
    <div class="character-info-overlay" onClick={onClose}>
      <div class="character-info-screen" onClick={(e) => e.stopPropagation()}>
        {/* Left Column: Portrait & Stats */}
        <div class="character-left-column">
          {/* Portrait Panel */}
          <div class="character-portrait-panel">
            <div
              class="character-element-badge"
              style={{ backgroundColor: elementColor }}
            >
              {elementIcon}
            </div>
            <div class="character-sprite-container">
              <SimpleSprite id={getPortraitSprite(unit.id)} width={64} height={64} />
            </div>
            <h2 class="character-name">{unit.name}</h2>
            <div class="character-class">{unit.role}</div>
            <div class="character-level">Level {unit.level}</div>

            {/* XP Bar */}
            <div class="character-xp-container">
              <div class="character-xp-label">
                <span>EXP</span>
                <span>{unit.xp.toLocaleString()} / {nextLevelXp.toLocaleString()}</span>
              </div>
              <div class="character-xp-bar">
                <div
                  class="character-xp-fill"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
              <div class="character-xp-next">
                {xpToNext > 0 ? `${xpToNext.toLocaleString()} to next level` : 'Max Level'}
              </div>
            </div>
          </div>

          {/* Stats Panel */}
          <div class="character-stats-panel">
            <h3 class="character-panel-title">STATS</h3>
            <div class="character-stats-grid">
              <div class="character-stat-item">
                <span class="character-stat-label">HP</span>
                <span class="character-stat-value hp">{unit.currentHp}/{totalStats.hp}</span>
              </div>
              <div class="character-stat-item">
                <span class="character-stat-label">ATK</span>
                <span class="character-stat-value">
                  {totalStats.atk}
                  {equipmentBonuses.atk ? <span class="stat-bonus">+{equipmentBonuses.atk}</span> : null}
                </span>
              </div>
              <div class="character-stat-item">
                <span class="character-stat-label">DEF</span>
                <span class="character-stat-value">
                  {totalStats.def}
                  {equipmentBonuses.def ? <span class="stat-bonus">+{equipmentBonuses.def}</span> : null}
                </span>
              </div>
              <div class="character-stat-item">
                <span class="character-stat-label">MAG</span>
                <span class="character-stat-value">
                  {totalStats.mag}
                  {equipmentBonuses.mag ? <span class="stat-bonus">+{equipmentBonuses.mag}</span> : null}
                </span>
              </div>
              <div class="character-stat-item">
                <span class="character-stat-label">SPD</span>
                <span class="character-stat-value">
                  {totalStats.spd}
                  {equipmentBonuses.spd ? <span class="stat-bonus">+{equipmentBonuses.spd}</span> : null}
                </span>
              </div>
              <div class="character-stat-item">
                <span class="character-stat-label">Element</span>
                <span class="character-stat-value" style={{ color: elementColor }}>
                  {unit.element}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Equipment & Abilities */}
        <div class="character-right-column">
          {/* Equipment Panel */}
          <div class="character-equipment-panel">
            <h3 class="character-panel-title">EQUIPMENT</h3>
            <div class="character-equipment-grid">
              {EQUIPMENT_SLOTS.map((slot) => {
                const item = equipment[slot];
                return (
                  <div
                    key={slot}
                    class={`character-equipment-slot ${item ? 'equipped' : 'empty'}`}
                    onClick={() => onEquipmentClick?.(slot)}
                  >
                    {item ? (
                      <>
                        <EquipmentIcon equipment={item} size="small" />
                        <div class="character-equipment-info">
                          <span class="character-equipment-label">{slot}</span>
                          <span class="character-equipment-name">{item.name}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div class="character-equipment-empty-icon" />
                        <div class="character-equipment-info">
                          <span class="character-equipment-label">{slot}</span>
                          <span class="character-equipment-name empty">[None]</span>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Abilities Panel */}
          <div class="character-abilities-panel">
            <h3 class="character-panel-title">ABILITIES</h3>
            <div class="character-abilities-grid">
              {unit.abilities.length === 0 ? (
                <div class="character-no-abilities">No abilities learned yet</div>
              ) : (
                unit.abilities.map((ability, idx) => (
                  <div key={idx} class="character-ability-item">
                    <div class="character-ability-icon">{ability.element === 'Venus' ? '🌍' : ability.element === 'Mars' ? '🔥' : ability.element === 'Mercury' ? '💧' : '💨'}</div>
                    <div class="character-ability-info">
                      <span class="character-ability-name">{ability.name}</span>
                      <span class="character-ability-cost">{ability.manaCost} Mana</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Close Button */}
          <button class="character-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
