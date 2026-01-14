import { createUnit } from '../models/Unit';
import { createTeam, updateTeam } from '../models/Team';
import { UNIT_DEFINITIONS } from '../../data/definitions/units';
import type { Team } from '../models/Team';

export class GameInitializationService {
  /**
   * Creates the starter team with Flint
   */
  static createStarterTeamWithFlint(): Team {
    const isaac = createUnit(UNIT_DEFINITIONS['adept']!, 1);
    // Explicitly set character names (overriding class names)
    Object.assign(isaac, { name: 'Isaac' });

    const garet = createUnit(UNIT_DEFINITIONS['war-mage']!, 1);
    Object.assign(garet, { name: 'Garet' });

    const ivan = createUnit(UNIT_DEFINITIONS['ranger']!, 1);
    Object.assign(ivan, { name: 'Ivan' });

    const mia = createUnit(UNIT_DEFINITIONS['mystic']!, 1);
    Object.assign(mia, { name: 'Mia' });

    const team = createTeam([isaac, garet, ivan, mia]);
    
    // Add Flint immutably (Team arrays are readonly)
    const updatedTeam = updateTeam(team, {
      collectedDjinn: [...team.collectedDjinn, 'flint'],
      equippedDjinn: ['flint'],
      djinnTrackers: {
        ...team.djinnTrackers,
        flint: {
          djinnId: 'flint',
          state: 'Set',
          lastActivatedTurn: 0,
        }
      }
    });

    return updatedTeam;
  }
}
