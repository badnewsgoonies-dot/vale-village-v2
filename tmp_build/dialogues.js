"use strict";
// Added flint-intro NPC dialogue and moved Djinn intro into House 1
// Minimal, self-contained dialogue trees to be wired into maps/overworld logic.
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIALOGUE_TREES = void 0;
exports.DIALOGUE_TREES = {
    // Flint intro: short friendly tutor-like NPC
    "flint_intro": [
        { speaker: "Flint", text: "Hey! You must be new around here. I'm Flint — handy with a hammer and a good story." },
        { speaker: "Player", text: "Nice to meet you. What do you do here?" },
        { speaker: "Flint", text: "I keep the fires going and mend what needs mending. If you need a tip: look for patterns in the stones." }
    ],
    // Djinn intro moved to House 1 (will be triggered when entering house 1)
    "djinn_intro_house1": [
        { speaker: "Djinn", text: "Who awakens the slumbering Djinn in this humble house?" },
        { speaker: "Player", text: "I... didn't mean to. Who are you?" },
        { speaker: "Djinn", text: "Names are chains. Suffice to say your path just grew more interesting." }
    ]
};
exports.default = exports.DIALOGUE_TREES;
