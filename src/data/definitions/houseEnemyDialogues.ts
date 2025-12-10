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

const ENEMY_OVERRIDES: Record<number, Partial<EnemyPhase>> = {
  // BOSS FLOOR: House 10 - Stone Captain (first major boss)
  10: {
    speaker: 'Stone Captain',
    portrait: 'enemy-boss',
    intro: () => '*steps forward, armor gleaming* So... you\'ve cleared nine houses. The scouts whispered of an Adept with fire in their heart.',
    threat: () => 'I am the Stone Captain—the first TRUE test of your resolve. Many have reached me. NONE have passed. Prepare yourself!',
  },
  // BOSS FLOOR: House 20 - Vale Overseer (Chapter 1 final boss)
  20: {
    speaker: 'The Vale Overseer',
    portrait: 'enemy-overseer',
    intro: () => '*rises from dark throne* At last... the one who shattered my army stands before me. I have watched your every battle, studied your every weakness.',
    threat: () => 'I am the Overseer—master of Vale, commander of shadows! You think nineteen victories make you strong? I will show you the TRUE meaning of power!',
  },
  21: {
    intro: () => 'The Risen Dead shall claim your souls! House 21 is their doorway.',
    threat: () => 'Your breaths are numbered. The grave is patient.',
  },
  22: {
    intro: () => 'Wings of fury circle above House 22. Can you even reach us?',
    threat: () => 'We strike from the sky; you fall from the earth.',
  },
  23: {
    intro: () => 'Clay and iron bar your path at House 23. We do not bend.',
    threat: () => 'Stone breaks bone. Yours will be next.',
  },
  24: {
    intro: () => 'House 24 is frozen shut. Only the worthy break the ice.',
    threat: () => 'Winter never tires. You will.',
  },
  25: {
    intro: () => 'Tempest Heights roar at House 25. The gale tests all challengers.',
    threat: () => 'The storm shows no mercy—and neither do I.',
  },
  26: {
    intro: () => 'Necromantic rites already began at House 26. You are late.',
    threat: () => 'Join the ceremony as guests… or as fuel.',
  },
  27: {
    intro: () => 'Crystal convergence peaks at House 27. Shatter or be shattered.',
    threat: () => 'Try to crack us; you will only cut yourselves.',
  },
  28: {
    intro: () => 'Dragons converge at House 28. Few live to tell of it.',
    threat: () => 'You face the apex. Pray your defenses hold.',
  },
  29: {
    intro: () => 'The Void Armada anchors at House 29. Seas and storms obey me.',
    threat: () => 'Drown, be torn by lightning, or flee. Those are your choices.',
  },
  // BOSS FLOOR: House 30 - The Nexus Guardian (Chapter 2 final boss)
  30: {
    speaker: 'The Nexus Guardian',
    portrait: 'enemy-nexus-boss',
    intro: () => '*all four elements swirl violently* You... you actually made it. The Overseer. The Titans. The Archons. All fallen before you.',
    threat: () => 'I am the Nexus Guardian—the convergence of ALL Psynergy! Earth, fire, water, wind—they are ONE within me! This is where your legend ENDS!',
  },
};

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
  const override = ENEMY_OVERRIDES[houseNum];
  const introText = override?.intro ? override.intro(houseNum) : config.intro(houseNum);
  const threatText = override?.threat ? override.threat(houseNum) : config.threat(houseNum);

  return {
    id: `${encounterId}-enemy`,
    name: `House ${houseNum} Defender`,
    startNodeId: 'intro',
    nodes: [
      {
        id: 'intro',
        speaker: config.speaker,
        text: introText,
        portrait: config.portrait,
        nextNodeId: 'threat',
      },
      {
        id: 'threat',
        speaker: config.speaker,
        text: threatText,
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
