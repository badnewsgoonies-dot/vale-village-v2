/**
 * VictoryScreen Component
 * Displays battle victory rewards with animations
 */

import { useEffect, useCallback } from 'preact/hooks';
import type { Unit } from '../../../core/models/Unit';
import { SimpleSprite } from '../../sprites/SimpleSprite';
import { getPortraitSprite } from '../../sprites/mappings';
import './VictoryScreen.css';

export interface VictoryRewards {
  xp: number;
  gold: number;
  items?: string[];
}

export interface LevelUp {
  unitId: string;
  unitName: string;
  oldLevel: number;
  newLevel: number;
  newAbility?: string;
}

export interface VictoryScreenProps {
  partyUnits: Unit[];
  rewards: VictoryRewards;
  levelUps?: LevelUp[];
  onContinue: () => void;
}

export function VictoryScreen({
  partyUnits,
  rewards,
  levelUps = [],
  onContinue,
}: VictoryScreenProps) {
  // Handle keyboard input
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        onContinue();
      }
    },
    [onContinue]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div class="victory-overlay">
      {/* Sparkle Effects */}
      <div class="victory-sparkles">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} class="victory-sparkle" />
        ))}
      </div>

      {/* Victory Banner */}
      <div class="victory-banner">
        <div class="victory-title">VICTORY</div>
        <div class="victory-subtitle">Battle Complete</div>
      </div>

      {/* Party Display */}
      <div class="victory-party-display">
        {partyUnits.map((unit) => (
          <div key={unit.id} class="victory-party-member">
            <div class="victory-party-sprite">
              <SimpleSprite
                id={getPortraitSprite(unit.id)}
                width={64}
                height={64}
              />
            </div>
            <div class="victory-party-name">{unit.name}</div>
          </div>
        ))}
      </div>

      {/* Rewards Panel */}
      <div class="victory-rewards-panel">
        <div class="victory-rewards-header">Battle Rewards</div>

        <div class="victory-rewards-grid">
          <div class="victory-reward-item">
            <div class="victory-reward-icon">⭐</div>
            <div class="victory-reward-details">
              <div class="victory-reward-label">Experience</div>
              <div class="victory-reward-value xp">+{rewards.xp} XP</div>
            </div>
          </div>

          <div class="victory-reward-item">
            <div class="victory-reward-icon">💰</div>
            <div class="victory-reward-details">
              <div class="victory-reward-label">Gold</div>
              <div class="victory-reward-value gold">+{rewards.gold} G</div>
            </div>
          </div>

          {rewards.items?.map((item, i) => (
            <div key={i} class="victory-reward-item">
              <div class="victory-reward-icon">📦</div>
              <div class="victory-reward-details">
                <div class="victory-reward-label">Item Found</div>
                <div class="victory-reward-value item">{item}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Level Up Notifications */}
        {levelUps.map((levelUp) => (
          <div key={levelUp.unitId} class="victory-level-up">
            <div class="victory-level-up-text">
              🎉 {levelUp.unitName} reached Level {levelUp.newLevel}!
            </div>
            {levelUp.newAbility && (
              <div class="victory-level-up-detail">
                Learned new ability: <strong>{levelUp.newAbility}</strong>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <button class="victory-continue-btn" onClick={onContinue}>
        Continue
      </button>

      {/* Keyboard Hint */}
      <div class="victory-hint">
        Press <kbd>SPACE</kbd> to continue
      </div>
    </div>
  );
}
