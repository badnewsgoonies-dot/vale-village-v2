/**
 * PartyManagementScreen Component
 * Now a Unit Compendium - shows all recruited units and their details
 */

import { JSX } from 'preact';
import { useState } from 'preact/hooks';
import { useStore } from '../state/store';
import { calculateEffectiveStats } from '@/core/algorithms/stats';
import { SimpleSprite } from '../sprites/SimpleSprite';
import { warnIfPlaceholderSprite } from '../sprites/utils/warnIfPlaceholderSprite';
import { getPortraitSprite, getAbilityIconSprite } from '../sprites/mappings';
import './PartyManagementScreen.css';

interface PartyManagementScreenProps {
  onClose: () => void;
}

export function PartyManagementScreen({ onClose }: PartyManagementScreenProps): JSX.Element {
  const { team, roster } = useStore((s) => ({
    team: s.team,
    roster: s.roster,
  }));

  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  if (!team) {
    return (
      <div class="party-management-overlay" onClick={onClose}>
        <div class="party-management-container" onClick={(e) => e.stopPropagation()}>
          <div class="party-error">No team data available</div>
          <button class="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const activeUnitIds = new Set(team.units.map((u) => u.id));
  const selectedUnit = roster.find((u) => u.id === selectedUnitId);
  const selectedStats = selectedUnit ? calculateEffectiveStats(selectedUnit, team) : null;

  return (
    <div class="party-management-overlay" onClick={onClose}>
      <div class="party-management-container" onClick={(e) => e.stopPropagation()}>
        <div class="party-management-header">
          <h1>Unit Compendium</h1>
          <button class="close-btn" onClick={onClose} aria-label="Close compendium">
            ×
          </button>
        </div>

        <div class="party-instructions">
          <p>
            Browse your full roster and review each unit&apos;s stats. The battle formation and loadouts you see here
            are only a snapshot—final selections happen on the Pre-Battle screen before each fight.
          </p>
        </div>

        <div class="party-content">
          {/* Unit List */}
          <div class="party-section">
            <h2>Roster ({roster.length})</h2>
            <div class="party-grid">
              {roster.map((unit) => {
                const isActive = activeUnitIds.has(unit.id);
                const isSelected = selectedUnitId === unit.id;

                return (
                  <div
                    key={unit.id}
                    class={`party-member-card ${isSelected ? 'selected' : ''} ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedUnitId(unit.id)}
                  >
                    <div class="member-icon">
                      {(() => {
                        const portraitId = getPortraitSprite(unit.id);
                        warnIfPlaceholderSprite('PartyManagementScreen', portraitId);
                        return (
                          <SimpleSprite
                            id={portraitId}
                            width={64}
                            height={64}
                            style={{ borderRadius: '8px' }}
                          />
                        );
                      })()}
                    </div>
                    <div class="member-info">
                      <div class="member-name">{unit.name}</div>
                      <div class="member-stats">Lv: {unit.level}</div>
                      <div class="member-element">{unit.element}</div>
                      <div class="member-role">{unit.role}</div>
                      {isActive && <div class="active-badge">Roster Slot</div>}
                    </div>
                    {isSelected && (
                      <div class="selection-indicator">Selected</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unit Details */}
          {selectedUnit && selectedStats && (
            <div class="party-section unit-details">
              <h2>{selectedUnit.name}</h2>
              <div class="detail-grid">
                <div class="detail-row">
                  <span class="detail-label">Level:</span>
                  <span class="detail-value">{selectedUnit.level}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Element:</span>
                  <span class="detail-value">{selectedUnit.element}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Role:</span>
                  <span class="detail-value">{selectedUnit.role}</span>
                </div>
                <div class="detail-divider" />
                <div class="detail-row">
                  <span class="detail-label">HP:</span>
                  <span class="detail-value">{selectedUnit.currentHp} / {selectedStats.hp}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">ATK:</span>
                  <span class="detail-value">{selectedStats.atk}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">DEF:</span>
                  <span class="detail-value">{selectedStats.def}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">MAG:</span>
                  <span class="detail-value">{selectedStats.mag}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">SPD:</span>
                  <span class="detail-value">{selectedStats.spd}</span>
                </div>
                <div class="detail-divider" />
                <div class="detail-section">
                  <h3>Abilities ({selectedUnit.abilities.length})</h3>
                  <div class="ability-list">
                    {selectedUnit.abilities.map((ability) => (
                      <div key={ability.id} class="ability-item">
                        {(() => {
                          const iconId = getAbilityIconSprite(ability.id);
                          warnIfPlaceholderSprite('PartyManagementScreen', iconId);
                          return (
                            <SimpleSprite
                              id={iconId}
                              width={24}
                              height={24}
                              style={{ marginRight: '8px', borderRadius: '4px' }}
                            />
                          );
                        })()}
                        <span class="ability-name">{ability.name}</span>
                        {ability.manaCost > 0 && (
                          <span class="ability-cost">[{ability.manaCost}]</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
