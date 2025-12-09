/**
 * BattleUnitSprite Component
 * Wrapper around SimpleSprite component for unit display with real sprite assets
 */

import type { JSX } from 'preact';
import { SimpleSprite } from '../sprites/SimpleSprite';
import {
  getEnemyBattleSprite,
  getPlayerBattleSprite,
  type BattleSpriteState,
} from '../sprites/mappings';
import { warnIfPlaceholderSprite } from '../sprites/utils/warnIfPlaceholderSprite';

interface BattleUnitSpriteProps {
  /** Unit ID (e.g., 'adept', 'test-warrior-1') */
  unitId: string;

  /** Animation state */
  state?: 'idle' | 'attack' | 'hit' | 'damage';

  /** Whether this unit is on the player team (defaults to true) */
  isPlayer?: boolean;

  /** Size variant */
  size?: 'small' | 'medium' | 'large';

  /** Custom className */
  className?: string;

  /** Custom style */
  style?: JSX.CSSProperties;
}

const SIZE_MAP = {
  small: { width: 32, height: 32 },
  medium: { width: 48, height: 48 },
  large: { width: 64, height: 64 },
};

const STATE_PROP_TO_BATTLE_STATE: Record<NonNullable<BattleUnitSpriteProps['state']>, BattleSpriteState> = {
  idle: 'idle',
  attack: 'attack',
  hit: 'hit',
  damage: 'hit',
};

/**
 * BattleUnitSprite component
 * Delegates sprite selection to the battle sprite mapping layer so that
 * production screens do not need to know concrete asset IDs.
 */
export function BattleUnitSprite({
  unitId,
  state = 'idle',
  isPlayer = true,
  size = 'medium',
  className,
  style,
}: BattleUnitSpriteProps) {
  const sizeStyles = SIZE_MAP[size];

  const mappedState = STATE_PROP_TO_BATTLE_STATE[state] ?? 'idle';
  const spriteId = isPlayer
    ? getPlayerBattleSprite(unitId, mappedState) ?? getEnemyBattleSprite(unitId, mappedState) ?? null
    : getEnemyBattleSprite(unitId, mappedState) ?? getPlayerBattleSprite(unitId, mappedState) ?? null;
  const resolvedSpriteId = spriteId ?? `missing-battle-sprite-${unitId}-${mappedState}`;
  warnIfPlaceholderSprite('BattleUnitSprite', resolvedSpriteId);

  const animationClasses: string[] = [];
  if (!isPlayer) {
    if (state === 'attack') {
      animationClasses.push('enemy-lunge');
    } else if (state === 'hit') {
      animationClasses.push('enemy-shake');
    }
  }

  const finalClassName = [className, ...animationClasses].filter(Boolean).join(' ') || undefined;

  // Render sprite using SimpleSprite with catalog lookup
  return (
    <SimpleSprite
      id={resolvedSpriteId}
      width={sizeStyles.width}
      height={sizeStyles.height}
      className={finalClassName}
      style={style}
      alt={spriteId ? `${unitId} sprite` : `Missing battle sprite for ${unitId}`}
    />
  );
}
