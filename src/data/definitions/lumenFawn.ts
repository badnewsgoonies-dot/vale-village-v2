import type { Enemy } from "../schemas/EnemySchema";
import {
  STRIKE,
  QUAKE,
} from "./abilities";
import { LEATHER_CAP, POWER_RING } from "./equipment";
import { BATTLE_CONSTANTS } from "../../core/constants";

export const LUMEN_FAWN: Enemy = {
  id: "lumen-fawn",
  name: "Lumen Fawn",
  level: 1,
  element: "Venus",
  stats: {
    hp: 45,
    pp: 10,
    atk: 14,
    def: 8,
    mag: 6,
    spd: 12,
  },

  abilities: [
    { ...STRIKE },
    { ...QUAKE },
  ],
  baseXp: 12,
  baseGold: 6,
  drops: [
    { equipment: LEATHER_CAP, chance: BATTLE_CONSTANTS.EQUIPMENT_DROP_RATE_NORMAL },
    { equipment: POWER_RING, chance: 0.02 },
  ],
};
