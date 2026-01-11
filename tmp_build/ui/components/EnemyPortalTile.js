"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnemyPortalTile = EnemyPortalTile;
const jsx_runtime_1 = require("preact/jsx-runtime");
const encounters_1 = require("@/data/definitions/encounters");
const enemies_1 = require("@/data/definitions/enemies");
const mappings_1 = require("../sprites/mappings");
const SimpleSprite_1 = require("../sprites/SimpleSprite");
function EnemyPortalTile({ encounterId }) {
    const encounter = encounters_1.ENCOUNTERS[encounterId];
    if (!encounter) {
        return ((0, jsx_runtime_1.jsx)("div", { class: "enemies-section", children: (0, jsx_runtime_1.jsxs)("div", { class: "enemy-portal", children: [(0, jsx_runtime_1.jsx)("div", { class: "portal-title", children: "ENEMIES" }), (0, jsx_runtime_1.jsx)("div", { class: "portal-enemies", children: "Unknown" })] }) }));
    }
    // Get enemy names from encounter
    const enemyNames = encounter.enemies
        .map((enemyId) => {
        const enemy = enemies_1.ENEMIES[enemyId];
        return enemy?.name || enemyId;
    })
        .join(' • ');
    const enemyEntries = encounter.enemies.map((enemyId) => {
        const enemy = enemies_1.ENEMIES[enemyId];
        return {
            id: enemyId,
            name: enemy?.name ?? enemyId,
            spriteId: (0, mappings_1.getEnemyBattleSprite)(enemyId, 'idle'),
        };
    });
    return ((0, jsx_runtime_1.jsx)("div", { class: "enemies-section", children: (0, jsx_runtime_1.jsxs)("div", { class: "enemy-portal", children: [(0, jsx_runtime_1.jsx)("div", { class: "portal-icon", children: "\u2694\uFE0F" }), (0, jsx_runtime_1.jsx)("div", { class: "portal-title", children: "ENEMIES" }), (0, jsx_runtime_1.jsx)("div", { class: "portal-enemies", children: enemyNames || 'None' }), (0, jsx_runtime_1.jsx)("div", { class: "enemy-portraits", children: enemyEntries.map((entry) => ((0, jsx_runtime_1.jsxs)("div", { class: "enemy-portrait-chip", children: [entry.spriteId ? ((0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: entry.spriteId, width: 36, height: 36, alt: entry.name })) : ((0, jsx_runtime_1.jsx)("div", { class: "enemy-portrait-fallback", children: "?" })), (0, jsx_runtime_1.jsx)("span", { children: entry.name })] }, entry.id))) })] }) }));
}
