"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENCOUNTER_TO_POST_BATTLE_DIALOGUE = exports.POST_BATTLE_DIALOGUES = exports.HOUSE_06_POST_BATTLE_DIALOGUE = exports.HOUSE_05_POST_BATTLE_DIALOGUE = exports.HOUSE_04_POST_BATTLE_DIALOGUE = exports.HOUSE_03_POST_BATTLE_DIALOGUE = exports.HOUSE_02_POST_BATTLE_DIALOGUE = exports.HOUSE_01_POST_BATTLE_DIALOGUE = void 0;
/**
 * Post-battle dialogues that play after liberation encounters.
 * These are separate from pre-battle dialogues to allow clean state transitions:
 * pre-battle dialogue → battle → rewards → post-battle dialogue → recruitment
 */
exports.HOUSE_01_POST_BATTLE_DIALOGUE = {
    id: 'house-01-post-battle',
    name: 'House 1 Liberation Complete',
    startNodeId: 'wolf-freed',
    nodes: [
        {
            id: 'wolf-freed',
            speaker: 'Isaac',
            text: "The wolf... it's free! The shadow has lifted.",
            portrait: 'isaac',
            nextNodeId: 'garet-intro',
        },
        {
            id: 'garet-intro',
            speaker: 'War Mage',
            text: "That was impressive! I'm a War Mage. Mind if I join you?",
            portrait: 'garet',
            nextNodeId: 'isaac-response',
        },
        {
            id: 'isaac-response',
            speaker: 'Isaac',
            text: "We could use your strength. Welcome to the team!",
            portrait: 'isaac',
            effects: {
                recruitUnit: "war-mage",
                grantDjinn: "forge",
            },
        },
    ],
};
exports.HOUSE_02_POST_BATTLE_DIALOGUE = {
    id: 'house-02-post-battle',
    name: 'House 2 Liberation Complete',
    startNodeId: 'bear-freed',
    nodes: [
        {
            id: 'bear-freed',
            speaker: 'Isaac',
            text: "Another creature saved. We're making progress.",
            portrait: 'isaac',
            nextNodeId: 'mystic-join',
        },
        {
            id: 'mystic-join',
            speaker: 'Mystic',
            text: "I see your cause is just. I will lend you my Mercury Psynergy.",
            portrait: 'mystic',
            effects: {
                recruitUnit: "mystic",
            },
        },
    ],
};
exports.HOUSE_03_POST_BATTLE_DIALOGUE = {
    id: 'house-03-post-battle',
    name: 'House 3 Liberation Complete',
    startNodeId: 'hawk-freed',
    nodes: [
        {
            id: 'hawk-freed',
            speaker: 'Isaac',
            text: 'The hawk is free! Its strength is returning.',
            portrait: 'isaac',
            nextNodeId: 'ranger-join',
        },
        {
            id: 'ranger-join',
            speaker: 'Ranger',
            text: "You fight well. My arrows are yours.",
            portrait: 'ranger',
            effects: {
                recruitUnit: "ranger",
            },
        },
    ],
};
exports.HOUSE_04_POST_BATTLE_DIALOGUE = {
    id: 'house-04-post-battle',
    name: 'House 4 Liberation Complete',
    startNodeId: 'lion-freed',
    nodes: [
        {
            id: 'lion-freed',
            speaker: 'Isaac',
            text: 'A mighty lion, restored. The darkness is weakening.',
            portrait: 'isaac',
        },
    ],
};
exports.HOUSE_05_POST_BATTLE_DIALOGUE = {
    id: 'house-05-post-battle',
    name: 'House 5 Liberation Complete',
    startNodeId: 'dragon-freed',
    nodes: [
        {
            id: 'dragon-freed',
            speaker: 'Isaac',
            text: 'The dragon is free! All five houses have been liberated.',
            portrait: 'isaac',
        },
    ],
};
exports.HOUSE_06_POST_BATTLE_DIALOGUE = {
    id: 'house-06-post-battle',
    name: 'House 6 Liberation Complete',
    startNodeId: 'house-6-freed',
    nodes: [
        {
            id: 'house-6-freed',
            speaker: 'Isaac',
            text: 'The sixth house is clear. We have done it.',
            portrait: 'isaac',
        },
    ],
};
exports.POST_BATTLE_DIALOGUES = {
    'house-01-post-battle': exports.HOUSE_01_POST_BATTLE_DIALOGUE,
    'house-02-post-battle': exports.HOUSE_02_POST_BATTLE_DIALOGUE,
    'house-03-post-battle': exports.HOUSE_03_POST_BATTLE_DIALOGUE,
    'house-04-post-battle': exports.HOUSE_04_POST_BATTLE_DIALOGUE,
    'house-05-post-battle': exports.HOUSE_05_POST_BATTLE_DIALOGUE,
    'house-06-post-battle': exports.HOUSE_06_POST_BATTLE_DIALOGUE,
};
/**
 * Maps encounter IDs to their post-battle dialogue IDs.
 * Checked by App.tsx after battle completion to trigger celebration dialogues.
 */
exports.ENCOUNTER_TO_POST_BATTLE_DIALOGUE = {
    'house-01': 'house-01-post-battle',
    'house-02': 'house-02-post-battle',
    'house-03': 'house-03-post-battle',
    'house-04': 'house-04-post-battle',
    'house-05': 'house-05-post-battle',
    'house-06': 'house-06-post-battle',
};
