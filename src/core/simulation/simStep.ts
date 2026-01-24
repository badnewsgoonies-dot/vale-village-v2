import { GameState, GameAction, TerminalState } from '../../driver';
import { clamp } from '../../ui/components/overworld-v2/engine/math';
import { clampPlayerXToWorldBounds } from '../../ui/components/overworld-v2/engine/playerBounds';

// Shared combat logic (SINGLE SOURCE OF TRUTH)
import {
  resolvePlayerAttack,
  processEnemyAttacks,
  processEnemyMovement,
  checkTerminal,
} from '../logic';
import { 
  PLAYER_MOVE_SPEED, 
  INTERIOR_PLAYER_SPEED, 
  INTERIOR_ROOM_X, 
  INTERIOR_ROOM_Y, 
  INTERIOR_ROOM_WIDTH, 
  INTERIOR_ROOM_HEIGHT,
  TOWER_LOBBY_X, 
  TOWER_LOBBY_Y, 
  TOWER_LOBBY_WIDTH, 
  TOWER_LOBBY_HEIGHT,
  EXIT_ZONE_WIDTH,
  EXIT_ZONE_HEIGHT,
  PLAYER_Y_MIN,
  PLAYER_Y_MAX
} from '../../ui/components/overworld-v2/data/constants';
import { VILLAGE_WORLD_WIDTH } from '../../ui/components/overworld-v2/data/villageLayout';

// Minimal Environment Interface needed for collision
export interface SimEnvironment {
  isOverworld: boolean;
  isTowerLobby: boolean;
  furniture?: {
    isBlocked: (x: number, y: number, collider: { halfWidth: number, halfHeight: number }) => boolean;
  };
}

export function simStep(
  prevState: GameState, 
  action: GameAction, 
  env: SimEnvironment,
  dt: number = 0.016 // Fixed timestep default
): { state: GameState; terminal: TerminalState } {
  
  // 1. Clone State (Defensive Copy)
  const next = JSON.parse(JSON.stringify(prevState)); // structuredClone preferred if available
  const player = next.player;
  
  // 2. Process Input
  let dx = 0;
  let dy = 0;

  if (action.type === 'MOVE') {
    dx = action.dx;
    dy = action.dy;
  }

  // Handle ATTACK action (uses shared combat logic)
  if (action.type === 'ATTACK' && env.isOverworld) {
    resolvePlayerAttack(next, action.targetId);
  }

  const isMoving = dx !== 0 || dy !== 0;

  if (!isMoving && action.type !== 'ATTACK') {
    // NOOP or INTERACT - still process enemy turn
    if (env.isOverworld && next.world.enemies.length > 0) {
      processEnemyMovement(next);
      processEnemyAttacks(next);
      next.terminal = checkTerminal(next);
    }
    next.tick += 1;
    return { state: next, terminal: next.terminal };
  }

  // Normalize Vector
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len > 0) {
    dx /= len;
    dy /= len;
  }

  // 3. Calculate Physics
  const speed = env.isOverworld ? PLAYER_MOVE_SPEED : INTERIOR_PLAYER_SPEED;
  const currentPos = player.position;
  
  let newX: number;
  let newY: number;

  if (env.isOverworld) {
    newX = clampPlayerXToWorldBounds(currentPos.x + dx * speed * dt, VILLAGE_WORLD_WIDTH);
    newY = clamp(currentPos.y + dy * speed * dt, PLAYER_Y_MIN, PLAYER_Y_MAX);
  } else {
    // Interior / Tower Bounds
    const roomX = env.isTowerLobby ? TOWER_LOBBY_X : INTERIOR_ROOM_X;
    const roomY = env.isTowerLobby ? TOWER_LOBBY_Y : INTERIOR_ROOM_Y;
    const roomW = env.isTowerLobby ? TOWER_LOBBY_WIDTH : INTERIOR_ROOM_WIDTH;
    const roomH = env.isTowerLobby ? TOWER_LOBBY_HEIGHT : INTERIOR_ROOM_HEIGHT;

    newX = clamp(
      currentPos.x + dx * speed * dt,
      roomX + 20,
      roomX + roomW - 20
    );
    newY = clamp(
      currentPos.y + dy * speed * dt,
      roomY + 20,
      roomY + roomH + 10 
    );
  }

  // 4. Resolve Collisions (Interiors only)
  if (!env.isOverworld && env.furniture) {
    const collider = { halfWidth: 10, halfHeight: 7 };
    let finalX = currentPos.x;
    let finalY = currentPos.y;

    if (!env.furniture.isBlocked(newX, currentPos.y, collider)) {
      finalX = newX;
    }
    if (!env.furniture.isBlocked(finalX, newY, collider)) {
      finalY = newY;
    }
    
    newX = finalX;
    newY = finalY;
  }

  // 5. Update State
  player.position.x = newX;
  player.position.y = newY;
  
  // 6. Check Triggers / Terminal Conditions
  // (Simplified for now - strictly movement)
  // Exit Zone Check
  if (!env.isOverworld) {
     const roomX = env.isTowerLobby ? TOWER_LOBBY_X : INTERIOR_ROOM_X;
     const roomY = env.isTowerLobby ? TOWER_LOBBY_Y : INTERIOR_ROOM_Y;
     const roomW = env.isTowerLobby ? TOWER_LOBBY_WIDTH : INTERIOR_ROOM_WIDTH;
     const roomH = env.isTowerLobby ? TOWER_LOBBY_HEIGHT : INTERIOR_ROOM_HEIGHT;
     
     const exitCenterX = roomX + roomW / 2;
     const exitY = roomY + roomH;
     
     const inExit = Math.abs(newX - exitCenterX) < EXIT_ZONE_WIDTH / 2 && newY > exitY - EXIT_ZONE_HEIGHT;
     if (inExit && dy > 0) {
         // We hit the exit. 
         // In a pure sim, we'd flag this. The Driver handles the actual scene switch side-effect.
         next.flags['exited_interior'] = true;
     }
  }

  // 7. Combat Processing (overworld only)
  if (env.isOverworld && next.world.enemies.length > 0) {
    processEnemyMovement(next);
    processEnemyAttacks(next);
  }

  // 8. Check terminal conditions
  next.terminal = checkTerminal(next);

  next.tick += 1;
  return { state: next, terminal: next.terminal };
}

export function getLegalActions(_state: GameState, _env: SimEnvironment): GameAction[] {
  // Standard set of actions for this game mode
  // In a more complex game, we might filter 'INTERACT' based on proximity
  // or remove 'MOVE' if stunned/locked.
  return [
    { type: 'NOOP' },
    { type: 'MOVE', dx: 0, dy: -1 }, // Up
    { type: 'MOVE', dx: 0, dy: 1 },  // Down
    { type: 'MOVE', dx: -1, dy: 0 }, // Left
    { type: 'MOVE', dx: 1, dy: 0 },  // Right
    { type: 'ATTACK' },  // Combat action
    { type: 'INTERACT' }
  ];
}
