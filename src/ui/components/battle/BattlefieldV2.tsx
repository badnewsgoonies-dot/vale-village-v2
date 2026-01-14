
import type { BattleState } from '../../../core/models/BattleState';
import type { Unit } from '../../../core/models/Unit';
import type { BattleEvent } from '../../../core/services/types';
import { isUnitKO } from '../../../core/models/Unit';
import { getEnemyBattleSprite, getEnemyBattleSpriteWithOverride } from '../../sprites/mappings/battleSprites';
import { SimpleSprite } from '../../sprites/SimpleSprite';
import { BattleUnitSprite } from '../BattleUnitSprite';
import { DjinnStatusBar } from './DjinnStatusBar';
import type { FloatingNumber, FloatingAction } from '../../state/types';

interface BattlefieldV2Props {
  battle: BattleState;
  events: BattleEvent[];
  validTargetIds: Set<string>;
  highlightedTargets: Set<string>;
  currentActorId: string | null;
  shakingUnits: Set<string>;
  attackingUnits: Set<string>;
  castingUnits: Set<string>;
  hitTargetIds: Set<string>;
  attackingUnitId: string | null;
  floatingNumbers: FloatingNumber[];
  floatingActions: FloatingAction[];
  onTargetSelect: (unitId: string) => void;
  equippedDjinn: string[];
  onOpenSummonMenu: () => void;
  djinnSpriteByElement: Record<string, string>;
  djinnData: Record<string, any>;
  // When true, the battle has just started and enemies should fade in with a slight stagger
  battleStarting?: boolean;
}

export function BattlefieldV2({
  battle,
  events,
  validTargetIds,
  highlightedTargets,
  currentActorId,
  shakingUnits,
  attackingUnits,
  castingUnits,
  hitTargetIds,
  attackingUnitId,
  floatingNumbers,
  floatingActions,
  onTargetSelect,
  equippedDjinn,
  onOpenSummonMenu,
  djinnSpriteByElement,
  djinnData,
  battleStarting
}: BattlefieldV2Props) {
  
  // Helper to check if unit should be visible (alive or has pending event)
  const shouldShowUnit = (unit: Unit) => {
    const hasPendingEvent = events.some((evt) => {
      if (evt.type === 'ability' && evt.casterId === unit.id) return true;
      if (evt.type === 'ability' && evt.targets.includes(unit.id)) return true;
      if (evt.type === 'hit' && evt.targetId === unit.id) return true;
      if (evt.type === 'heal' && evt.targetId === unit.id) return true;
      if (evt.type === 'ko' && evt.unitId === unit.id) return true;
      if (evt.type === 'status-applied' && evt.targetId === unit.id) return true;
      if (evt.type === 'status-expired' && evt.targetId === unit.id) return true;
      return false;
    });
    
    // Valid targets (e.g. for revival) should also be shown
    const isTargetCandidate = validTargetIds.has(unit.id);
    
    return !isUnitKO(unit) || hasPendingEvent || isTargetCandidate;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 48,
        height: '100%',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Enemy Row */}
      <div
        style={{
          position: 'absolute',
          bottom: '42%',
          left: '8%',
          display: 'flex',
          gap: '3rem',
          zIndex: 10,
        }}
      >
        {battle.enemies.map((enemy, enemyIndex) => {
          if (!shouldShowUnit(enemy)) return null;

          const isTargetCandidate = validTargetIds.has(enemy.id);
          const isResolvingTarget = highlightedTargets.has(enemy.id);
          const isActor = currentActorId === enemy.id;
          const isShaking = shakingUnits.has(enemy.id);
          const isAttacking = attackingUnits.has(enemy.id);
          const isCasting = castingUnits.has(enemy.id);

          const isLeader = enemyIndex === 0;
          const mappedSprite = isLeader
            ? getEnemyBattleSpriteWithOverride(enemy.id, 'idle', battle.leaderSpriteId)
            : getEnemyBattleSprite(enemy.id, 'idle');
          const nameBasedFallback = `/sprites/battle/enemies/${enemy.name.replace(/\s+/g, '')}.gif`;
          const spriteId = mappedSprite ?? nameBasedFallback;

          let spriteAnimation = 'none';
          if (isAttacking) {
            spriteAnimation = 'attackLungeRight 400ms ease-out';
          } else if (isCasting) {
            spriteAnimation = 'castPulse 500ms ease-out';
          } else if (isShaking) {
            spriteAnimation = 'unitDamageShake 240ms ease-in-out';
          }

          return (
            <div
              key={enemy.id}
              data-testid={`battle-enemy-${enemy.id}`}
              onClick={() => isTargetCandidate && onTargetSelect(enemy.id)}
              style={{
                position: 'relative',
                cursor: isTargetCandidate ? 'pointer' : 'default',
                textAlign: 'center',
              }}
            >
              {/* Shadow */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 70,
                  height: 24,
                  background: 'rgba(0,0,0,0.6)',
                  borderRadius: '50%',
                  filter: 'blur(4px)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />
              
              {/* Sprite */}
              <div
                style={{
                  position: 'relative',
                  // Start slightly offset and invisible when battleStarting is true, then transition to normal scale
                  transform: (battleStarting ? 'translateY(8px) ' : '') + (isActor ? 'scale(3.2)' : 'scale(3)'),
                  zIndex: 1,
                  filter: isResolvingTarget
                    ? 'drop-shadow(0 0 14px rgba(255,216,127,0.9))'
                    : isActor
                      ? 'drop-shadow(0 0 12px rgba(255,216,127,0.9))'
                      : isTargetCandidate
                        ? 'drop-shadow(0 0 8px rgba(255,216,127,0.7))'
                        : 'none',
                  animation: spriteAnimation + (isActor ? ', activePulse 900ms ease-in-out infinite' : ''),
                  opacity: battleStarting ? 0 : 1,
                  transition: `opacity 300ms ease ${enemyIndex * 120}ms, transform 320ms cubic-bezier(.2,.9,.2,1) ${enemyIndex * 120}ms`,
                }}
              >
                <SimpleSprite
                  id={spriteId}
                  width={64}
                  height={64}
                  fallback={
                    <SimpleSprite
                      id="/sprites/battle/enemies/Goblin.gif"
                      width={64}
                      height={64}
                      imageRendering="pixelated"
                    />
                  }
                  imageRendering="pixelated"
                />
              </div>

              {/* Floating Numbers & Actions */}
              {floatingNumbers
                .filter((n) => n.unitId === enemy.id)
                .map((num, idx) => {
                  const displayValue = Math.abs(num.amount);
                  const isCritical = num.isCrit;
                  return (
                    <div
                      key={num.id}
                      style={{
                        position: 'absolute',
                        bottom: `calc(100% + ${idx * 16 + 6}px)`,
                        left: '50%',
                        color: num.kind === 'heal' ? '#6df0a2' : isCritical ? '#FFD54A' : '#ff6b6b',
                        fontSize: isCritical ? '1.4rem' : '1rem',
                        fontWeight: 800,
                        textShadow: isCritical
                          ? '0 0 12px rgba(255, 215, 74, 0.9), 0 0 20px rgba(255, 180, 0, 0.6), 2px 2px 4px rgba(0,0,0,0.9)'
                          : '0 0 6px rgba(0,0,0,0.8)',
                        animation: isCritical ? 'criticalFloat 1.3s ease-out forwards' : 'floatNumber 1.05s ease-out forwards',
                        pointerEvents: 'none',
                        zIndex: isCritical ? 20 : 12,
                      }}
                    >
                      {isCritical && <span style={{ display: 'block', fontSize: '0.7rem', color: '#FFD54A' }}>CRITICAL!</span>}
                      {num.kind === 'heal' ? `+${displayValue}` : `-${displayValue}`}
                    </div>
                  );
                })}
              
              {floatingActions
                .filter((a) => a.unitId === enemy.id)
                .map((action, idx) => (
                  <div
                    key={action.id}
                    style={{
                      position: 'absolute',
                      top: `calc(-20px - ${idx * 18}px)`,
                      left: '50%',
                      color: action.color,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textShadow: '0 0 6px rgba(0,0,0,0.9), 1px 1px 2px rgba(0,0,0,0.8)',
                      animation: 'floatAction 1.1s ease-out forwards',
                      pointerEvents: 'none',
                      zIndex: 15,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {action.text}
                  </div>
                ))}

              <div
                style={{
                  marginTop: 4,
                  fontSize: '0.8rem',
                  color: isTargetCandidate ? '#FFD87F' : '#aaa',
                }}
              >
                {enemy.name}
              </div>
              
              {isTargetCandidate && (
                <div style={{ color: '#FFD87F', fontSize: '0.75rem' }}>Click to target</div>
              )}
              
              {isResolvingTarget && (
                <div
                  style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: '#FFD87F',
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    textShadow: '0 0 8px rgba(255,216,127,0.9)',
                    pointerEvents: 'none',
                    zIndex: 15,
                  }}
                >
                  ⯈
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Player Row */}
      <div
        style={{
          position: 'absolute',
          bottom: '28%',
          right: '15%',
          width: 260,
          height: 160,
          zIndex: 10,
        }}
      >
        {battle.playerTeam.units.map((unit, index) => {
          if (!shouldShowUnit(unit)) return null;

          const isActor = currentActorId === unit.id;
          const isTarget = highlightedTargets.has(unit.id);
          const isShaking = shakingUnits.has(unit.id);
          const isAttacking = attackingUnits.has(unit.id);
          const isCasting = castingUnits.has(unit.id);
          const isAttackingBasic = attackingUnitId === unit.id;
          const isBeingHit = hitTargetIds.has(unit.id);
          
          const spriteState = isAttackingBasic ? 'attack' : isBeingHit ? 'hit' : 'idle';
          
          let spriteAnimation = 'none';
          if (isAttacking) {
            spriteAnimation = 'attackLungeLeft 400ms ease-out';
          } else if (isCasting) {
            spriteAnimation = 'castPulse 500ms ease-out';
          } else if (isShaking) {
            spriteAnimation = 'unitDamageShake 240ms ease-in-out';
          }

          return (
            <div
              key={unit.id}
              style={{
                position: 'absolute',
                left: index * 55,
                bottom: index * 12,
                textAlign: 'center',
              }}
            >
              {/* Shadow */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 4,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 48,
                  height: 16,
                  background: isActor || isTarget ? 'rgba(255,216,127,0.3)' : 'rgba(0,0,0,0.6)',
                  borderRadius: '50%',
                  filter: 'blur(4px)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />
              
              {/* Sprite */}
              <div
                style={{
                  position: 'relative',
                  transform: isActor ? 'scale(2.7)' : 'scale(2.5)',
                  zIndex: 1,
                  filter: isActor ? 'drop-shadow(0 0 14px rgba(255,216,127,0.9))' : isTarget ? 'drop-shadow(0 0 12px rgba(255,216,127,0.8))' : 'none',
                  animation: spriteAnimation + (isActor ? ', activePulse 900ms ease-in-out infinite' : ''),
                }}
              >
                <BattleUnitSprite unitId={unit.id} state={spriteState} size="large" />
              </div>

              {isTarget && (
                <div
                  style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: '#FFD87F',
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    textShadow: '0 0 8px rgba(255,216,127,0.9)',
                    pointerEvents: 'none',
                    zIndex: 15,
                  }}
                >
                  ⯈
                </div>
              )}

              {/* Floating Numbers & Actions */}
              {floatingNumbers
                .filter((n) => n.unitId === unit.id)
                .map((num, idx) => {
                  const displayValue = Math.abs(num.amount);
                  const isCritical = num.isCrit;
                  return (
                    <div
                      key={num.id}
                      style={{
                        position: 'absolute',
                        bottom: `calc(100% + ${idx * 16 + 6}px)`,
                        left: '50%',
                        color: num.kind === 'heal' ? '#6df0a2' : isCritical ? '#FFD54A' : '#ff6b6b',
                        fontSize: isCritical ? '1.4rem' : '1rem',
                        fontWeight: 800,
                        textShadow: isCritical
                          ? '0 0 12px rgba(255, 215, 74, 0.9), 0 0 20px rgba(255, 180, 0, 0.6), 2px 2px 4px rgba(0,0,0,0.9)'
                          : '0 0 6px rgba(0,0,0,0.8)',
                        animation: isCritical ? 'criticalFloat 1.3s ease-out forwards' : 'floatNumber 1.05s ease-out forwards',
                        pointerEvents: 'none',
                        zIndex: isCritical ? 20 : 12,
                      }}
                    >
                      {isCritical && <span style={{ display: 'block', fontSize: '0.7rem', color: '#FFD54A' }}>CRITICAL!</span>}
                      {num.kind === 'heal' ? `+${displayValue}` : `-${displayValue}`}
                    </div>
                  );
                })}
              
              {floatingActions
                .filter((a) => a.unitId === unit.id)
                .map((action, idx) => (
                  <div
                    key={action.id}
                    style={{
                      position: 'absolute',
                      top: `calc(-20px - ${idx * 18}px)`,
                      left: '50%',
                      color: action.color,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textShadow: '0 0 6px rgba(0,0,0,0.9), 1px 1px 2px rgba(0,0,0,0.8)',
                      animation: 'floatAction 1.1s ease-out forwards',
                      pointerEvents: 'none',
                      zIndex: 15,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {action.text}
                  </div>
                ))}

              {/* Djinn status icons (below each player unit) */}
              <DjinnStatusBar unit={unit} djinnData={djinnData} djinnSpriteByElement={djinnSpriteByElement} />
            </div>
          );
        })}
      </div>

      {/* Djinn companions behind party */}
      {equippedDjinn.length > 0 && (
        <div
          onClick={onOpenSummonMenu}
          title="Open Summon Menu"
          style={{
            cursor: 'pointer',
            position: 'absolute',
            right: '6%',
            bottom: '34%',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            zIndex: 8,
          }}
        >
          {equippedDjinn.map((djinnId, idx) => {
            const djinn = djinnData[djinnId];
            if (!djinn) return null;
            const spritePath = djinnSpriteByElement[djinn.element] || '/sprites/battle/djinn/Venus_Djinn_Front.gif';
            return (
              <div
                key={djinnId}
                style={{
                  position: 'relative',
                  left: idx % 2 === 0 ? 0 : 6,
                }}
              >
                <img
                  src={spritePath}
                  alt={djinn.name}
                  width={32}
                  height={32}
                  style={{ imageRendering: 'pixelated', transform: 'scale(2.5)' }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
