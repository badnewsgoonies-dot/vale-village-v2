import { store } from '../../ui/state/store';
import { calculateMaxHp } from '../models/Unit';
import type { Unit } from '../models/Unit';

declare global {
  interface Window {
    __TELEMETRY__?: unknown;
  }
}

export const TelemetryService = {
  /**
   * Read public selectors from the UI store and populate window.__TELEMETRY__ with a
   * sanitized snapshot. Designed to be safe to call every frame and never mutates state.
   */
  updateFrame: (extras?: { navigationAssist?: { nearestDoorId: string | null } }) => {
    try {
      const s = store.getState();

      const battle = s.battle;

      const party = battle
        ? (battle.playerTeam?.units ?? []).map((u: Unit) => ({ 
            id: u.id, 
            hp: u.currentHp, 
            maxHp: calculateMaxHp(u) 
          }))
        : [];

      const enemies = battle 
        ? (battle.enemies ?? []).map((e: Unit) => ({ 
            id: e.id, 
            hp: e.currentHp, 
            maxHp: calculateMaxHp(e) 
          })) 
        : [];

      const activeTurn = battle
        ? (() => {
            const idx = (typeof (battle as any).currentActorIndex === 'number') ? (battle as any).currentActorIndex : (battle.currentTurn ?? null);
            const currentActorId = Array.isArray(battle.turnOrder) && idx != null ? battle.turnOrder[idx] ?? null : null;
            return { currentActorId, currentTurn: idx };
          })()
        : null;

      const battlePhase = battle ? battle.phase : null;

      const location = {
        mapId: s.currentMapId ?? null,
        playerPosition: s.playerPosition ?? null,
      };

      const navigationAssist = {
        currentTrigger: s.currentTrigger ?? null,
        nearestDoorId: extras?.navigationAssist?.nearestDoorId ?? null,
      };

      const telemetry = {
        timestamp: Date.now(),
        party,
        enemies,
        activeTurn,
        battlePhase,
        location,
        navigationAssist,
      };

      window.__TELEMETRY__ = telemetry;
    } catch (err) {
      // Never throw from telemetry to avoid breaking game loop
    }
  },

  // Alias for backward compatibility
  update(extras?: { navigationAssist?: { nearestDoorId: string | null } }) {
    return this.updateFrame(extras);
  },
};
