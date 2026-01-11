"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canMoveTo = canMoveTo;
exports.getTriggerAt = getTriggerAt;
exports.processMovement = processMovement;
function getTile(map, position) {
    const withinX = position.x >= 0 && position.x < map.width;
    const withinY = position.y >= 0 && position.y < map.height;
    if (!withinX || !withinY)
        return undefined;
    const row = map.tiles[position.y];
    if (!row)
        return undefined;
    return row[position.x];
}
function canMoveTo(map, position) {
    const tile = getTile(map, position);
    if (!tile)
        return false;
    if (!tile.walkable)
        return false;
    const npcCollision = map.npcs.find(npc => npc.position.x === position.x && npc.position.y === position.y);
    if (npcCollision) {
        const hasNpcTrigger = map.triggers.some(trigger => trigger.type === 'npc' && trigger.position.x === position.x && trigger.position.y === position.y);
        if (!hasNpcTrigger) {
            return false;
        }
    }
    return true;
}
function getTriggerAt(map, position) {
    return map.triggers.find(trigger => trigger.position.x === position.x && trigger.position.y === position.y);
}
function processMovement(currentMap, currentPos, direction) {
    const delta = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 },
    };
    const nextPos = {
        x: currentPos.x + delta[direction].x,
        y: currentPos.y + delta[direction].y,
    };
    if (!canMoveTo(currentMap, nextPos)) {
        return { newPos: currentPos, blocked: true };
    }
    const trigger = getTriggerAt(currentMap, nextPos);
    return { newPos: nextPos, blocked: false, trigger };
}
