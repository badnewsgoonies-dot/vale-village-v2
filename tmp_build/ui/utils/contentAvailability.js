"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAvailableInCampaign = isAvailableInCampaign;
exports.isAvailableInTower = isAvailableInTower;
exports.filterByAvailability = filterByAvailability;
function normalizeAvailability(entry) {
    return entry.availableIn && entry.availableIn.length > 0 ? entry.availableIn : ['campaign'];
}
function isAvailableInCampaign(entry) {
    return normalizeAvailability(entry).includes('campaign');
}
function isAvailableInTower(entry) {
    return normalizeAvailability(entry).includes('tower');
}
function filterByAvailability(items, target) {
    if (target === 'campaign') {
        return items.filter(isAvailableInCampaign);
    }
    return items.filter(isAvailableInTower);
}
