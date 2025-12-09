import type { DialogueTree } from '@/core/models/dialogue';

type EnemyPhase = {
  range: [number, number];
  speaker: string;
  portrait: string;
  intro: (houseNum: number) => string;
  threat: (houseNum: number) => string;
};

const ENEMY_PHASES: EnemyPhase[] = [
  {
    range: [1, 5],
    speaker: 'Crimson Scout',
    portrait: 'enemy-scout',
    intro: (houseNum) => `Another would-be hero reaches House ${houseNum}? Cute.`,
    threat: () => 'These doors stay locked, even if I have to bury you under this road.',
  },
  {
    range: [6, 10],
    speaker: 'Blazing Captain',
    portrait: 'enemy-soldier',
    intro: (houseNum) => `You burned through the scouts, but House ${houseNum} is defended by captains.`,
    threat: () => 'Mars flames answer to me alone. Prepare to be reduced to ash.',
  },
  {
    range: [11, 15],
    speaker: 'Iron Warden',
    portrait: 'enemy-captain',
    intro: (houseNum) => `House ${houseNum} guards the inner ring. No villager leaves without my say.`,
    threat: () => 'Steel and discipline decide this fight—not your sentiment.',
  },
  {
    range: [16, 19],
    speaker: 'Arcane Enforcer',
    portrait: 'enemy-commander',
    intro: (houseNum) => `Few make it to House ${houseNum}. Your persistence is almost admirable.`,
    threat: () => 'Kneel and live as a prisoner, or stand and fall as an example.',
  },
  {
    range: [20, 20],
    speaker: 'Vale Overseer',
    portrait: 'enemy-warlord',
    intro: () => 'The final house is my throne, and you are wildly outmatched.',
    threat: () => 'Topple me if you dare. Freedom for Vale lies beyond my defeat.',
  },
  // CHAPTER 2: Post-Vale Progression (Houses 21-30)
  {
    range: [21, 23],
    speaker: 'Undead Warlord',
    portrait: 'enemy-undead',
    intro: (houseNum) => `You thought Vale was the end? House ${houseNum} marks the beginning of true darkness.`,
    threat: () => 'The dead do not rest. Neither shall you.',
  },
  {
    range: [24, 26],
    speaker: 'Frost Titan',
    portrait: 'enemy-titan',
    intro: (houseNum) => `House ${houseNum} lies in eternal winter. Your flames mean nothing here.`,
    threat: () => 'Ice cares not for hope. It only consumes.',
  },
  {
    range: [27, 29],
    speaker: 'Storm Archon',
    portrait: 'enemy-archon',
    intro: (houseNum) => `House ${houseNum} crackles with raw elemental fury. You dare challenge the storm?`,
    threat: () => 'Lightning strikes without warning. So shall my wrath.',
  },
  {
    range: [30, 30],
    speaker: 'The Nexus Guardian',
    portrait: 'enemy-nexus',
    intro: () => 'You stand at the threshold of ultimate power. House 30 is the nexus of all Psynergy.',
    threat: () => 'Every Adept before you has fallen here. You will join them in oblivion.',
  },
];

const padHouseNum = (houseNum: number): string => String(houseNum).padStart(2, '0');

const getPhaseConfig = (houseNum: number): EnemyPhase => {
  const phase = ENEMY_PHASES.find(({ range }) => houseNum >= range[0] && houseNum <= range[1]);
  if (!phase) {
    return ENEMY_PHASES[0]!;
  }
  return phase;
};

const createEnemyDialogue = (houseNum: number): DialogueTree => {
  const padded = padHouseNum(houseNum);
  const encounterId = `house-${padded}`;
  const config = getPhaseConfig(houseNum);

  return {
    id: `${encounterId}-enemy`,
    name: `House ${houseNum} Defender`,
    startNodeId: 'intro',
    nodes: [
      {
        id: 'intro',
        speaker: config.speaker,
        text: config.intro(houseNum),
        portrait: config.portrait,
        nextNodeId: 'threat',
      },
      {
        id: 'threat',
        speaker: config.speaker,
        text: config.threat(houseNum),
        portrait: config.portrait,
        effects: { startBattle: encounterId } as const,
      },
    ],
  };
};

export const HOUSE_ENEMY_DIALOGUES: Record<string, DialogueTree> = Array.from({ length: 30 }, (_, index) => index + 1)
  .map(createEnemyDialogue)
  .reduce<Record<string, DialogueTree>>((map, dialogue) => {
    map[dialogue.id] = dialogue;
    return map;
  }, {});
