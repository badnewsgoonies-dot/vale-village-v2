/**
 * DjinnDetailModal Component
 * Shows detailed Djinn information and assignment UI
 */

import { JSX } from 'preact';
import { useStore } from '../state/store';
import { DJINN } from '@/data/definitions/djinn';
import { calculateDjinnSynergy } from '@/core/algorithms/djinn';
import { SimpleSprite } from '../sprites/SimpleSprite';
import { warnIfPlaceholderSprite } from '../sprites/utils/warnIfPlaceholderSprite';
import './DjinnDetailModal.css';

interface DjinnDetailModalProps {
  djinnId: string;
  onClose: () => void;
}

export function DjinnDetailModal({ djinnId, onClose }: DjinnDetailModalProps): JSX.Element | null {
  const { team, updateTeam } = useStore((s) => ({
    team: s.team,
    updateTeam: s.updateTeam,
  }));

  const djinn = DJINN[djinnId];
  if (!djinn || !team) {
    return null;
  }

  const isCollected = team.collectedDjinn.includes(djinnId);
  const isEquipped = team.equippedDjinn.includes(djinnId);
  const equippedIndex = team.equippedDjinn.indexOf(djinnId);
  const tracker = team.djinnTrackers[djinnId];
  const state = tracker?.state || 'Set';

  const handleEquip = (slotIndex: number) => {
    if (!team) return;

    // Create new equippedDjinn array (max 3 slots)
    const newEquippedDjinn: string[] = [];

    // Copy existing equipped Djinn, skipping the one being moved
    team.equippedDjinn.forEach((id, idx) => {
      if (id !== djinnId && idx !== slotIndex) {
        newEquippedDjinn.push(id);
      }
    });

    // Add to target slot (will be inserted at correct position)
    // Ensure we have exactly 3 slots
    while (newEquippedDjinn.length < slotIndex) {
      newEquippedDjinn.push('');
    }
    newEquippedDjinn[slotIndex] = djinnId;

    // Filter out empty strings and ensure max 3
    const filteredDjinn = newEquippedDjinn.filter(Boolean).slice(0, 3);

    // Update trackers
    const newTrackers = { ...team.djinnTrackers };
    if (!newTrackers[djinnId]) {
      newTrackers[djinnId] = {
        djinnId,
        state: 'Set',
        lastActivatedTurn: 0,
      };
    }

    // Remove tracker for Djinn that was in the target slot (if different)
    if (isEquipped && equippedIndex !== slotIndex) {
      const oldDjinnId = team.equippedDjinn[slotIndex];
      if (oldDjinnId && oldDjinnId !== djinnId) {
        delete newTrackers[oldDjinnId];
      }
    }

    updateTeam({
      equippedDjinn: filteredDjinn,
      djinnTrackers: newTrackers,
    });
  };

  const handleUnequip = () => {
    if (!team || !isEquipped) return;

    const newEquippedDjinn = team.equippedDjinn.filter((id) => id !== djinnId);

    const newTrackers = { ...team.djinnTrackers };
    delete newTrackers[djinnId];

    updateTeam({
      equippedDjinn: newEquippedDjinn,
      djinnTrackers: newTrackers,
    });
  };

  // Calculate synergy preview
  const previewEquipped = [...team.equippedDjinn];
  if (!isEquipped) {
    // Preview with this Djinn in slot 0
    previewEquipped[0] = djinnId;
  }
  const previewDjinn = previewEquipped
    .filter(Boolean)
    .map((id) => DJINN[id])
    .filter((d): d is NonNullable<typeof d> => d !== null && d !== undefined);
  const synergy = calculateDjinnSynergy(previewDjinn.map((d) => d.element));

  const getElementColor = (element: string): string => {
    switch (element) {
      case 'Venus': return '#8B4513';
      case 'Mars': return '#DC143C';
      case 'Mercury': return '#1E90FF';
      case 'Jupiter': return '#32CD32';
      default: return '#666';
    }
  };

  const getDjinnSprite = (element: string): string => {
    const elementLower = element.toLowerCase();
    return `${elementLower}-djinn-front`;
  };

  return (
    <div class="djinn-detail-overlay" onClick={onClose}>
      <div class="djinn-detail-container" onClick={(e) => e.stopPropagation()}>
        <div class="djinn-detail-header">
          <h2>{djinn.name}</h2>
          <button class="close-btn" onClick={onClose} aria-label="Close Djinn details">
            ×
          </button>
        </div>

        <div class="djinn-detail-content">
          <div class="djinn-main-info">
            <div
              class="djinn-icon-large"
              style={{ backgroundColor: getElementColor(djinn.element) + '40' }}
            >
              {(() => {
                const djinnSpriteId = getDjinnSprite(djinn.element);
                warnIfPlaceholderSprite('DjinnDetailModal', djinnSpriteId);
                return (
                  <SimpleSprite
                    id={djinnSpriteId}
                    width={64}
                    height={64}
                    style={{ display: 'block' }}
                  />
                );
              })()}
            </div>
            <div class="djinn-details">
              <div class="detail-row">
                <span class="detail-label">Element:</span>
                <span class="detail-value" style={{ color: getElementColor(djinn.element) }}>
                  {djinn.element}
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Tier:</span>
                <span class="detail-value">Tier {djinn.tier}</span>
              </div>
              {isEquipped && (
                <div class="detail-row">
                  <span class="detail-label">Status:</span>
                  <span class="detail-value">{state}</span>
                </div>
              )}
            </div>
          </div>

          <div class="djinn-detail-note" style={{ fontSize: '0.85rem', color: '#ccc', margin: '0.5rem 0', padding: '0 0.25rem' }}>
            Djinn live in the shared 3-slot team pool. Updates here affect that pool, and the Pre-Battle screen lets you
            choose which of the equipped Djinn apply to the next encounter.
          </div>

          <div class="djinn-summon-effect">
            <h3>Summon Effect</h3>
            <p>{djinn.summonEffect.description}</p>
          </div>

          {isCollected && (
            <div class="djinn-assignment">
              <h3>Global Team Slots</h3>
              <div class="slot-buttons">
                {[0, 1, 2].map((slotIndex) => {
                  const slotDjinnId = team.equippedDjinn[slotIndex];
                  const slotDjinn = slotDjinnId ? DJINN[slotDjinnId] : null;
                  const isSlotEquipped = slotDjinnId === djinnId;

                  return (
                    <button
                      key={slotIndex}
                      class={`slot-btn ${isSlotEquipped ? 'active' : ''} ${slotDjinn && !isSlotEquipped ? 'occupied' : ''}`}
                      onClick={() => handleEquip(slotIndex)}
                      disabled={!isCollected}
                    >
                      <div class="slot-number">Slot {slotIndex + 1}</div>
                      {slotDjinn ? (
                        <div class="slot-djinn-name">{slotDjinn.name}</div>
                      ) : (
                        <div class="slot-empty">Empty</div>
                      )}
                    </button>
                  );
                })}
              </div>
              {isEquipped && (
                <button class="unequip-btn" onClick={handleUnequip}>
                  Unequip
                </button>
              )}
            </div>
          )}

          {previewDjinn.length > 0 && (
            <div class="djinn-synergy-preview">
              <h3>Synergy Preview</h3>
              <div class="synergy-info">
                <div class="synergy-row">
                  <span>Class:</span>
                  <span class="synergy-value">{synergy.classChange}</span>
                </div>
                <div class="synergy-row">
                  <span>ATK Bonus:</span>
                  <span class="synergy-value">+{synergy.atk}</span>
                </div>
                <div class="synergy-row">
                  <span>DEF Bonus:</span>
                  <span class="synergy-value">+{synergy.def}</span>
                </div>
                {synergy.spd !== undefined && (
                  <div class="synergy-row">
                    <span>SPD Bonus:</span>
                    <span class="synergy-value">+{synergy.spd}</span>
                  </div>
                )}
                {synergy.abilitiesUnlocked.length > 0 && (
                  <div class="synergy-row">
                    <span>Abilities:</span>
                    <span class="synergy-value">{synergy.abilitiesUnlocked.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
