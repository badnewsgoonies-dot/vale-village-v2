/**
 * OverworldV2
 * Clean-slate overworld renderer with player movement and interior transitions.
 */

import { useEffect, useRef, useCallback, useState } from 'preact/hooks';
import { useStore } from '../../state/store';
import { useGameStore } from '../../../store/gameStore';

import { isHouseUnlocked } from '../../../core/services/StoryService';
import { OverworldEngineV2 } from './engine/OverworldEngineV2';
import { clampPlayerXToWorldBounds } from './engine/playerBounds';
import { SkyLayer } from './layers/SkyLayer';
import { BackgroundLayer } from './layers/BackgroundLayer';
import { TerrainLayer } from './layers/TerrainLayer';
import { TreeLayer } from './layers/TreeLayer';
import { RoadLayer } from './layers/RoadLayer';
import { VillageLayer } from './layers/VillageLayer';
import { EncountersLayer } from './layers/encountersLayer';
import { PlayerLayer } from './layers/PlayerLayer';
import { InteriorNpcLayer } from './layers/InteriorNpcLayer';
import { InteriorFloorLayer } from '../overworld/layers/InteriorFloorLayer';
import { InteriorFurnitureLayer } from '../overworld/layers/InteriorFurnitureLayer';
import { 
  VIEWPORT_HEIGHT, 
  VIEWPORT_WIDTH, 
  PLAYER_Y_MIN, 
  PLAYER_Y_MAX,
  PLAYER_MOVE_SPEED,
  INTERIOR_ROOM_WIDTH,
  INTERIOR_ROOM_HEIGHT,
  INTERIOR_ROOM_X,
  INTERIOR_ROOM_Y,
  INTERIOR_PLAYER_SPEED,
  EXIT_ZONE_WIDTH,
  EXIT_ZONE_HEIGHT,
  INTERIOR_ENEMY_OFFSET_Y,
  INTERIOR_NPC_TRIGGER_RADIUS,
  TOWER_LOBBY_WIDTH,
  TOWER_LOBBY_HEIGHT,
  TOWER_LOBBY_X,
  TOWER_LOBBY_Y
} from './data/constants';
import { VILLAGE_WORLD_WIDTH, VILLAGE_BUILDINGS } from './data/villageLayout';
import { clamp } from './engine/math';
import type { OverworldSlice } from '../../state/overworldSlice';
import type { Layer } from './engine/types';
import '../overworld/OverworldCanvas.css';
import { VirtualJoystick } from '../VirtualJoystick';
import { getPlayerSprite } from '../../sprites/mappings/overworldSprites';
import { TelemetryService } from '../../../core/services/TelemetryService';
import { audio } from '../../../core/services/AudioService';
import { OVERWORLD_CONSTANTS } from '../../../core/constants';


import { simStep, SimEnvironment } from '../../../core/simulation/simStep';
import type { SceneType } from '../overworld/systems/SceneTransition';
import { installGameDriver } from '../../../driver';
import { spawnEnemies, type EnemyState } from '../../../core/logic';
import { HudLayer } from './layers/HudLayer';

// Minimal props for this component
type OverworldV2Props = { width?: number; height?: number };

export function OverworldV2({ width = VIEWPORT_WIDTH, height = VIEWPORT_HEIGHT }: OverworldV2Props) {
  // Internal refs and state used across the component
  const playerDomRef = useRef<HTMLImageElement>(null);
  const playerDomContainerRef = useRef<HTMLDivElement>(null);
  const driverInstalledRef = useRef<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<OverworldEngineV2 | null>(null);
  const playerLayerRef = useRef<any>(null);
  const villageLayerRef = useRef<any>(null);
  const encountersLayerRef = useRef<any>(null);
  const interiorFloorRef = useRef<any>(null);
  const interiorFurnitureRef = useRef<any>(null);
  const interiorNpcRef = useRef<any>(null);
  const interiorBattleTriggeredRef = useRef<boolean>(false);
  const encounterTriggeredRef = useRef<Record<string, boolean>>({});
  const tickRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const enemiesRef = useRef<EnemyState[]>([]);
  const playerStatsRef = useRef({ hp: 100, maxHp: 100 });
  const metricsRef = useRef({ enemiesDefeated: 0, itemsCollected: 0, novelty: 0 });
  const touchInputRef = useRef<{ h: number; v: number; action: boolean }>({ h: 0, v: 0, action: false });
  const keysRef = useRef<Set<string>>(new Set());
  const lastGamepadStartRef = useRef<boolean>(false);
  const lastGamepadActionRef = useRef<boolean>(false);

  // Track scene state
  const sceneTypeRef = useRef<SceneType>('overworld');
  const savedOverworldXRef = useRef<number>(200);  // Save X position when entering interior
  const currentHouseNumRef = useRef<number>(1);

  // Transition state
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isTransitioningRef = useRef(false);
  const transitionAlphaRef = useRef<number>(0);
  const transitionTargetRef = useRef<SceneType | null>(null);

  // Store subscriptions
  const currentMapId = useStore((s: OverworldSlice) => s.currentMapId);
  const teleportPlayer = useStore((s: OverworldSlice) => s.teleportPlayer);
  const enterTowerFromOverworld = useStore((s) => s.enterTowerFromOverworld);
  const handleTrigger = useStore((s) => s.handleTrigger);
  const mode = useStore((s) => s.mode);
  const startDialogueTree = useStore((s) => s.startDialogueTree);
  const story = useStore((s) => s.story);
  const hasSeenDjinnIntro = Boolean(story.flags.first_djinn_intro_completed);

  // Avoid stale closures inside setInterval loops and global listeners.
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const storyRef = useRef(story);
  storyRef.current = story;

  // gameStore subscriptions
  const startTransition = useGameStore((s) => s.startTransition);
  const openModal = useGameStore((s) => s.openModal);
  const closeModal = useGameStore((s) => s.closeModal);
  const activeModal = useGameStore((s) => s.flow.modal);

  // Avoid stale closures
  const activeModalRef = useRef(activeModal);
  activeModalRef.current = activeModal;

  // Forward reference for exitInterior (will be assigned later)
  const exitInteriorRef = useRef<(() => void) | null>(null);

  // Audio: Play Overworld BGM
  useEffect(() => {
    audio.playBGM('overworld');
    enemiesRef.current = spawnEnemies();
  }, []);

  // ... (existing code)

  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  // GAME DRIVER v1.0 INSTALLATION
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (driverInstalledRef.current) return;
    driverInstalledRef.current = true;

    installGameDriver({
        getState: (): any => {
          const player = playerLayerRef.current;
          const pos = player?.getPosition() ?? { x: 0, y: 0 };
          const state = player?.getPlayerState();
          
          return {
            tick: tickRef.current,
            player: {
              hp: playerStatsRef.current.hp, 
              maxHp: playerStatsRef.current.maxHp,
              position: pos,
              deaths: 0 
            },
            world: {
              levelId: currentMapId,
              timeElapsed: (performance.now() - startTimeRef.current) / 1000,
              enemies: enemiesRef.current 
            },
            terminal: { kind: 'running' },
            flags: {
              isMoving: state?.isMoving ?? false,
              isOverworld: sceneTypeRef.current === 'overworld'
            },
            metrics: metricsRef.current
          };
        },

        dispatch: (action: any): any => {
          // 1. Get Current State
          const currentState = (window as any).__GAME_DRIVER__!.getState(); // Self-reference safe here
          
          // 2. Build Environment Context
          const env: SimEnvironment = {
              isOverworld: sceneTypeRef.current === 'overworld',
              isTowerLobby: currentMapId.includes('tower-lobby'),
              furniture: interiorFurnitureRef.current ?? undefined
          };

          // 3. Run Simulation Step (Pure Logic)
          const { state: nextState, terminal } = simStep(currentState, action, env);

          // 4. Apply State (Side Effects)
          enemiesRef.current = nextState.world.enemies;
          playerStatsRef.current.hp = nextState.player.hp;
          playerStatsRef.current.maxHp = nextState.player.maxHp;
          if (nextState.metrics) metricsRef.current = nextState.metrics;

          if (playerLayerRef.current) {
              playerLayerRef.current.setPlayerState({ 
                  x: nextState.player.position.x, 
                  y: nextState.player.position.y 
              });
              
              // Visuals: Facing / Animation
              if (action.type === 'MOVE') {
                  const { dx, dy } = action;
                  if (dx !== 0 || dy !== 0) {
                      playerLayerRef.current.setPlayerState({ isMoving: true });
                      if (dx > 0) playerLayerRef.current.setPlayerState({ facing: 'right' });
                      else if (dx < 0) playerLayerRef.current.setPlayerState({ facing: 'left' });
                      else if (dy < 0) playerLayerRef.current.setPlayerState({ facing: 'up' });
                      else if (dy > 0) playerLayerRef.current.setPlayerState({ facing: 'down' });
                  } else {
                      playerLayerRef.current.setPlayerState({ isMoving: false });
                  }
              } else if (action.type === 'NOOP') {
                  playerLayerRef.current.setPlayerState({ isMoving: false });
              }
          }
          
          // Sync Tick
          tickRef.current = nextState.tick;

          // Sync Joystick (Visual Feedback)
          if (action.type === 'MOVE') {
               touchInputRef.current.h = Math.max(-1, Math.min(1, action.dx));
               touchInputRef.current.v = Math.max(-1, Math.min(1, action.dy));
          } else if (action.type === 'NOOP') {
               touchInputRef.current.h = 0;
               touchInputRef.current.v = 0;
          }

          // Handle Trigger Flags from Sim
          if (nextState.flags && nextState.flags['exited_interior']) {
              exitInteriorRef.current?.();
          }

          // Handle Interact (Separate from SimStep for now, until Interact logic is purified)
          if (action.type === 'INTERACT') {
             keysRef.current.add(' ');
             setTimeout(() => keysRef.current.delete(' '), 100);
          }

          return { ok: true, terminal };
        },

        resetRun: (seed?: number) => {
          console.log('[Driver] Resetting run with seed:', seed);
          // Soft reset for CI
          tickRef.current = 0;
          startTimeRef.current = performance.now();
          playerStatsRef.current = { hp: 100, maxHp: 100 };
          metricsRef.current = { enemiesDefeated: 0, itemsCollected: 0, novelty: 0 };
          if (playerLayerRef.current) {
              // Reset to default start position (approx)
              playerLayerRef.current.setPlayerState({ x: 200, y: 450 }); 
          }
          // Reset internal flags
          sceneTypeRef.current = 'overworld';
          currentHouseNumRef.current = 1;
        }
    });
  }, []); // Added exitInterior dependency

  const getUnlockedBuildingIds = useCallback((): Set<string> => {
    const unlocked = new Set<string>();
    const storyState = storyRef.current;

    for (const building of VILLAGE_BUILDINGS) {
      if (building.kind === 'tower' || building.kind === 'shop') {
        unlocked.add(building.id);
        continue;
      }

      if (isHouseUnlocked(storyState, building.id)) {
        unlocked.add(building.id);
      }
    }

    return unlocked;
  }, []);

  const isGameplayInputLocked = (currentMode: string) =>
    currentMode === 'dialogue' ||
    currentMode === 'team-select' ||
    currentMode === 'battle' ||
    currentMode === 'shop' ||
    currentMode === 'rewards' ||
    currentMode === 'compendium' ||
    currentMode === 'tower';



  // Detect scene type from map ID
  const getSceneTypeFromMapId = useCallback((mapId: string): SceneType => {
    return mapId.includes('-interior') || mapId.includes('tower-lobby') ? 'interior' : 'overworld';
  }, []);

  // Extract house number from map ID (e.g., "house-05-interior" -> 5)
  const getHouseNumberFromMapId = useCallback((mapId: string): number => {
    const match = mapId.match(/house-(\d+)/);
    return match && match[1] ? parseInt(match[1], 10) : 1;
  }, []);

  // Helper to get room config based on map ID (for custom rooms like Tower)
  const getRoomConfig = useCallback((mapId: string) => {
    if (mapId.includes('tower-lobby')) {
      return { width: TOWER_LOBBY_WIDTH, height: TOWER_LOBBY_HEIGHT };
    }
    return undefined;
  }, []);

  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't steal input while a modal is open (pause/settings/etc) or when not in overworld mode.
    if (activeModalRef.current !== null) return;
    if (isGameplayInputLocked(modeRef.current)) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      openModal('pause');
      return;
    }

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' ', 'Enter'].includes(e.key)) {
      e.preventDefault();
      keysRef.current.add(e.key);
    }
  }, [openModal]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysRef.current.delete(e.key);
  }, []);

  // Create overworld layers
  const createOverworldLayers = useCallback((): Layer[] => {
    const villageLayer = new VillageLayer();
    villageLayerRef.current = villageLayer;
    villageLayer.setUnlockedHouses(getUnlockedBuildingIds());

    const encountersLayer = new EncountersLayer({
      buildings: [], // Do not treat buildings as proximity encounters (battles)
      getPlayerPosition: () => playerLayerRef.current?.getPosition() ?? null,
      onTrigger: (buildingId: string) => {
        handleTrigger({
          id: `${buildingId}-symbol`,
          type: 'battle',
          position: { x: 0, y: 0 },
          data: { encounterId: buildingId },
        });
      },
    });
    encountersLayerRef.current = encountersLayer;

    const playerLayer = new PlayerLayer({
      x: savedOverworldXRef.current,
      y: OVERWORLD_CONSTANTS.INTERIOR_PLAYER_Y,
      facing: 'right',
      unitId: 'adept',
    });
    // Disable canvas rendering for player sprite (only render shadow)
    playerLayer.shouldRenderSprite = false;
    playerLayerRef.current = playerLayer;

    villageLayer.setPlayerPosition(savedOverworldXRef.current, OVERWORLD_CONSTANTS.INTERIOR_PLAYER_Y);

    const hudLayer = new HudLayer(
      () => enemiesRef.current,
      () => playerStatsRef.current
    );

    return [
      new SkyLayer(),
      new BackgroundLayer(),
      new TerrainLayer(),
      new TreeLayer(),
      new RoadLayer(),
      villageLayer,
      encountersLayer,
      playerLayer,
      hudLayer,
    ];
  }, [getUnlockedBuildingIds, handleTrigger]);

  // Keep house unlock visuals in sync with story flags (and ensure new VillageLayer instances inherit them).
  useEffect(() => {
    villageLayerRef.current?.setUnlockedHouses(getUnlockedBuildingIds());
  }, [story, getUnlockedBuildingIds]);

  // Create interior layers
  const createInteriorLayers = useCallback((houseNum: number, roomConfig?: { width: number; height: number }): Layer[] => {
    const isCustomRoom = !!roomConfig;
    const width = roomConfig?.width ?? INTERIOR_ROOM_WIDTH;
    const height = roomConfig?.height ?? INTERIOR_ROOM_HEIGHT;
    const roomX = isCustomRoom ? TOWER_LOBBY_X : INTERIOR_ROOM_X;
    const roomY = isCustomRoom ? TOWER_LOBBY_Y : INTERIOR_ROOM_Y;

    const houseId = `house-${String(houseNum).padStart(2, '0')}`;
    const floorLayer = new InteriorFloorLayer();
    floorLayer.setRoomSize(width, height);
    interiorFloorRef.current = floorLayer;

    const furnitureLayer = new InteriorFurnitureLayer();
    furnitureLayer.setRenderPlayer(false);
    furnitureLayer.setRoomConfig({
      roomX: roomX,
      roomY: roomY,
      roomWidth: width,
      roomHeight: height,
    });
    
    if (isCustomRoom) {
      // TODO: Custom furniture for Tower Lobby
    } else {
      furnitureLayer.generateHouseFurniture(houseNum);
    }
    interiorFurnitureRef.current = furnitureLayer;

    // Interior access is already gated by door unlocks; only suppress enemies after completion.
    // Tower lobby doesn't have random enemies for now.
    const shouldSpawnEnemy = !isCustomRoom && storyRef.current.flags[houseId] !== true;
    const enemyOffsetY = houseNum === 1 ? INTERIOR_ROOM_HEIGHT / 2 : INTERIOR_ENEMY_OFFSET_Y;
    const npcLayer = shouldSpawnEnemy
      ? new InteriorNpcLayer({
        id: `${houseId}-enemy`,
        x: roomX + width / 2,
        y: roomY + enemyOffsetY,
      })
      : null;
      
    // Add Tower Guide NPC if in Tower Lobby
    // We reuse InteriorNpcLayer for now, but mark it as 'tower-guide'
    let towerNpcLayer = null;
    if (isCustomRoom) {
        towerNpcLayer = new InteriorNpcLayer({
            id: 'tower-guide',
            x: roomX + width / 2,
            y: roomY + height / 2 - 50, // Center of room
        });
        // We need to set up a trigger for this NPC in the update loop or here?
        // InteriorNpcLayer doesn't handle triggers itself, the update loop checks proximity to it.
        // So we just need to assign it to a ref that the update loop checks.
    }
    
    // We use the same ref for simplicity, assuming only one "interactive NPC" layer exists at a time.
    interiorNpcRef.current = towerNpcLayer || npcLayer;
    interiorBattleTriggeredRef.current = false;

    // Create player layer for interior
    const playerLayer = new PlayerLayer({
      x: roomX + width / 2,
      y: roomY + height - 50,
      facing: 'up',
      unitId: 'adept',
    });
    // Disable canvas rendering for player sprite (only render shadow)
    playerLayer.shouldRenderSprite = false;
    playerLayerRef.current = playerLayer;

    return (towerNpcLayer || npcLayer) 
        ? [floorLayer, furnitureLayer, (towerNpcLayer || npcLayer)!, playerLayer] 
        : [floorLayer, furnitureLayer, playerLayer];
  }, []);

  // Switch scene type with fade transition
  const transitionToScene = useCallback((
    targetScene: SceneType, 
    houseNum: number = 1, 
    teleportTo?: { mapId: string; position?: { x: number; y: number } },
    roomConfig?: { width: number; height: number }
  ) => {
    if (isTransitioningRef.current) return;

    const isInstant = typeof localStorage !== "undefined" && localStorage.getItem("battleSpeed") === "instant";
    if (isInstant) {
      const engine = engineRef.current;
      if (engine) {
        sceneTypeRef.current = targetScene;
        currentHouseNumRef.current = houseNum;
        if (teleportTo) {
          try { teleportPlayer(teleportTo.mapId, teleportTo.position ?? { x: 5, y: 7 }); } catch (err) { console.error("Failed to teleport", err); }
        }
        if (targetScene === "interior") {
          engine.setLayers(createInteriorLayers(houseNum, roomConfig));
          
          if (roomConfig && (roomConfig.width > VIEWPORT_WIDTH || roomConfig.height > VIEWPORT_HEIGHT)) {
             const width = roomConfig.width;
             const height = roomConfig.height;
             const roomX = TOWER_LOBBY_X;
             const roomY = TOWER_LOBBY_Y;
             const startX = roomX + width / 2;
             const startY = roomY + height - 50;
             engine.getCamera().setTarget(startX, startY);
          } else {
             engine.getCamera().setTarget(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2);
          }
          engine.getCamera().snapToTarget();
        } else {
          engine.setLayers(createOverworldLayers());
          const pos = playerLayerRef.current?.getPosition();
          if (pos) { engine.getCamera().setTarget(pos.x, pos.y); engine.getCamera().snapToTarget(); }
        }
      }
      return;
    }

    isTransitioningRef.current = true;
    setIsTransitioning(true);
    transitionTargetRef.current = targetScene;
    currentHouseNumRef.current = houseNum;

    // Fade out
    const fadeOut = () => {
      transitionAlphaRef.current += OVERWORLD_CONSTANTS.TRANSITION_ALPHA_STEP;
      if (transitionAlphaRef.current >= 1) {
        // Switch layers at peak darkness
        const engine = engineRef.current;
        if (engine) {
          sceneTypeRef.current = targetScene;

          // Perform teleport
          if (teleportTo) {
            try {
              teleportPlayer(teleportTo.mapId, teleportTo.position ?? { x: 5, y: 7 });
            } catch (err) {
              console.error('Failed to teleport during transition', err);
            }
          }

          if (targetScene === 'interior') {
            engine.setLayers(createInteriorLayers(houseNum, roomConfig));
            
            // Camera Logic
            if (roomConfig && (roomConfig.width > VIEWPORT_WIDTH || roomConfig.height > VIEWPORT_HEIGHT)) {
                 const width = roomConfig.width;
                 const height = roomConfig.height;
                 const roomX = TOWER_LOBBY_X;
                 const roomY = TOWER_LOBBY_Y;
                 const startX = roomX + width / 2;
                 const startY = roomY + height - 50;
                 engine.getCamera().setTarget(startX, startY);
            } else {
                 engine.getCamera().setTarget(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2);
            }
            engine.getCamera().snapToTarget();
          } else {
            engine.setLayers(createOverworldLayers());
            const pos = playerLayerRef.current?.getPosition();
            if (pos) {
              engine.getCamera().setTarget(pos.x, pos.y);
              engine.getCamera().snapToTarget();
            }
          }
        }

        requestAnimationFrame(fadeIn);
      } else {
        requestAnimationFrame(fadeOut);
      }
    };

    const fadeIn = () => {
      transitionAlphaRef.current -= OVERWORLD_CONSTANTS.TRANSITION_ALPHA_STEP;
      if (transitionAlphaRef.current <= 0) {
        transitionAlphaRef.current = 0;
        transitionTargetRef.current = null;
        isTransitioningRef.current = false;
        setIsTransitioning(false);
      } else {
        requestAnimationFrame(fadeIn);
      }
    };

    requestAnimationFrame(fadeOut);
  }, [createOverworldLayers, createInteriorLayers, teleportPlayer]);

  // Handle entering a building
  const enterBuilding = useCallback((buildingId: string) => {
    const building = VILLAGE_BUILDINGS.find(b => b.id === buildingId);
    if (!building || !building.interaction) return;

    // Save current X position for return
    const playerPos = playerLayerRef.current?.getPosition();
    if (playerPos) {
      savedOverworldXRef.current = playerPos.x;
    }

    const { type, payload } = building.interaction;

    if (type === 'enter-tower') {
      // Enter Tower Lobby (Interior)
      transitionToScene('interior', 0, 
        { mapId: 'tower-lobby', position: { x: 50, y: 75 } }, 
        { width: TOWER_LOBBY_WIDTH, height: TOWER_LOBBY_HEIGHT }
      );
    } else if (type === 'open-shop') {
      handleTrigger({
        id: 'overworld-shop',
        type: 'shop',
        position: { x: 0, y: 0 },
        data: { shopId: payload?.shopId ?? 'vale-armory' },
      });
    } else if (type === 'enter-interior') {
      const houseNum = payload?.houseNumber ?? 1;
      transitionToScene('interior', houseNum, payload?.mapId ? { mapId: payload.mapId, position: { x: 5, y: 7 } } : undefined);
    }
  }, [transitionToScene, getHouseNumberFromMapId, teleportPlayer, enterTowerFromOverworld, handleTrigger, hasSeenDjinnIntro, startDialogueTree]);

  // Handle exiting interior
  const exitInterior = useCallback(() => {
    // Transition back to overworld and teleport at scene switch
    transitionToScene('overworld', 1, { mapId: 'vale-village', position: { x: Math.floor(savedOverworldXRef.current / 32), y: 14 } });
  }, [transitionToScene, teleportPlayer]);
  exitInteriorRef.current = exitInterior;

  // Check if player is in exit zone
  const isInExitZone = useCallback((): boolean => {
    const player = playerLayerRef.current;
    if (!player) return false;

    const pos = player.getPosition();
    const isTowerLobby = currentMapId.includes('tower-lobby');
    
    // Bounds depend on room size/location
    const roomX = isTowerLobby ? TOWER_LOBBY_X : INTERIOR_ROOM_X;
    const roomY = isTowerLobby ? TOWER_LOBBY_Y : INTERIOR_ROOM_Y;
    const roomW = isTowerLobby ? TOWER_LOBBY_WIDTH : INTERIOR_ROOM_WIDTH;
    const roomH = isTowerLobby ? TOWER_LOBBY_HEIGHT : INTERIOR_ROOM_HEIGHT;

    const exitCenterX = roomX + roomW / 2;
    const exitY = roomY + roomH;

    return (
      Math.abs(pos.x - exitCenterX) < EXIT_ZONE_WIDTH / 2 &&
      pos.y > exitY - EXIT_ZONE_HEIGHT
    );
  }, [currentMapId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new OverworldEngineV2(canvas, {
      viewportWidth: width,
      viewportHeight: height,
      worldWidth: VILLAGE_WORLD_WIDTH,
      worldHeight: height,
    });

    // Start with overworld layers
    engine.setLayers(createOverworldLayers());

    // Set camera to follow player position
    const playerPos = playerLayerRef.current?.getPosition();
    if (playerPos) {
      engine.getCamera().setTarget(playerPos.x, playerPos.y);
      engine.getCamera().snapToTarget();
    }

    engine.start();
    engineRef.current = engine;

    // Add keyboard listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    engine.onUpdate((dtMs: number, eng: OverworldEngineV2) => {
      const dt = dtMs / 1000;

      const player = playerLayerRef.current;
      const village = villageLayerRef.current;

      try {
        const nearestDoor = village?.getNearestDoor ? village.getNearestDoor() : null;
        TelemetryService.updateFrame({ navigationAssist: { nearestDoorId: nearestDoor?.id ?? null } });
      } catch (e) {
      }

      if (!player || isTransitioningRef.current) return;

      // Sync DOM player position
      if (playerDomContainerRef.current && playerDomRef.current) {
        const state = player.getPlayerState();
        const pos = player.getPosition();
        
        const spriteSrc = getPlayerSprite(state.unitId, state.facing, state.isMoving);
        if (playerDomRef.current.src !== window.location.origin + spriteSrc) {
            playerDomRef.current.src = spriteSrc;
        }
        
        const mirror = state.facing === 'left';
        playerDomRef.current.style.transform = mirror ? 'scaleX(-1)' : 'scaleX(1)';
        
        const screenPos = eng.getCamera().worldToScreenSnapped(pos.x, pos.y);
        playerDomContainerRef.current.style.transform = `translate(${screenPos.x}px, ${screenPos.y}px)`;
      }

      if (isGameplayInputLocked(modeRef.current) || activeModalRef.current !== null) {
        player.setPlayerState({ isMoving: false });
        return;
      }

      const keys = keysRef.current;
      const isOverworld = sceneTypeRef.current === 'overworld';

      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      const gp = gamepads[0];
      let gpAction = false;
      let gpStart = false;

      if (gp) {
        if (gp.buttons[0]?.pressed) gpAction = true;
        if (gp.buttons[9]?.pressed) gpStart = true;

        if (gpStart && !lastGamepadStartRef.current) {
          openModal('pause');
        }
        lastGamepadStartRef.current = gpStart;
      }

      const actionPressed = keys.has(' ') || keys.has('Enter') || touchInputRef.current.action || (gpAction && !lastGamepadActionRef.current);
      lastGamepadActionRef.current = gpAction;

      if (actionPressed) {
        keys.delete(' ');
        keys.delete('Enter');
        if (touchInputRef.current.action) touchInputRef.current.action = false;

        if (isOverworld) {
          const nearestDoor = village?.getNearestDoor();
          if (nearestDoor) {
            enterBuilding(nearestDoor.id);
            return;
          }
        } else {
            // Interior Interaction
            const npcLayer = interiorNpcRef.current;
            if (npcLayer) {
                const npcPos = npcLayer.getPosition();
                const playerPos = player.getPosition();
                const dx = playerPos.x - npcPos.x;
                const dy = playerPos.y - npcPos.y;
                const distanceSq = dx * dx + dy * dy;
                
                // Interaction range (60px)
                if (distanceSq <= OVERWORLD_CONSTANTS.ENCOUNTER_PROXIMITY_RADIUS_SQ) {
                    if (npcLayer.getId() === 'tower-guide') {
                        // Open Tower Menu
                        enterTowerFromOverworld({
                            mapId: 'tower-lobby',
                            position: { x: 50, y: 50 } // ignored usually
                        });
                    }
                }
            }
        }
      }

      let dx = 0;
      let dy = 0;

      const t = touchInputRef.current;
      if (t.h !== 0 || t.v !== 0) {
        dx = t.h;
        dy = t.v;
      } else if (gp) {
        const axisX = gp.axes[0] || 0;
        const axisY = gp.axes[1] || 0;
        if (Math.abs(axisX) > 0.2) dx = axisX;
        if (Math.abs(axisY) > 0.2) dy = axisY;

        if (gp.buttons[12]?.pressed) dy -= 1;
        if (gp.buttons[13]?.pressed) dy += 1;
        if (gp.buttons[14]?.pressed) dx -= 1;
        if (gp.buttons[15]?.pressed) dx += 1;
      } 
      
      if (dx === 0 && dy === 0) {
        if (keys.has('ArrowLeft') || keys.has('a')) dx -= 1;
        if (keys.has('ArrowRight') || keys.has('d')) dx += 1;
        if (keys.has('ArrowUp') || keys.has('w')) dy -= 1;
        if (keys.has('ArrowDown') || keys.has('s')) dy += 1;
      }

      const isMoving = dx !== 0 || dy !== 0;
      player.setPlayerState({ isMoving });

      if (!isMoving) return;

      const len = Math.sqrt(dx * dx + dy * dy);
      dx /= len;
      dy /= len;

      const pos = player.getPosition();
      const speed = isOverworld ? PLAYER_MOVE_SPEED : INTERIOR_PLAYER_SPEED;

      let newX: number;
      let newY: number;

      if (isOverworld) {
        newX = clampPlayerXToWorldBounds(pos.x + dx * speed * dt, VILLAGE_WORLD_WIDTH);
        newY = clamp(pos.y + dy * speed * dt, PLAYER_Y_MIN, PLAYER_Y_MAX);
      } else {
        const isTowerLobby = currentMapId.includes('tower-lobby');
        const roomX = isTowerLobby ? TOWER_LOBBY_X : INTERIOR_ROOM_X;
        const roomY = isTowerLobby ? TOWER_LOBBY_Y : INTERIOR_ROOM_Y;
        const roomW = isTowerLobby ? TOWER_LOBBY_WIDTH : INTERIOR_ROOM_WIDTH;
        const roomH = isTowerLobby ? TOWER_LOBBY_HEIGHT : INTERIOR_ROOM_HEIGHT;

        newX = clamp(
          pos.x + dx * speed * dt,
          roomX + 20,
          roomX + roomW - 20
        );
        newY = clamp(
          pos.y + dy * speed * dt,
          roomY + 20,
          roomY + roomH + 10 
        );
      }

      if (!isOverworld) {
        const furniture = interiorFurnitureRef.current;
        const collider = { halfWidth: 10, halfHeight: 7 };

        let finalX = pos.x;
        let finalY = pos.y;

        if (!furniture?.isBlocked(newX, pos.y, collider)) {
          finalX = newX;
        }
        if (!furniture?.isBlocked(finalX, newY, collider)) {
          finalY = newY;
        }

        if (finalX === pos.x && finalY === pos.y) {
          player.setPlayerState({ isMoving: false });
          newX = pos.x;
          newY = pos.y;
        } else {
          newX = finalX;
          newY = finalY;
        }
      }

      player.setPlayerState({ x: newX, y: newY });

      // Update facing direction
      if (dx > 0) {
        player.setPlayerState({ facing: 'right' });
      } else if (dx < 0) {
        player.setPlayerState({ facing: 'left' });
      } else if (dy < 0) {
        player.setPlayerState({ facing: 'up' });
      } else if (dy > 0) {
        player.setPlayerState({ facing: 'down' });
      }

      if (isOverworld) {
        eng.getCamera().setTarget(newX, newY);
        village?.setPlayerPosition(newX, newY);
        encountersLayerRef.current?.setPlayerPosition(newX, newY);

        // Fix: Auto-enter houses on collision (walk-in)
        // Only applies to standard interiors, not Tower/Shops which might require interaction
        if (isMoving) {
          const nearestDoor = village?.getNearestDoor();
          if (nearestDoor && nearestDoor.interaction?.type === 'enter-interior') {
            const doorX = nearestDoor.x + (nearestDoor.doorOffsetX ?? 0);
            const doorY = nearestDoor.y + (nearestDoor.doorOffsetY ?? 0);
            const dist = Math.sqrt(Math.pow(newX - doorX, 2) + Math.pow(newY - doorY, 2));
            if (dist < 25) { // 25px collision threshold
              enterBuilding(nearestDoor.id);
            }
          }
        }

        const encountersLayer = encountersLayerRef.current;
        try {
          const nearby = encountersLayer?.getNearbyEncounter(newX, newY, 32);
          if (nearby && !encounterTriggeredRef.current[nearby.id]) {
            encounterTriggeredRef.current[nearby.id] = true;
            handleTrigger({
              id: `${nearby.id}-overworld`,
              type: 'battle',
              position: { x: 0, y: 0 },
              data: { encounterId: nearby.id },
            });
          }
        } catch (e) {
        }
      } else {
        const state = player.getPlayerState();
        interiorFurnitureRef.current?.setPlayerPosition({ x: newX, y: newY }, state.facing);
        
        // Follow camera in large interiors
        const isTowerLobby = currentMapId.includes('tower-lobby');
        if (isTowerLobby) {
            eng.getCamera().setTarget(newX, newY);
        }

        if (isInExitZone() && dy > 0) {
          exitInterior();
        } else {
          const npcLayer = interiorNpcRef.current;
          if (npcLayer && !interiorBattleTriggeredRef.current) {
            const npcPos = npcLayer.getPosition();
            const dxNpc = newX - npcPos.x;
            const dyNpc = newY - npcPos.y;
            const distanceSq = dxNpc * dxNpc + dyNpc * dyNpc;
            if (distanceSq <= INTERIOR_NPC_TRIGGER_RADIUS * INTERIOR_NPC_TRIGGER_RADIUS) {
              // Only trigger battle for HOUSE enemies, not Tower Guide
              if (npcLayer.getId().includes('enemy')) {
                  const houseId = `house-${String(currentHouseNumRef.current).padStart(2, '0')}`;
                  if (storyRef.current.flags[houseId] !== true) {
                    interiorBattleTriggeredRef.current = true;
                    handleTrigger({
                      id: `${houseId}-enemy`,
                      type: 'battle',
                      position: { x: 0, y: 0 },
                      data: { encounterId: houseId },
                    });
                  }
              }
            }
          }
        }
      }
    });

    const renderOverlay = () => {
      try { TelemetryService.updateFrame(); } catch (e) { }
      if (transitionAlphaRef.current > 0) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = `rgba(0, 0, 0, ${transitionAlphaRef.current})`;
          ctx.fillRect(0, 0, width, height);
        }
      }
      requestAnimationFrame(renderOverlay);
    };
    requestAnimationFrame(renderOverlay);

    return () => {
      engine.stop();
      engineRef.current = null;
      playerLayerRef.current = null;
      villageLayerRef.current = null;
      interiorFloorRef.current = null;
      interiorFurnitureRef.current = null;
      interiorNpcRef.current = null;
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [width, height, handleKeyDown, handleKeyUp, createOverworldLayers, enterBuilding, exitInterior, isInExitZone, handleTrigger, currentMapId]); // Added currentMapId dependency for isTowerLobby checks

  // ... (keep useEffects for mode sync)
  useEffect(() => {
    if (mode === 'team-select') {
      startTransition('team-select');
    } else if (mode === 'battle') {
      startTransition('battle');
    } else if (mode === 'shop') {
      startTransition('shop');
    } else if (mode === 'rewards') {
      startTransition('rewards');
    } else if (mode === 'overworld') {
      closeModal();
      encounterTriggeredRef.current = {};
    }
  }, [mode, startTransition, closeModal]);

  useEffect(() => {
    const targetScene = getSceneTypeFromMapId(currentMapId);
    if (targetScene !== sceneTypeRef.current && !isTransitioning) {
      const houseNum = getHouseNumberFromMapId(currentMapId);
      const roomConfig = getRoomConfig(currentMapId);
      transitionToScene(targetScene, houseNum, undefined, roomConfig);
    }
  }, [currentMapId, getSceneTypeFromMapId, getHouseNumberFromMapId, transitionToScene, isTransitioning, getRoomConfig]);

  const computedSceneType = getSceneTypeFromMapId(currentMapId); const computedHouseNum = getHouseNumberFromMapId(currentMapId); const sceneName = computedSceneType === "interior"
    ? currentMapId.includes('tower') ? 'Battle Tower Lobby' : `House ${computedHouseNum} Interior`
    : 'Vale Village';

  return (
    <div class="overworld-shell">
      <div class="location-banner">
        <div class="location-title">{sceneName}</div>
        <div class="location-meta">
          <span class="location-chip location-chip--ghost">
            {sceneTypeRef.current === 'interior' 
                ? (currentMapId.includes('tower') ? 'SPACE to speak to Guide' : 'Walk to EXIT to leave') 
                : 'SPACE to enter buildings'}
          </span>
        </div>
      </div>

      <div class="overworld-stage">
        <div class="overworld-canvas-container" style={{ position: 'relative' }}>
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            class="overworld-canvas"
          />
          
          <div 
            ref={playerDomContainerRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 0,
              height: 0,
              pointerEvents: 'none',
              zIndex: 10, 
              willChange: 'transform',
            }}
          >
            <img 
              ref={playerDomRef}
              src={getPlayerSprite('adept', 'right', false)}
              style={{
                position: 'absolute',
                left: '-16px', // -width/2
                top: '-58px',  // -height + 10px shift
                width: '32px',
                height: '48px',
                imageRendering: 'pixelated',
              }}
              alt=""
            />
          </div>
        </div>
      </div>
      <VirtualJoystick
        onMove={(h: number, v: number) => {
          touchInputRef.current.h = Math.max(-1, Math.min(1, h));
          touchInputRef.current.v = Math.max(-1, Math.min(1, v));
        }}
        onAction={(pressed: boolean) => {
          touchInputRef.current.action = pressed;
        }}
      />
    </div>
  );
}