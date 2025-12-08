import { useEffect } from 'preact/hooks';
import { MAPS } from '@/data/definitions/maps';
import { useStore } from '../state/store';
import { useGameStore } from '../../store/gameStore';
import { SimpleSprite } from '../sprites/SimpleSprite';
import { getPlayerSprite, shouldMirrorSprite, getNPCSprite } from '../sprites/mappings';
import { warnIfPlaceholderSprite } from '../sprites/utils/warnIfPlaceholderSprite';
import { getTriggerAt } from '@/core/services/OverworldService';
import { isHouseUnlocked } from '@/core/services/StoryService';
import type { Tile, Position } from '@/core/models/overworld';
import './OverworldMap.css';

export function OverworldMap() {
  // Use gameStore for screen navigation state
  const screen = useGameStore((s) => s.flow.screen);
  const modal = useGameStore((s) => s.flow.modal);

  const startTransition = useGameStore((s) => s.startTransition);
  const openModal = useGameStore((s) => s.openModal);
  const closeModal = useGameStore((s) => s.closeModal);

  // Use V1 store for domain state (overworld data)
  const { currentMapId, playerPosition, facing, movePlayer, currentTrigger, clearTrigger, teleportPlayer, resetLastTrigger, team, mode, handleTrigger, story } = useStore(state => ({
    currentMapId: state.currentMapId,
    playerPosition: state.playerPosition,
    facing: state.facing,
    movePlayer: state.movePlayer,
    currentTrigger: state.currentTrigger,
    clearTrigger: state.clearTrigger,
    teleportPlayer: state.teleportPlayer,
    resetLastTrigger: state.resetLastTrigger,
    team: state.team,
    mode: state.mode,
    handleTrigger: state.handleTrigger,
    story: state.story,
  }));

  // Sync V1 store's mode to V2 gameStore screen/modal when mode changes
  useEffect(() => {
    if (mode === 'team-select') {
      startTransition('team-select');
    } else if (mode === 'battle') {
      startTransition('battle');
    } else if (mode === 'shop') {
      startTransition('shop');
    } else if (mode === 'rewards') {
      startTransition('rewards');
    } else if (mode === 'dialogue') {
      openModal('dialogue');
    } else if (mode === 'overworld') {
      // Close any open modal when returning to overworld (e.g., after dialogue ends)
      closeModal();
    }
  }, [mode, startTransition, openModal, closeModal]);

  const map = MAPS[currentMapId];

  // Helper function to get adjacent positions based on facing direction
  const getInteractionPosition = (): Position => {
    const delta: Record<'up' | 'down' | 'left' | 'right', Position> = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    };
    return {
      x: playerPosition.x + delta[facing].x,
      y: playerPosition.y + delta[facing].y,
    };
  };

  // Handle space/enter interaction with NPCs
  const handleInteraction = () => {
    if (!map) return;

    // Check for trigger at current position (player is on the same tile as NPC)
    let trigger = getTriggerAt(map, playerPosition);

    // If no trigger at current position, check adjacent position (facing the NPC)
    if (!trigger) {
      const facingPos = getInteractionPosition();
      trigger = getTriggerAt(map, facingPos);
    }

    if (!trigger) return;

    // Apply the same filtering logic as movePlayer for battle triggers
    let shouldTrigger = true;
    if (trigger.type === 'battle') {
      const encounterId = (trigger.data as { encounterId?: string }).encounterId;
      if (encounterId) {
        // Skip defeated encounters (liberation encounters are one-time only)
        if (story.flags[encounterId] === true) {
          shouldTrigger = false;
        }
        // Skip locked encounters (progressive unlock system)
        else if (!isHouseUnlocked(story, encounterId)) {
          shouldTrigger = false;
        }
      }
    }

    // Only trigger if it passed the filters
    if (shouldTrigger) {
      handleTrigger(trigger);
    }
  };

  useEffect(() => {
    // Only listen when on overworld screen with no modal open
    if (screen !== 'overworld' || modal !== null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle movement when in overworld mode (not during dialogue, shops, etc.)
      if (screen !== 'overworld' || modal !== null) return;

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        movePlayer('up');
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        movePlayer('down');
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        movePlayer('left');
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        movePlayer('right');
      } else if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        handleInteraction();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        openModal('pause');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, openModal, screen, modal, playerPosition, facing, map, handleTrigger, story]);


  useEffect(() => {
    if (!currentTrigger) return;

    if (currentTrigger.type === 'transition') {
      const data = currentTrigger.data as { targetMap?: string; targetPos?: Position };
      if (data.targetMap && data.targetPos) {
        teleportPlayer(data.targetMap, data.targetPos);
      }
    }

    clearTrigger();
    resetLastTrigger();
  }, [currentTrigger, clearTrigger, teleportPlayer, resetLastTrigger]);

  if (!map) {
    return <div>No overworld map loaded.</div>;
  }

  // Calculate encounter rate display
  const encounterRatePercent = map.encounterRate ? Math.round(map.encounterRate * 100) : 0;
  const hasRandomEncounters = map.encounterRate && map.encounterPool && map.encounterPool.length > 0;

  return (
    <div class="overworld-shell">
      <div class="location-banner">
        <div class="location-title">{map.name}</div>
        <div class="location-meta">
          {hasRandomEncounters && (
            <span class="location-chip">Encounters {encounterRatePercent}%</span>
          )}
          <span class="location-chip location-chip--ghost">ESC for pause menu</span>
        </div>
      </div>

      <div class="overworld-stage">
        <div class="overworld-container">
          {map.tiles.map((row, y) => (
            <div key={y} class="tile-row">
              {row.map((tile: Tile, x) => {
                const isPlayer = playerPosition.x === x && playerPosition.y === y;

                // Find NPC at this position
                const npcAtPosition = map.npcs.find(npc =>
                  npc.position.x === x && npc.position.y === y
                );

                return (
                  <div
                    key={`${x}-${y}`}
                    class={`tile tile-${tile.type}`}
                    style={{
                      backgroundImage:
                        tile.spriteId && (tile.spriteId.startsWith('/') || tile.spriteId.startsWith('http'))
                          ? `url(${tile.spriteId})`
                          : undefined,
                      position: 'relative',
                    }}
                    data-sprite={tile.spriteId ?? undefined}
                  >
                    {/* NPC Sprite */}
                    {npcAtPosition && !isPlayer && (
                      <SimpleSprite
                        id={(() => {
                          const directSpriteId = npcAtPosition.spriteId;
                          const resolvedSpriteId = directSpriteId && (directSpriteId.startsWith('/') || directSpriteId.startsWith('http'))
                            ? directSpriteId
                            : getNPCSprite(npcAtPosition.id);
                          warnIfPlaceholderSprite('OverworldMap', resolvedSpriteId);
                          return resolvedSpriteId;
                        })()}
                        width={32}
                        height={32}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          zIndex: 2, // Above tiles, below player
                        }}
                      />
                    )}

                    {/* Player Sprite */}
                    {isPlayer && team && team.units[0] && (
                      <SimpleSprite
                        id={(() => {
                          const playerSpriteId = getPlayerSprite(team.units[0].id, facing);
                          warnIfPlaceholderSprite('OverworldMap', playerSpriteId);
                          return playerSpriteId;
                        })()}
                        width={32}
                        height={32}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          zIndex: 3, // Above NPCs
                          transform: shouldMirrorSprite(facing) ? 'scaleX(-1)' : 'none',
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
