/**
 * Battle Overlay Component
 *
 * Displays victory or defeat overlays with rewards and action buttons.
 */

import { JSX } from 'preact';
import type { BattleOverlayProps } from './types';

export function BattleOverlay({
  status,
  rewards,
  onContinue,
  onReturnToVillage,
  onRetry,
  onReturnToTitle,
}: BattleOverlayProps): JSX.Element | null {
  if (status === 'ongoing') {
    return null;
  }

  const isVictory = status === 'victory';
  const overlayClass = isVictory ? 'battle-overlay--victory' : 'battle-overlay--defeat';

  return (
    <div class={`battle-overlay ${overlayClass}`}>
      <div class="battle-overlay-title">
        {isVictory ? 'Victory!' : 'Defeat'}
      </div>

      {isVictory && rewards && (
        <div class="battle-overlay-subtitle">
          XP: +{rewards.xp} · Gold: +{rewards.gold}
        </div>
      )}

      {!isVictory && (
        <div class="battle-overlay-subtitle">
          Your party has fallen.
        </div>
      )}

      <div class="battle-overlay-actions">
        {isVictory ? (
          <>
            <button class="overlay-button" onClick={onContinue}>
              Continue (Rewards)
            </button>
            <button class="overlay-button" onClick={onReturnToVillage}>
              Return to Village
            </button>
          </>
        ) : (
          <>
            <button class="overlay-button" onClick={onRetry}>
              Retry Battle
            </button>
            <button class="overlay-button" onClick={onReturnToTitle}>
              Return to Title
            </button>
          </>
        )}
      </div>
    </div>
  );
}
