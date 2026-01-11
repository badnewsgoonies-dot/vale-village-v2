"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOUSE_ENEMY_DIALOGUES = void 0;
const ENEMY_PHASES = [
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
];
const padHouseNum = (houseNum) => String(houseNum).padStart(2, '0');
const getPhaseConfig = (houseNum) => {
    const phase = ENEMY_PHASES.find(({ range }) => houseNum >= range[0] && houseNum <= range[1]);
    if (!phase) {
        return ENEMY_PHASES[0];
    }
    return phase;
};
const createEnemyDialogue = (houseNum) => {
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
                effects: { startBattle: encounterId },
            },
        ],
    };
};
exports.HOUSE_ENEMY_DIALOGUES = Array.from({ length: 20 }, (_, index) => index + 1)
    .map(createEnemyDialogue)
    .reduce((map, dialogue) => {
    map[dialogue.id] = dialogue;
    return map;
}, {});
