/**
 * Unit tests for EncounterService
 * Verifies encounter difficulty affects gameplay (enemy stats + battle meta)
 */

import { describe, it, expect } from 'vitest';
import { createBattleFromEncounter } from '../../../src/core/services/EncounterService';
import { createUnit } from '../../../src/core/models/Unit';
import { createTeam } from '../../../src/core/models/Team';
import { makePRNG } from '../../../src/core/random/prng';
import { ADEPT } from '../../../src/data/definitions/units';
import { ENEMIES } from '../../../src/data/definitions/enemies';

describe('EncounterService', () => {
  it('scales enemy stats based on encounter difficulty', () => {
    const playerUnit = createUnit(ADEPT, 1, 0);
    const playerTeam = createTeam([playerUnit]);

    const easy = createBattleFromEncounter('house-02', playerTeam, makePRNG(123));
    expect(easy).not.toBeNull();
    expect(easy!.battle.meta?.difficulty).toBe('normal');

    const easyEnemyDef = ENEMIES['earth-scout'];
    expect(easyEnemyDef).toBeDefined();
    const easyHpExpected = Math.max(1, Math.round(easyEnemyDef!.stats.hp * 0.9));
    expect(easy!.battle.enemies[0].baseStats.hp).toBe(easyHpExpected);
    expect(easy!.battle.enemies[0].currentHp).toBe(easyHpExpected);

    const hard = createBattleFromEncounter('house-11', playerTeam, makePRNG(456));
    expect(hard).not.toBeNull();
    expect(hard!.battle.meta?.difficulty).toBe('elite');

    const hardEnemyDef = ENEMIES['stone-captain'];
    expect(hardEnemyDef).toBeDefined();
    const hardAtkExpected = Math.max(1, Math.round(hardEnemyDef!.stats.atk * 1.1));
    expect(hard!.battle.enemies[0].baseStats.atk).toBe(hardAtkExpected);
  });
});

