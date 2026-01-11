"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompendiumScreen = CompendiumScreen;
const jsx_runtime_1 = require("preact/jsx-runtime");
const hooks_1 = require("preact/hooks");
const units_1 = require("@/data/definitions/units");
const equipment_1 = require("@/data/definitions/equipment");
const djinn_1 = require("@/data/definitions/djinn");
const enemies_1 = require("@/data/definitions/enemies");
const abilities_1 = require("@/data/definitions/abilities");
const djinnAbilities_1 = require("@/data/definitions/djinnAbilities");
const SimpleSprite_1 = require("../sprites/SimpleSprite");
const mappings_1 = require("../sprites/mappings");
const warnIfPlaceholderSprite_1 = require("../sprites/utils/warnIfPlaceholderSprite");
const EquipmentIcon_1 = require("./EquipmentIcon");
require("./CompendiumScreen.css");
const contentAvailability_1 = require("../utils/contentAvailability");
// Boss enemy IDs - from the "BOSS ENEMIES" section in enemies.ts
const BOSS_ENEMY_IDS = new Set([
    'mars-sprite',
    'mercury-sprite',
    'venus-sprite',
    'chimera',
    'overseer',
]);
const COMPENDIUM_NPCS = [
    { id: 'elder', name: 'Elder', role: 'Village Elder', location: 'Vale Village', sprite: '/sprites/overworld/majornpcs/Elder.gif' },
    { id: 'dora', name: 'Dora', role: "Isaac's Mother", location: 'Vale Village', sprite: '/sprites/overworld/majornpcs/Dora.gif' },
    { id: 'kyle', name: 'Kyle', role: "Isaac's Father", location: 'Vale Village', sprite: '/sprites/overworld/majornpcs/Kyle.gif' },
    { id: 'kraden', name: 'Kraden', role: 'Scholar', location: 'Vale Village', sprite: '/sprites/overworld/majornpcs/fallen_Kraden.gif' },
    { id: 'lord-hammet', name: 'Lord Hammet', role: 'Merchant Lord', location: 'Kalay', sprite: '/sprites/overworld/majornpcs/Lord_Hammet.gif' },
    { id: 'lady-layana', name: 'Lady Layana', role: 'Hammet\'s Wife', location: 'Kalay', sprite: '/sprites/overworld/majornpcs/Lady_Layana.gif' },
    { id: 'lord-mccoy', name: 'Lord McCoy', role: 'Town Leader', location: 'Tolbi', sprite: '/sprites/overworld/majornpcs/Lord_McCoy.gif' },
    { id: 'lady-mccoy', name: 'Lady McCoy', role: 'McCoy\'s Wife', location: 'Tolbi', sprite: '/sprites/overworld/majornpcs/Lady_McCoy.gif' },
    { id: 'sean', name: 'Sean', role: 'Merchant', location: 'Xian', sprite: '/sprites/overworld/majornpcs/Sean.gif' },
    { id: 'ouranos', name: 'Ouranos', role: 'Sage', location: 'Lemuria', sprite: '/sprites/overworld/majornpcs/Ouranos.gif' },
    { id: 'wise-one', name: 'The Wise One', role: 'Guardian', location: 'Mt. Aleph', sprite: '/sprites/overworld/majornpcs/Wise_One.gif' },
    { id: 'tret', name: 'Tret', role: 'Holy Tree', location: 'Kolima Forest', sprite: '/sprites/overworld/majornpcs/Tret_Awake.gif' },
    { id: 'laurel', name: 'Laurel', role: 'Sacred Tree', location: 'Kolima Forest', sprite: '/sprites/overworld/majornpcs/Laurel_Awake.gif' },
    { id: 'susa', name: 'Susa', role: 'Warrior', location: 'Izumo', sprite: '/sprites/overworld/majornpcs/Susa.gif' },
    { id: 'master-poi', name: 'Master Poi', role: 'Martial Arts Master', location: 'Xian', sprite: '/sprites/overworld/majornpcs/Master_Poi.gif' },
    { id: 'fiezhi', name: 'Fiezhi', role: 'Warrior Monk', location: 'Xian', sprite: '/sprites/overworld/majornpcs/Fiezhi.gif' },
    { id: 'prox-elder', name: 'Prox Elder', role: 'Prox Village Leader', location: 'Prox', sprite: '/sprites/overworld/majornpcs/Prox_Elder.gif' },
    { id: 'briggs', name: 'Briggs', role: 'Pirate Captain', location: 'Champa', sprite: '/sprites/overworld/majornpcs/Briggs.gif' },
    { id: 'akafubu', name: 'Akafubu', role: 'Witch Doctor', location: 'Kibombo', sprite: '/sprites/overworld/majornpcs/Akafubu.gif' },
    { id: 'kaja', name: 'Kaja', role: 'Shaman', location: 'Shaman Village', sprite: '/sprites/overworld/majornpcs/Kaja.gif' },
    { id: 'maha', name: 'Maha', role: 'Spirit Medium', location: 'Garoh', sprite: '/sprites/overworld/majornpcs/Maha.gif' },
    { id: 'puelle', name: 'Puelle', role: 'Sunshine\'s Companion', location: 'Contigo', sprite: '/sprites/overworld/majornpcs/Puelle.gif' },
    { id: 'sunshine', name: 'Sunshine', role: 'Oracle', location: 'Contigo', sprite: '/sprites/overworld/majornpcs/Sunshine.gif' },
    { id: 'sea-captain', name: 'Sea Captain', role: 'Ship Captain', location: 'Ports', sprite: '/sprites/overworld/majornpcs/Sea_Captain.gif' },
    { id: 'dojo-leader', name: 'Dojo Leader', role: 'Combat Instructor', location: 'Various', sprite: '/sprites/overworld/majornpcs/Dojo_Leader.gif' },
    { id: 'great-healer', name: 'Great Healer', role: 'Master Healer', location: 'Sanctums', sprite: '/sprites/overworld/majornpcs/Great_Healer.gif' },
    { id: 'fortune-teller', name: 'Fortune Teller', role: 'Seer', location: 'Various', sprite: '/sprites/overworld/majornpcs/Fortune_Teller.gif' },
    { id: 'weaponshop-keeper', name: 'Weapon Merchant', role: 'Shop Keeper', location: 'Various', sprite: '/sprites/overworld/majornpcs/Weaponshop_Keeper.gif' },
    { id: 'armorshop-keeper', name: 'Armor Merchant', role: 'Shop Keeper', location: 'Various', sprite: '/sprites/overworld/majornpcs/Armorshop_Keeper.gif' },
    { id: 'innkeeper', name: 'Innkeeper', role: 'Inn Owner', location: 'Various', sprite: '/sprites/overworld/majornpcs/Innkeeper.gif' },
];
function CompendiumScreen({ onClose }) {
    const [activeTab, setActiveTab] = (0, hooks_1.useState)('units');
    const [selectedUnitId, setSelectedUnitId] = (0, hooks_1.useState)(null);
    const [selectedDjinnId, setSelectedDjinnId] = (0, hooks_1.useState)(null);
    const campaignUnits = Object.values(units_1.UNIT_DEFINITIONS).filter(contentAvailability_1.isAvailableInCampaign);
    const campaignEquipment = Object.values(equipment_1.EQUIPMENT).filter(contentAvailability_1.isAvailableInCampaign);
    const campaignDjinn = Object.values(djinn_1.DJINN).filter(contentAvailability_1.isAvailableInCampaign);
    const tabs = [
        { id: 'units', label: 'Units' },
        { id: 'equipment', label: 'Equipment' },
        { id: 'djinn', label: 'Djinn' },
        { id: 'enemies', label: 'Enemies' },
        { id: 'bosses', label: 'Bosses' },
        { id: 'npcs', label: 'NPCs' },
    ];
    (0, hooks_1.useEffect)(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                if (selectedUnitId || selectedDjinnId) {
                    setSelectedUnitId(null);
                    setSelectedDjinnId(null);
                }
                else {
                    onClose();
                }
                return;
            }
            // Arrow key navigation between tabs
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                if (selectedUnitId || selectedDjinnId)
                    return; // Don't navigate tabs when viewing details
                event.preventDefault();
                event.stopPropagation();
                const currentIndex = tabs.findIndex((t) => t.id === activeTab);
                if (event.key === 'ArrowLeft') {
                    const newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
                    const newTab = tabs[newIndex];
                    if (newTab) {
                        setActiveTab(newTab.id);
                    }
                }
                else {
                    const newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
                    const newTab = tabs[newIndex];
                    if (newTab) {
                        setActiveTab(newTab.id);
                    }
                }
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [activeTab, tabs, onClose, selectedUnitId, selectedDjinnId]);
    // Filter enemies into regular and boss
    const regularEnemies = Object.values(enemies_1.ENEMIES).filter((enemy) => !BOSS_ENEMY_IDS.has(enemy.id));
    const bossEnemies = Object.values(enemies_1.ENEMIES).filter((enemy) => BOSS_ENEMY_IDS.has(enemy.id));
    return ((0, jsx_runtime_1.jsx)("div", { class: "compendium-overlay", onClick: onClose, children: (0, jsx_runtime_1.jsxs)("div", { class: "compendium-container", onClick: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsxs)("div", { class: "compendium-header", children: [(0, jsx_runtime_1.jsx)("h1", { children: "Compendium" }), (0, jsx_runtime_1.jsx)("button", { class: "close-btn", onClick: onClose, "aria-label": "Close compendium", children: "\u00D7" })] }), (0, jsx_runtime_1.jsx)("div", { class: "compendium-tabs", children: tabs.map((tab) => ((0, jsx_runtime_1.jsx)("button", { class: `compendium-tab ${activeTab === tab.id ? 'active' : ''}`, onClick: () => {
                            setActiveTab(tab.id);
                            setSelectedUnitId(null);
                            setSelectedDjinnId(null);
                        }, children: tab.label }, tab.id))) }), (0, jsx_runtime_1.jsxs)("div", { class: "compendium-content", children: [activeTab === 'units' && ((0, jsx_runtime_1.jsxs)("div", { class: "compendium-section", children: [(0, jsx_runtime_1.jsxs)("h2", { children: ["Recruitable Units (", campaignUnits.length, ")"] }), selectedUnitId ? ((0, jsx_runtime_1.jsx)(UnitDetailView, { unitId: selectedUnitId, onBack: () => setSelectedUnitId(null) })) : ((0, jsx_runtime_1.jsx)("div", { class: "compendium-grid", children: campaignUnits.map((unit) => ((0, jsx_runtime_1.jsxs)("div", { class: "compendium-item clickable", onClick: () => setSelectedUnitId(unit.id), children: [(0, jsx_runtime_1.jsx)("div", { class: "item-sprite", children: (0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: (0, mappings_1.getPortraitSprite)(unit.id), width: 64, height: 64, style: { borderRadius: '8px' } }) }), (0, jsx_runtime_1.jsx)("div", { class: "item-name", children: unit.name }), (0, jsx_runtime_1.jsxs)("div", { class: "item-details", children: [(0, jsx_runtime_1.jsxs)("div", { children: ["Element: ", unit.element] }), (0, jsx_runtime_1.jsxs)("div", { children: ["Role: ", unit.role] }), (0, jsx_runtime_1.jsxs)("div", { children: ["Level 1 HP: ", unit.baseStats.hp] }), (0, jsx_runtime_1.jsx)("div", { class: "click-hint", children: "Click for details" })] })] }, unit.id))) }))] })), activeTab === 'equipment' && ((0, jsx_runtime_1.jsxs)("div", { class: "compendium-section", children: [(0, jsx_runtime_1.jsxs)("h2", { children: ["Equipment (", campaignEquipment.length, ")"] }), (0, jsx_runtime_1.jsx)("div", { class: "compendium-grid", children: campaignEquipment.map((equip) => {
                                        const ability = equip.unlocksAbility ? abilities_1.ABILITIES[equip.unlocksAbility] : null;
                                        return ((0, jsx_runtime_1.jsxs)("div", { class: "compendium-item detailed", children: [(0, jsx_runtime_1.jsx)("div", { class: "item-sprite", children: (0, jsx_runtime_1.jsx)(EquipmentIcon_1.EquipmentIcon, { equipment: equip, size: "large" }) }), (0, jsx_runtime_1.jsx)("div", { class: "item-name", children: equip.name }), (0, jsx_runtime_1.jsxs)("div", { class: "item-details", children: [(0, jsx_runtime_1.jsxs)("div", { class: "detail-row", children: [(0, jsx_runtime_1.jsx)("span", { class: "detail-label", children: "Slot:" }), (0, jsx_runtime_1.jsx)("span", { class: "detail-value", children: equip.slot })] }), (0, jsx_runtime_1.jsxs)("div", { class: "detail-row", children: [(0, jsx_runtime_1.jsx)("span", { class: "detail-label", children: "Tier:" }), (0, jsx_runtime_1.jsx)("span", { class: "detail-value", children: equip.tier })] }), (0, jsx_runtime_1.jsxs)("div", { class: "detail-row", children: [(0, jsx_runtime_1.jsx)("span", { class: "detail-label", children: "Cost:" }), (0, jsx_runtime_1.jsxs)("span", { class: "detail-value", children: [equip.cost, " gold"] })] }), equip.statBonus && ((0, jsx_runtime_1.jsxs)("div", { class: "detail-row", children: [(0, jsx_runtime_1.jsx)("span", { class: "detail-label", children: "Stats:" }), (0, jsx_runtime_1.jsx)("span", { class: "detail-value", children: Object.entries(equip.statBonus)
                                                                        .map(([stat, val]) => `${stat.toUpperCase()}+${val}`)
                                                                        .join(', ') })] })), equip.allowedElements && equip.allowedElements.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { class: "detail-row", children: [(0, jsx_runtime_1.jsx)("span", { class: "detail-label", children: "Elements:" }), (0, jsx_runtime_1.jsx)("span", { class: "detail-value", children: equip.allowedElements.join(', ') })] })), ability && ((0, jsx_runtime_1.jsxs)("div", { class: "ability-section", children: [(0, jsx_runtime_1.jsxs)("div", { class: "ability-header-with-icon", children: [(0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: (0, mappings_1.getAbilityIconSprite)(ability.id), width: 24, height: 24 }), (0, jsx_runtime_1.jsx)("div", { class: "ability-name", children: ability.name })] }), (0, jsx_runtime_1.jsx)("div", { class: "ability-description", children: ability.description }), (0, jsx_runtime_1.jsxs)("div", { class: "ability-stats", children: [ability.type && (0, jsx_runtime_1.jsxs)("span", { children: ["Type: ", ability.type] }), ability.manaCost !== undefined && ability.manaCost > 0 && ((0, jsx_runtime_1.jsxs)("span", { children: ["Mana: ", ability.manaCost] })), ability.basePower !== undefined && ability.basePower > 0 && ((0, jsx_runtime_1.jsxs)("span", { children: ["Power: ", ability.basePower] })), ability.targets && (0, jsx_runtime_1.jsxs)("span", { children: ["Target: ", ability.targets] })] })] }))] })] }, equip.id));
                                    }) })] })), activeTab === 'djinn' && ((0, jsx_runtime_1.jsxs)("div", { class: "compendium-section", children: [(0, jsx_runtime_1.jsxs)("h2", { children: ["Djinn (", campaignDjinn.length, ")"] }), selectedDjinnId ? ((0, jsx_runtime_1.jsx)(DjinnDetailView, { djinnId: selectedDjinnId, onBack: () => setSelectedDjinnId(null) })) : ((0, jsx_runtime_1.jsx)("div", { class: "compendium-grid", children: campaignDjinn.map((djinn) => {
                                        const elementLower = djinn.element.toLowerCase();
                                        return ((0, jsx_runtime_1.jsxs)("div", { class: "compendium-item clickable", onClick: () => setSelectedDjinnId(djinn.id), children: [(0, jsx_runtime_1.jsx)("div", { class: "item-sprite", children: (0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: `${elementLower}-djinn-front`, width: 64, height: 64 }) }), (0, jsx_runtime_1.jsx)("div", { class: "item-name", children: djinn.name }), (0, jsx_runtime_1.jsxs)("div", { class: "item-details", children: [(0, jsx_runtime_1.jsxs)("div", { children: ["Element: ", djinn.element] }), (0, jsx_runtime_1.jsxs)("div", { children: ["Tier: ", djinn.tier] }), (0, jsx_runtime_1.jsxs)("div", { children: ["Summon: ", djinn.summonEffect.type] }), (0, jsx_runtime_1.jsx)("div", { class: "click-hint", children: "Click for ability network" })] })] }, djinn.id));
                                    }) }))] })), activeTab === 'enemies' && ((0, jsx_runtime_1.jsxs)("div", { class: "compendium-section", children: [(0, jsx_runtime_1.jsxs)("h2", { children: ["Enemies (", regularEnemies.length, ")"] }), (0, jsx_runtime_1.jsx)("div", { class: "compendium-grid", children: regularEnemies.map((enemy) => {
                                        return ((0, jsx_runtime_1.jsxs)("div", { class: "compendium-item detailed", children: [(0, jsx_runtime_1.jsx)("div", { class: "item-sprite", children: (() => {
                                                        const enemySpriteId = (0, mappings_1.getEnemyBattleSprite)(enemy.id, 'idle') ??
                                                            `missing-compendium-enemy-${enemy.id}`;
                                                        (0, warnIfPlaceholderSprite_1.warnIfPlaceholderSprite)('CompendiumScreen', enemySpriteId);
                                                        return ((0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: enemySpriteId, width: 64, height: 64 }));
                                                    })() }), (0, jsx_runtime_1.jsx)("div", { class: "item-name", children: enemy.name }), (0, jsx_runtime_1.jsxs)("div", { class: "item-details", children: [(0, jsx_runtime_1.jsxs)("div", { class: "detail-row", children: [(0, jsx_runtime_1.jsx)("span", { class: "detail-label", children: "Element:" }), (0, jsx_runtime_1.jsx)("span", { class: "detail-value", children: enemy.element })] }), (0, jsx_runtime_1.jsxs)("div", { class: "detail-row", children: [(0, jsx_runtime_1.jsx)("span", { class: "detail-label", children: "Level:" }), (0, jsx_runtime_1.jsx)("span", { class: "detail-value", children: enemy.level })] }), (0, jsx_runtime_1.jsxs)("div", { class: "stats-grid", children: [(0, jsx_runtime_1.jsxs)("div", { children: ["HP: ", enemy.stats.hp] }), (0, jsx_runtime_1.jsxs)("div", { children: ["ATK: ", enemy.stats.atk] }), (0, jsx_runtime_1.jsxs)("div", { children: ["DEF: ", enemy.stats.def] }), (0, jsx_runtime_1.jsxs)("div", { children: ["MAG: ", enemy.stats.mag] }), (0, jsx_runtime_1.jsxs)("div", { children: ["SPD: ", enemy.stats.spd] })] }), enemy.abilities && enemy.abilities.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { class: "ability-section", children: [(0, jsx_runtime_1.jsx)("div", { class: "ability-header", children: "Abilities:" }), enemy.abilities.map((abilityRef, idx) => {
                                                                    const ability = abilities_1.ABILITIES[abilityRef.id];
                                                                    if (!ability)
                                                                        return null;
                                                                    return ((0, jsx_runtime_1.jsxs)("div", { class: "ability-item", children: [(0, jsx_runtime_1.jsxs)("div", { class: "ability-header-with-icon", children: [(0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: (0, mappings_1.getAbilityIconSprite)(ability.id), width: 24, height: 24 }), (0, jsx_runtime_1.jsx)("div", { class: "ability-name", children: ability.name })] }), (0, jsx_runtime_1.jsx)("div", { class: "ability-description", children: ability.description }), (0, jsx_runtime_1.jsxs)("div", { class: "ability-stats", children: [ability.type && (0, jsx_runtime_1.jsxs)("span", { children: ["Type: ", ability.type] }), ability.manaCost !== undefined && ability.manaCost > 0 && ((0, jsx_runtime_1.jsxs)("span", { children: ["Mana: ", ability.manaCost] })), ability.basePower !== undefined && ability.basePower > 0 && ((0, jsx_runtime_1.jsxs)("span", { children: ["Power: ", ability.basePower] }))] })] }, idx));
                                                                })] })), (0, jsx_runtime_1.jsxs)("div", { class: "detail-row", children: [(0, jsx_runtime_1.jsx)("span", { class: "detail-label", children: "XP:" }), (0, jsx_runtime_1.jsx)("span", { class: "detail-value", children: enemy.baseXp })] }), (0, jsx_runtime_1.jsxs)("div", { class: "detail-row", children: [(0, jsx_runtime_1.jsx)("span", { class: "detail-label", children: "Gold:" }), (0, jsx_runtime_1.jsx)("span", { class: "detail-value", children: enemy.baseGold })] })] })] }, enemy.id));
                                    }) })] })), activeTab === 'bosses' && ((0, jsx_runtime_1.jsxs)("div", { class: "compendium-section", children: [(0, jsx_runtime_1.jsxs)("h2", { children: ["Boss Enemies (", bossEnemies.length, ")"] }), (0, jsx_runtime_1.jsx)("div", { class: "compendium-grid", children: bossEnemies.map((enemy) => {
                                        return ((0, jsx_runtime_1.jsxs)("div", { class: "compendium-item detailed boss", children: [(0, jsx_runtime_1.jsx)("div", { class: "item-sprite", children: (() => {
                                                        const bossSpriteId = (0, mappings_1.getEnemyBattleSprite)(enemy.id, 'idle') ??
                                                            `missing-compendium-enemy-${enemy.id}`;
                                                        (0, warnIfPlaceholderSprite_1.warnIfPlaceholderSprite)('CompendiumScreen', bossSpriteId);
                                                        return ((0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: bossSpriteId, width: 64, height: 64 }));
                                                    })() }), (0, jsx_runtime_1.jsx)("div", { class: "item-name boss-name", children: enemy.name }), (0, jsx_runtime_1.jsxs)("div", { class: "item-details", children: [(0, jsx_runtime_1.jsxs)("div", { class: "detail-row", children: [(0, jsx_runtime_1.jsx)("span", { class: "detail-label", children: "Element:" }), (0, jsx_runtime_1.jsx)("span", { class: "detail-value", children: enemy.element })] }), (0, jsx_runtime_1.jsxs)("div", { class: "detail-row", children: [(0, jsx_runtime_1.jsx)("span", { class: "detail-label", children: "Level:" }), (0, jsx_runtime_1.jsx)("span", { class: "detail-value", children: enemy.level })] }), (0, jsx_runtime_1.jsxs)("div", { class: "stats-grid", children: [(0, jsx_runtime_1.jsxs)("div", { children: ["HP: ", enemy.stats.hp] }), (0, jsx_runtime_1.jsxs)("div", { children: ["ATK: ", enemy.stats.atk] }), (0, jsx_runtime_1.jsxs)("div", { children: ["DEF: ", enemy.stats.def] }), (0, jsx_runtime_1.jsxs)("div", { children: ["MAG: ", enemy.stats.mag] }), (0, jsx_runtime_1.jsxs)("div", { children: ["SPD: ", enemy.stats.spd] })] }), enemy.abilities && enemy.abilities.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { class: "ability-section", children: [(0, jsx_runtime_1.jsx)("div", { class: "ability-header", children: "Abilities:" }), enemy.abilities.map((abilityRef, idx) => {
                                                                    const ability = abilities_1.ABILITIES[abilityRef.id];
                                                                    if (!ability)
                                                                        return null;
                                                                    return ((0, jsx_runtime_1.jsxs)("div", { class: "ability-item", children: [(0, jsx_runtime_1.jsxs)("div", { class: "ability-header-with-icon", children: [(0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: (0, mappings_1.getAbilityIconSprite)(ability.id), width: 24, height: 24 }), (0, jsx_runtime_1.jsx)("div", { class: "ability-name", children: ability.name })] }), (0, jsx_runtime_1.jsx)("div", { class: "ability-description", children: ability.description }), (0, jsx_runtime_1.jsxs)("div", { class: "ability-stats", children: [ability.type && (0, jsx_runtime_1.jsxs)("span", { children: ["Type: ", ability.type] }), ability.manaCost !== undefined && ability.manaCost > 0 && ((0, jsx_runtime_1.jsxs)("span", { children: ["Mana: ", ability.manaCost] })), ability.basePower !== undefined && ability.basePower > 0 && ((0, jsx_runtime_1.jsxs)("span", { children: ["Power: ", ability.basePower] }))] })] }, idx));
                                                                })] })), (0, jsx_runtime_1.jsxs)("div", { class: "detail-row", children: [(0, jsx_runtime_1.jsx)("span", { class: "detail-label", children: "XP:" }), (0, jsx_runtime_1.jsx)("span", { class: "detail-value", children: enemy.baseXp })] }), (0, jsx_runtime_1.jsxs)("div", { class: "detail-row", children: [(0, jsx_runtime_1.jsx)("span", { class: "detail-label", children: "Gold:" }), (0, jsx_runtime_1.jsx)("span", { class: "detail-value", children: enemy.baseGold })] })] })] }, enemy.id));
                                    }) })] })), activeTab === 'npcs' && ((0, jsx_runtime_1.jsxs)("div", { class: "compendium-section", children: [(0, jsx_runtime_1.jsxs)("h2", { children: ["NPCs (", COMPENDIUM_NPCS.length, ")"] }), (0, jsx_runtime_1.jsx)("div", { class: "compendium-grid", children: COMPENDIUM_NPCS.map((npc) => ((0, jsx_runtime_1.jsxs)("div", { class: "compendium-item", children: [(0, jsx_runtime_1.jsx)("div", { class: "item-sprite", children: (0, jsx_runtime_1.jsx)("img", { src: npc.sprite, alt: npc.name, style: { width: 64, height: 64, imageRendering: 'pixelated', objectFit: 'contain' } }) }), (0, jsx_runtime_1.jsx)("div", { class: "item-name", children: npc.name }), (0, jsx_runtime_1.jsxs)("div", { class: "item-details", children: [(0, jsx_runtime_1.jsxs)("div", { class: "detail-row", children: [(0, jsx_runtime_1.jsx)("span", { class: "detail-label", children: "Role:" }), (0, jsx_runtime_1.jsx)("span", { class: "detail-value", children: npc.role })] }), (0, jsx_runtime_1.jsxs)("div", { class: "detail-row", children: [(0, jsx_runtime_1.jsx)("span", { class: "detail-label", children: "Location:" }), (0, jsx_runtime_1.jsx)("span", { class: "detail-value", children: npc.location })] })] })] }, npc.id))) })] }))] })] }) }));
}
// Unit Detail View Component
function UnitDetailView({ unitId, onBack }) {
    const unit = units_1.UNIT_DEFINITIONS[unitId];
    if (!unit)
        return null;
    const statsLv1 = unit.baseStats;
    const statsLv5 = {
        hp: unit.baseStats.hp + (unit.growthRates.hp * 4),
        atk: unit.baseStats.atk + (unit.growthRates.atk * 4),
        def: unit.baseStats.def + (unit.growthRates.def * 4),
        mag: unit.baseStats.mag + (unit.growthRates.mag * 4),
        spd: unit.baseStats.spd + (unit.growthRates.spd * 4),
    };
    const statsLv10 = {
        hp: unit.baseStats.hp + (unit.growthRates.hp * 9),
        atk: unit.baseStats.atk + (unit.growthRates.atk * 9),
        def: unit.baseStats.def + (unit.growthRates.def * 9),
        mag: unit.baseStats.mag + (unit.growthRates.mag * 9),
        spd: unit.baseStats.spd + (unit.growthRates.spd * 9),
    };
    return ((0, jsx_runtime_1.jsxs)("div", { class: "unit-detail-view", children: [(0, jsx_runtime_1.jsx)("button", { class: "back-btn", onClick: onBack, children: "\u2190 Back" }), (0, jsx_runtime_1.jsx)("div", { class: "unit-detail-header", children: (0, jsx_runtime_1.jsxs)("div", { class: "unit-header-with-sprite", children: [(0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: (0, mappings_1.getPortraitSprite)(unit.id), width: 96, height: 96, style: { borderRadius: '12px' } }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { children: unit.name }), (0, jsx_runtime_1.jsxs)("div", { class: "unit-meta", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Element: ", unit.element] }), (0, jsx_runtime_1.jsxs)("span", { children: ["Role: ", unit.role] })] }), unit.description && (0, jsx_runtime_1.jsx)("p", { class: "unit-description", children: unit.description })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { class: "unit-stats-progression", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Stat Progression" }), (0, jsx_runtime_1.jsxs)("div", { class: "stats-table", children: [(0, jsx_runtime_1.jsxs)("div", { class: "stats-row header", children: [(0, jsx_runtime_1.jsx)("div", { children: "Stat" }), (0, jsx_runtime_1.jsx)("div", { children: "Lv 1" }), (0, jsx_runtime_1.jsx)("div", { children: "Lv 5" }), (0, jsx_runtime_1.jsx)("div", { children: "Lv 10" }), (0, jsx_runtime_1.jsx)("div", { children: "Growth/Value" })] }), (0, jsx_runtime_1.jsxs)("div", { class: "stats-row", children: [(0, jsx_runtime_1.jsx)("div", { children: "HP" }), (0, jsx_runtime_1.jsx)("div", { children: statsLv1.hp }), (0, jsx_runtime_1.jsx)("div", { children: statsLv5.hp }), (0, jsx_runtime_1.jsx)("div", { children: statsLv10.hp }), (0, jsx_runtime_1.jsxs)("div", { children: ["+", unit.growthRates.hp, "/lv"] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "stats-row", children: [(0, jsx_runtime_1.jsx)("div", { children: "Mana Contribution" }), (0, jsx_runtime_1.jsx)("div", { children: unit.manaContribution }), (0, jsx_runtime_1.jsx)("div", { children: unit.manaContribution }), (0, jsx_runtime_1.jsx)("div", { children: unit.manaContribution }), (0, jsx_runtime_1.jsx)("div", { children: "Fixed" })] }), (0, jsx_runtime_1.jsxs)("div", { class: "stats-row", children: [(0, jsx_runtime_1.jsx)("div", { children: "ATK" }), (0, jsx_runtime_1.jsx)("div", { children: statsLv1.atk }), (0, jsx_runtime_1.jsx)("div", { children: statsLv5.atk }), (0, jsx_runtime_1.jsx)("div", { children: statsLv10.atk }), (0, jsx_runtime_1.jsxs)("div", { children: ["+", unit.growthRates.atk, "/lv"] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "stats-row", children: [(0, jsx_runtime_1.jsx)("div", { children: "DEF" }), (0, jsx_runtime_1.jsx)("div", { children: statsLv1.def }), (0, jsx_runtime_1.jsx)("div", { children: statsLv5.def }), (0, jsx_runtime_1.jsx)("div", { children: statsLv10.def }), (0, jsx_runtime_1.jsxs)("div", { children: ["+", unit.growthRates.def, "/lv"] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "stats-row", children: [(0, jsx_runtime_1.jsx)("div", { children: "MAG" }), (0, jsx_runtime_1.jsx)("div", { children: statsLv1.mag }), (0, jsx_runtime_1.jsx)("div", { children: statsLv5.mag }), (0, jsx_runtime_1.jsx)("div", { children: statsLv10.mag }), (0, jsx_runtime_1.jsxs)("div", { children: ["+", unit.growthRates.mag, "/lv"] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "stats-row", children: [(0, jsx_runtime_1.jsx)("div", { children: "SPD" }), (0, jsx_runtime_1.jsx)("div", { children: statsLv1.spd }), (0, jsx_runtime_1.jsx)("div", { children: statsLv5.spd }), (0, jsx_runtime_1.jsx)("div", { children: statsLv10.spd }), (0, jsx_runtime_1.jsxs)("div", { children: ["+", unit.growthRates.spd, "/lv"] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "unit-abilities", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Unlockable Abilities" }), (0, jsx_runtime_1.jsx)("div", { class: "abilities-list", children: unit.abilities
                            .sort((a, b) => (a.unlockLevel || 1) - (b.unlockLevel || 1))
                            .map((abilityRef, idx) => {
                            const ability = abilities_1.ABILITIES[abilityRef.id];
                            if (!ability)
                                return null;
                            return ((0, jsx_runtime_1.jsxs)("div", { class: "ability-card", children: [(0, jsx_runtime_1.jsxs)("div", { class: "ability-card-header", children: [(0, jsx_runtime_1.jsxs)("span", { class: "ability-level", children: ["Lv ", abilityRef.unlockLevel || 1] }), (0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: (0, mappings_1.getAbilityIconSprite)(ability.id), width: 32, height: 32 }), (0, jsx_runtime_1.jsx)("span", { class: "ability-name", children: ability.name })] }), (0, jsx_runtime_1.jsx)("div", { class: "ability-description", children: ability.description }), (0, jsx_runtime_1.jsxs)("div", { class: "ability-meta", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Type: ", ability.type] }), ability.element && (0, jsx_runtime_1.jsxs)("span", { children: ["Element: ", ability.element] }), ability.manaCost !== undefined && ability.manaCost > 0 && ((0, jsx_runtime_1.jsxs)("span", { children: ["Mana Cost: ", ability.manaCost] })), ability.basePower !== undefined && ability.basePower > 0 && ((0, jsx_runtime_1.jsxs)("span", { children: ["Power: ", ability.basePower] })), ability.targets && (0, jsx_runtime_1.jsxs)("span", { children: ["Target: ", ability.targets] })] })] }, idx));
                        }) })] })] }));
}
// Djinn Detail View Component - Network Visualization
function DjinnDetailView({ djinnId, onBack }) {
    const djinn = djinn_1.DJINN[djinnId];
    if (!djinn)
        return null;
    // Get all units that can use this Djinn
    const unitIds = Object.keys(djinn.grantedAbilities);
    return ((0, jsx_runtime_1.jsxs)("div", { class: "djinn-detail-view", children: [(0, jsx_runtime_1.jsx)("button", { class: "back-btn", onClick: onBack, children: "\u2190 Back" }), (0, jsx_runtime_1.jsx)("div", { class: "djinn-detail-header", children: (0, jsx_runtime_1.jsxs)("div", { class: "djinn-header-with-sprite", children: [(0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: `${djinn.element.toLowerCase()}-djinn-front`, width: 96, height: 96 }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { children: djinn.name }), (0, jsx_runtime_1.jsxs)("div", { class: "djinn-meta", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Element: ", djinn.element] }), (0, jsx_runtime_1.jsxs)("span", { children: ["Tier: ", djinn.tier] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "summon-effect", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Summon Effect:" }), " ", djinn.summonEffect.description] })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { class: "djinn-ability-network", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Ability Network - Grants to Units" }), (0, jsx_runtime_1.jsx)("div", { class: "network-container", children: unitIds.map((unitId) => {
                            const unit = units_1.UNIT_DEFINITIONS[unitId];
                            if (!unit)
                                return null;
                            const abilityGroup = djinn.grantedAbilities[unitId];
                            if (!abilityGroup)
                                return null;
                            const compatibility = unit.element === djinn.element ? 'same' :
                                (unit.element === 'Venus' && djinn.element === 'Mars') ||
                                    (unit.element === 'Mars' && djinn.element === 'Venus') ||
                                    (unit.element === 'Jupiter' && djinn.element === 'Mercury') ||
                                    (unit.element === 'Mercury' && djinn.element === 'Jupiter') ? 'counter' : 'neutral';
                            return ((0, jsx_runtime_1.jsxs)("div", { class: `network-node ${compatibility}`, children: [(0, jsx_runtime_1.jsxs)("div", { class: "node-header", children: [(0, jsx_runtime_1.jsx)("div", { class: "node-unit-name", children: unit.name }), (0, jsx_runtime_1.jsxs)("div", { class: "node-compatibility", children: [compatibility === 'same' && '✓ Same Element', compatibility === 'counter' && '⚠ Counter Element', compatibility === 'neutral' && '○ Neutral'] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "node-abilities", children: [abilityGroup.same.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { class: "ability-group same-element", children: [(0, jsx_runtime_1.jsx)("div", { class: "group-label", children: "Same Element Abilities:" }), abilityGroup.same.map((abilityId) => {
                                                        const ability = djinnAbilities_1.DJINN_ABILITIES[abilityId];
                                                        if (!ability)
                                                            return null;
                                                        return ((0, jsx_runtime_1.jsxs)("div", { class: "network-ability", children: [(0, jsx_runtime_1.jsxs)("div", { class: "network-ability-header", children: [(0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: (0, mappings_1.getAbilityIconSprite)(abilityId), width: 20, height: 20 }), (0, jsx_runtime_1.jsx)("div", { class: "network-ability-name", children: ability.name })] }), (0, jsx_runtime_1.jsx)("div", { class: "network-ability-desc", children: ability.description }), (0, jsx_runtime_1.jsxs)("div", { class: "network-ability-stats", children: [ability.type && (0, jsx_runtime_1.jsx)("span", { children: ability.type }), ability.manaCost !== undefined && ability.manaCost > 0 && ((0, jsx_runtime_1.jsxs)("span", { children: ["Mana: ", ability.manaCost] })), ability.basePower !== undefined && ability.basePower > 0 && ((0, jsx_runtime_1.jsxs)("span", { children: ["Power: ", ability.basePower] }))] })] }, abilityId));
                                                    })] })), abilityGroup.counter.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { class: "ability-group counter-element", children: [(0, jsx_runtime_1.jsx)("div", { class: "group-label", children: "Counter Element Abilities:" }), abilityGroup.counter.map((abilityId) => {
                                                        const ability = djinnAbilities_1.DJINN_ABILITIES[abilityId];
                                                        if (!ability)
                                                            return null;
                                                        return ((0, jsx_runtime_1.jsxs)("div", { class: "network-ability", children: [(0, jsx_runtime_1.jsxs)("div", { class: "network-ability-header", children: [(0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: (0, mappings_1.getAbilityIconSprite)(abilityId), width: 20, height: 20 }), (0, jsx_runtime_1.jsx)("div", { class: "network-ability-name", children: ability.name })] }), (0, jsx_runtime_1.jsx)("div", { class: "network-ability-desc", children: ability.description }), (0, jsx_runtime_1.jsxs)("div", { class: "network-ability-stats", children: [ability.type && (0, jsx_runtime_1.jsx)("span", { children: ability.type }), ability.manaCost !== undefined && ability.manaCost > 0 && ((0, jsx_runtime_1.jsxs)("span", { children: ["Mana: ", ability.manaCost] })), ability.basePower !== undefined && ability.basePower > 0 && ((0, jsx_runtime_1.jsxs)("span", { children: ["Power: ", ability.basePower] }))] })] }, abilityId));
                                                    })] })), abilityGroup.neutral.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { class: "ability-group neutral-element", children: [(0, jsx_runtime_1.jsx)("div", { class: "group-label", children: "Neutral Abilities:" }), abilityGroup.neutral.map((abilityId) => {
                                                        const ability = djinnAbilities_1.DJINN_ABILITIES[abilityId];
                                                        if (!ability)
                                                            return null;
                                                        return ((0, jsx_runtime_1.jsxs)("div", { class: "network-ability", children: [(0, jsx_runtime_1.jsxs)("div", { class: "network-ability-header", children: [(0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: (0, mappings_1.getAbilityIconSprite)(abilityId), width: 20, height: 20 }), (0, jsx_runtime_1.jsx)("div", { class: "network-ability-name", children: ability.name })] }), (0, jsx_runtime_1.jsx)("div", { class: "network-ability-desc", children: ability.description }), (0, jsx_runtime_1.jsxs)("div", { class: "network-ability-stats", children: [ability.type && (0, jsx_runtime_1.jsx)("span", { children: ability.type }), ability.manaCost !== undefined && ability.manaCost > 0 && ((0, jsx_runtime_1.jsxs)("span", { children: ["Mana: ", ability.manaCost] })), ability.basePower !== undefined && ability.basePower > 0 && ((0, jsx_runtime_1.jsxs)("span", { children: ["Power: ", ability.basePower] }))] })] }, abilityId));
                                                    })] }))] })] }, unitId));
                        }) })] })] }));
}
