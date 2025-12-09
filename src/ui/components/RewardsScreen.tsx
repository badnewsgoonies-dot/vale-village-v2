/**
 * RewardsScreen Component
 * Displays post-battle rewards: XP, gold, equipment, level-ups
 *
 * Enhanced with Golden Sun-inspired victory presentation:
 * - Animated victory banner with golden glow
 * - Bouncing party member sprites
 * - Falling sparkle effects
 * - Earthy color palette
 */

import { JSX } from 'preact';
import { useEffect, useMemo } from 'preact/hooks';
import type { RewardDistribution } from '../../core/models/Rewards';
import type { Team } from '../../core/models/Team';
import type { Equipment } from '../../data/schemas/EquipmentSchema';
import { BattleUnitSprite } from './BattleUnitSprite';
import { SimpleSprite } from '../sprites/SimpleSprite';
import { getPortraitSprite } from '../sprites/mappings';
import { EquipmentIcon } from './EquipmentIcon';
import { EquipmentChoicePicker } from './EquipmentChoicePicker';
import './RewardsScreen.css';
import { DJINN } from '../../data/definitions/djinn';

/** Sparkle effect component for victory celebration */
function VictorySparkles(): JSX.Element {
  return (
    <div class="victory-sparkles" aria-hidden="true">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          class="sparkle"
          style={{ '--delay': `${i * 0.25}s`, '--left': `${5 + i * 8}%` } satisfies JSX.CSSProperties}
        />
      ))}
    </div>
  );
}

interface RewardsScreenProps {
  rewards: RewardDistribution;
  team: Team;
  onContinue: () => void;
  onSelectEquipment: (equipment: Equipment) => void;
}

export function RewardsScreen({ rewards, team, onContinue, onSelectEquipment }: RewardsScreenProps): JSX.Element {
  // Get surviving party members for the victory display
  const partyMembers = useMemo(() => {
    return team.units.filter(u => u.currentHp > 0).slice(0, 4);
  }, [team.units]);

  // Look up units for level-ups
  const levelUpUnits = rewards.levelUps
    .map(levelUp => {
      const unit = team.units.find(u => u.id === levelUp.unitId);
      if (!unit) {
        if (import.meta.env.DEV) {
          // TODO: Add proper error logging for missing unit
          // console.warn(`Unit not found for level-up: ${levelUp.unitId}`);
        }
        return null;
      }
      return {
        unit,
        oldLevel: levelUp.oldLevel,
        newLevel: levelUp.newLevel,
        statGains: levelUp.statGains,
        unlockedAbilities: levelUp.newAbilitiesUnlocked,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const hasPendingChoice = rewards.equipmentChoice && !rewards.choiceSelected;
  const obtainedEquipment = rewards.choiceSelected
    ? [rewards.choiceSelected]
    : rewards.fixedEquipment
      ? [rewards.fixedEquipment]
      : [];
  const latestDjinnId = team.collectedDjinn[team.collectedDjinn.length - 1];
  const latestDjinn = latestDjinnId ? DJINN[latestDjinnId] : null;

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle equipment choice selection (1-9)
      if (hasPendingChoice && rewards.equipmentChoice) {
        const num = parseInt(event.key, 10);
        if (!Number.isNaN(num) && num >= 1 && num <= rewards.equipmentChoice.length) {
          event.preventDefault();
          event.stopPropagation();
          const selected = rewards.equipmentChoice[num - 1];
          if (selected) {
            onSelectEquipment(selected);
          }
          return;
        }
      }

      // Handle continue (Enter/Space)
      if (!hasPendingChoice || rewards.choiceSelected) {
        if (event.key === 'Enter' || event.key === ' ' || event.code === 'Enter' || event.code === 'Space') {
          event.preventDefault();
          event.stopPropagation();
          onContinue();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true); // Use capture phase
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [hasPendingChoice, rewards.equipmentChoice, rewards.choiceSelected, onContinue, onSelectEquipment]);

  return (
    <div class="rewards-screen rewards-screen--golden-sun">
      {/* Sparkle effects overlay */}
      <VictorySparkles />

      <div class="rewards-container">
        {/* Victory Banner */}
        <div class="victory-banner" role="banner">
          <h1>VICTORY!</h1>
          <div class="victory-sub">All enemies defeated!</div>
        </div>

        {/* Party Display - Bouncing sprites */}
        <div class="party-display" aria-label="Victorious party members">
          {partyMembers.map((unit, index) => (
            <div
              key={unit.id}
              class="party-member"
              style={{ '--index': index } satisfies JSX.CSSProperties}
            >
              <div class="party-sprite">
                <SimpleSprite
                  id={getPortraitSprite(unit.id)}
                  width={64}
                  height={64}
                />
              </div>
              <div class="party-name">{unit.name}</div>
            </div>
          ))}
        </div>

        {/* Rewards Grid (XP + Money) */}
        <div class="rewards-grid">
          {/* XP Gained */}
          <div class="reward-card" role="article" aria-label={`${rewards.rewards.totalXp} experience points gained`}>
            <div class="reward-icon" aria-hidden="true">XP</div>
            <div class="reward-details">
              <div class="reward-label">Experience</div>
              <div class="reward-value highlight">+{rewards.rewards.totalXp} XP</div>
              {rewards.rewards.survivorCount > 0 && (
                <div class="reward-subtext">Split among {rewards.rewards.survivorCount} survivors</div>
              )}
            </div>
          </div>

          {/* Money Gained */}
          <div class="reward-card" role="article" aria-label={`${rewards.goldEarned} gold coins gained`}>
            <div class="reward-icon" aria-hidden="true">G</div>
            <div class="reward-details">
              <div class="reward-label">Gold</div>
              <div class="reward-value highlight">+{rewards.goldEarned} G</div>
            </div>
          </div>
        </div>

        {hasPendingChoice && (
          <EquipmentChoicePicker
            options={rewards.equipmentChoice!}
            onSelect={onSelectEquipment}
          />
        )}

        {obtainedEquipment.length > 0 && (
          <section class="items-panel" aria-label="Equipment obtained">
            <h2>EQUIPMENT OBTAINED</h2>
            <div class="items-grid">
              {obtainedEquipment.map(item => (
                <div key={item.id} class="item-card">
                  <EquipmentIcon equipment={item} size="small" className="item-icon" />
                  <div class="item-name">{item.name}</div>
                  <div class="item-quantity">x1</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Unit Recruitment Notification */}
        {rewards.recruitedUnit && (
          <section class="recruitment-panel" role="alert" aria-label={`Recruited ${rewards.recruitedUnit.name}`}>
            <h2>NEW RECRUIT!</h2>
            <div class="recruitment-unit">
              <div class="recruitment-sprite">
                <BattleUnitSprite unitId={rewards.recruitedUnit.id} state="idle" size="medium" />
              </div>
              <div class="recruitment-details">
                <div class="recruitment-name">{rewards.recruitedUnit.name}</div>
                <div class="recruitment-level">Level {rewards.recruitedUnit.level}</div>
                <div class="recruitment-element">{rewards.recruitedUnit.element}</div>
                <div class="recruitment-message">has joined your roster!</div>
              </div>
            </div>
          </section>
        )}

        {/* Djinn Acquisition Notification */}
        {rewards.recruitedUnit && latestDjinn && (
          <section class="djinn-panel" role="alert" aria-label={`Djinn ${latestDjinn.name} acquired`}>
            <h2>DJINN ACQUIRED</h2>
            <div class="djinn-acquisition">
              <div class="djinn-name">{latestDjinn.name}</div>
              <div class="djinn-element">{latestDjinn.element}</div>
              <div class="djinn-message">has been added to your collection!</div>
            </div>
          </section>
        )}

        {/* Level Up Notification */}
        {levelUpUnits.length > 0 && (
          <section class="level-up-panel" role="alert" aria-label={`${levelUpUnits.length} units leveled up`}>
            <h2>LEVEL UP!</h2>
            <div class="level-up-units">
              {levelUpUnits.map((levelUp, index) => (
                <div key={levelUp.unit.id} class="level-up-unit" style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
                  <div class="level-up-sprite">
                    <BattleUnitSprite unitId={levelUp.unit.id} state="idle" size="medium" />
                  </div>
                  <div class="level-up-name">{levelUp.unit.name}</div>
                  <div class="level-up-arrow">Lv {levelUp.oldLevel} -&gt; Lv {levelUp.newLevel}</div>
                  <div class="level-up-stats">
                    {levelUp.statGains.hp > 0 && <span>+{levelUp.statGains.hp} HP</span>}
                    {levelUp.statGains.atk > 0 && <span>+{levelUp.statGains.atk} ATK</span>}
                    {levelUp.statGains.def > 0 && <span>+{levelUp.statGains.def} DEF</span>}
                    {levelUp.statGains.mag > 0 && <span>+{levelUp.statGains.mag} MAG</span>}
                    {levelUp.statGains.spd > 0 && <span>+{levelUp.statGains.spd} SPD</span>}
                  </div>
                  {levelUp.unlockedAbilities.length > 0 && (
                    <div class="level-up-abilities">
                      Unlocked: {levelUp.unlockedAbilities.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Continue Button */}
        <div class="continue-container">
          <button
            onClick={onContinue}
            class="continue-btn"
            aria-label="Continue to next screen"
            disabled={hasPendingChoice && !rewards.choiceSelected}
            style={{
              opacity: hasPendingChoice && !rewards.choiceSelected ? 0.5 : 1,
              cursor: hasPendingChoice && !rewards.choiceSelected ? 'not-allowed' : 'pointer',
            }}
          >
            {hasPendingChoice && !rewards.choiceSelected ? 'SELECT EQUIPMENT FIRST' : 'CONTINUE'}
          </button>
        </div>
      </div>
    </div>
  );
}
