/**
 * CompendiumScreen Component
 * Enhanced with detailed stats, abilities, and descriptions
 */

import { JSX } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { UNIT_DEFINITIONS } from '@/data/definitions/units';
import { EQUIPMENT } from '@/data/definitions/equipment';
import { DJINN } from '@/data/definitions/djinn';
import { ENEMIES } from '@/data/definitions/enemies';
import { ABILITIES } from '@/data/definitions/abilities';
import { DJINN_ABILITIES } from '@/data/definitions/djinnAbilities';
import { SimpleSprite } from '../sprites/SimpleSprite';
import { getEnemyBattleSprite, getPortraitSprite, getAbilityIconSprite } from '../sprites/mappings';
import { warnIfPlaceholderSprite } from '../sprites/utils/warnIfPlaceholderSprite';
import { EquipmentIcon } from './EquipmentIcon';
import './CompendiumScreen.css';
import { isAvailableInCampaign } from '../utils/contentAvailability';

interface CompendiumScreenProps {
  onClose: () => void;
}

type CompendiumTab = 'units' | 'equipment' | 'djinn' | 'enemies' | 'bosses' | 'npcs';

// Boss enemy IDs - from the "BOSS ENEMIES" section in enemies.ts
const BOSS_ENEMY_IDS = new Set([
  'mars-sprite',
  'mercury-sprite',
  'venus-sprite',
  'chimera',
  'overseer',
]);

// NPC data for compendium display
interface NPCData {
  id: string;
  name: string;
  role: string;
  location: string;
  sprite: string;
}

const COMPENDIUM_NPCS: NPCData[] = [
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

export function CompendiumScreen({ onClose }: CompendiumScreenProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<CompendiumTab>('units');
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedDjinnId, setSelectedDjinnId] = useState<string | null>(null);

  const campaignUnits = Object.values(UNIT_DEFINITIONS).filter(isAvailableInCampaign);
  const campaignEquipment = Object.values(EQUIPMENT).filter(isAvailableInCampaign);
  const campaignDjinn = Object.values(DJINN).filter(isAvailableInCampaign);

  const tabs: { id: CompendiumTab; label: string }[] = [
    { id: 'units', label: 'Units' },
    { id: 'equipment', label: 'Equipment' },
    { id: 'djinn', label: 'Djinn' },
    { id: 'enemies', label: 'Enemies' },
    { id: 'bosses', label: 'Bosses' },
    { id: 'npcs', label: 'NPCs' },
  ];

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        if (selectedUnitId || selectedDjinnId) {
          setSelectedUnitId(null);
          setSelectedDjinnId(null);
        } else {
          onClose();
        }
        return;
      }

      // Arrow key navigation between tabs
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        if (selectedUnitId || selectedDjinnId) return; // Don't navigate tabs when viewing details

        event.preventDefault();
        event.stopPropagation();
        const currentIndex = tabs.findIndex((t) => t.id === activeTab);
        if (event.key === 'ArrowLeft') {
          const newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
          const newTab = tabs[newIndex];
          if (newTab) {
            setActiveTab(newTab.id);
          }
        } else {
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
  const regularEnemies = Object.values(ENEMIES).filter(
    (enemy) => !BOSS_ENEMY_IDS.has(enemy.id)
  );
  const bossEnemies = Object.values(ENEMIES).filter((enemy) =>
    BOSS_ENEMY_IDS.has(enemy.id)
  );

  return (
    <div class="compendium-overlay" onClick={onClose}>
      <div class="compendium-container" onClick={(e) => e.stopPropagation()}>
        <div class="compendium-header">
          <h1>Compendium</h1>
          <button class="close-btn" onClick={onClose} aria-label="Close compendium">
            ×
          </button>
        </div>

        <div class="compendium-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              class={`compendium-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedUnitId(null);
                setSelectedDjinnId(null);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div class="compendium-content">
          {activeTab === 'units' && (
            <div class="compendium-section">
              <h2>Recruitable Units ({campaignUnits.length})</h2>
              {selectedUnitId ? (
                <UnitDetailView
                  unitId={selectedUnitId}
                  onBack={() => setSelectedUnitId(null)}
                />
              ) : (
                <div class="compendium-grid">
                  {campaignUnits.map((unit) => (
                    <div
                      key={unit.id}
                      class="compendium-item clickable"
                      onClick={() => setSelectedUnitId(unit.id)}
                    >
                      <div class="item-sprite">
                        <SimpleSprite
                          id={getPortraitSprite(unit.id)}
                          width={64}
                          height={64}
                          style={{ borderRadius: '8px' }}
                        />
                      </div>
                      <div class="item-name">{unit.name}</div>
                      <div class="item-details">
                        <div>Element: {unit.element}</div>
                        <div>Role: {unit.role}</div>
                        <div>Level 1 HP: {unit.baseStats.hp}</div>
                        <div class="click-hint">Click for details</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'equipment' && (
            <div class="compendium-section">
              <h2>Equipment ({campaignEquipment.length})</h2>
              <div class="compendium-grid">
                {campaignEquipment.map((equip) => {
                  const ability = equip.unlocksAbility ? ABILITIES[equip.unlocksAbility] : null;
                  return (
                    <div key={equip.id} class="compendium-item detailed">
                      <div class="item-sprite">
                        <EquipmentIcon equipment={equip} size="large" />
                      </div>
                      <div class="item-name">{equip.name}</div>
                      <div class="item-details">
                        <div class="detail-row">
                          <span class="detail-label">Slot:</span>
                          <span class="detail-value">{equip.slot}</span>
                        </div>
                        <div class="detail-row">
                          <span class="detail-label">Tier:</span>
                          <span class="detail-value">{equip.tier}</span>
                        </div>
                        <div class="detail-row">
                          <span class="detail-label">Cost:</span>
                          <span class="detail-value">{equip.cost} gold</span>
                        </div>
                        {equip.statBonus && (
                          <div class="detail-row">
                            <span class="detail-label">Stats:</span>
                            <span class="detail-value">
                              {Object.entries(equip.statBonus)
                                .map(([stat, val]) => `${stat.toUpperCase()}+${val}`)
                                .join(', ')}
                            </span>
                          </div>
                        )}
                        {equip.allowedElements && equip.allowedElements.length > 0 && (
                          <div class="detail-row">
                            <span class="detail-label">Elements:</span>
                            <span class="detail-value">{equip.allowedElements.join(', ')}</span>
                          </div>
                        )}
                        {ability && (
                          <div class="ability-section">
                            <div class="ability-header-with-icon">
                              <SimpleSprite
                                id={getAbilityIconSprite(ability.id)}
                                width={24}
                                height={24}
                              />
                              <div class="ability-name">{ability.name}</div>
                            </div>
                            <div class="ability-description">{ability.description}</div>
                            <div class="ability-stats">
                              {ability.type && <span>Type: {ability.type}</span>}
                              {ability.manaCost !== undefined && ability.manaCost > 0 && (
                                <span>Mana: {ability.manaCost}</span>
                              )}
                              {ability.basePower !== undefined && ability.basePower > 0 && (
                                <span>Power: {ability.basePower}</span>
                              )}
                              {ability.targets && <span>Target: {ability.targets}</span>}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'djinn' && (
            <div class="compendium-section">
              <h2>Djinn ({campaignDjinn.length})</h2>
              {selectedDjinnId ? (
                <DjinnDetailView
                  djinnId={selectedDjinnId}
                  onBack={() => setSelectedDjinnId(null)}
                />
              ) : (
                <div class="compendium-grid">
                  {campaignDjinn.map((djinn) => {
                    const elementLower = djinn.element.toLowerCase();
                    return (
                      <div
                        key={djinn.id}
                        class="compendium-item clickable"
                        onClick={() => setSelectedDjinnId(djinn.id)}
                      >
                        <div class="item-sprite">
                          <SimpleSprite
                            id={`${elementLower}-djinn-front`}
                            width={64}
                            height={64}
                          />
                        </div>
                        <div class="item-name">{djinn.name}</div>
                        <div class="item-details">
                          <div>Element: {djinn.element}</div>
                          <div>Tier: {djinn.tier}</div>
                          <div>Summon: {djinn.summonEffect.type}</div>
                          <div class="click-hint">Click for ability network</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'enemies' && (
            <div class="compendium-section">
              <h2>Enemies ({regularEnemies.length})</h2>
              <div class="compendium-grid">
                {regularEnemies.map((enemy) => {
                  return (
                    <div key={enemy.id} class="compendium-item detailed">
                      <div class="item-sprite">
                        {(() => {
                          const enemySpriteId =
                            getEnemyBattleSprite(enemy.id, 'idle') ??
                            `missing-compendium-enemy-${enemy.id}`;
                          warnIfPlaceholderSprite('CompendiumScreen', enemySpriteId);
                          return (
                            <SimpleSprite
                              id={enemySpriteId}
                              width={64}
                              height={64}
                            />
                          );
                        })()}
                      </div>
                      <div class="item-name">{enemy.name}</div>
                      <div class="item-details">
                        <div class="detail-row">
                          <span class="detail-label">Element:</span>
                          <span class="detail-value">{enemy.element}</span>
                        </div>
                        <div class="detail-row">
                          <span class="detail-label">Level:</span>
                          <span class="detail-value">{enemy.level}</span>
                        </div>
                        <div class="stats-grid">
                          <div>HP: {enemy.stats.hp}</div>
                          <div>ATK: {enemy.stats.atk}</div>
                          <div>DEF: {enemy.stats.def}</div>
                          <div>MAG: {enemy.stats.mag}</div>
                          <div>SPD: {enemy.stats.spd}</div>
                        </div>
                        {enemy.abilities && enemy.abilities.length > 0 && (
                          <div class="ability-section">
                            <div class="ability-header">Abilities:</div>
                            {enemy.abilities.map((abilityRef, idx) => {
                              const ability = ABILITIES[abilityRef.id];
                              if (!ability) return null;
                              return (
                                <div key={idx} class="ability-item">
                                  <div class="ability-header-with-icon">
                                    <SimpleSprite
                                      id={getAbilityIconSprite(ability.id)}
                                      width={24}
                                      height={24}
                                    />
                                    <div class="ability-name">{ability.name}</div>
                                  </div>
                                  <div class="ability-description">{ability.description}</div>
                                  <div class="ability-stats">
                                    {ability.type && <span>Type: {ability.type}</span>}
                                    {ability.manaCost !== undefined && ability.manaCost > 0 && (
                                      <span>Mana: {ability.manaCost}</span>
                                    )}
                                    {ability.basePower !== undefined && ability.basePower > 0 && (
                                      <span>Power: {ability.basePower}</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <div class="detail-row">
                          <span class="detail-label">XP:</span>
                          <span class="detail-value">{enemy.baseXp}</span>
                        </div>
                        <div class="detail-row">
                          <span class="detail-label">Gold:</span>
                          <span class="detail-value">{enemy.baseGold}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'bosses' && (
            <div class="compendium-section">
              <h2>Boss Enemies ({bossEnemies.length})</h2>
              <div class="compendium-grid">
                {bossEnemies.map((enemy) => {
                  return (
                    <div key={enemy.id} class="compendium-item detailed boss">
                      <div class="item-sprite">
                        {(() => {
                          const bossSpriteId =
                            getEnemyBattleSprite(enemy.id, 'idle') ??
                            `missing-compendium-enemy-${enemy.id}`;
                          warnIfPlaceholderSprite('CompendiumScreen', bossSpriteId);
                          return (
                            <SimpleSprite
                              id={bossSpriteId}
                              width={64}
                              height={64}
                            />
                          );
                        })()}
                      </div>
                      <div class="item-name boss-name">{enemy.name}</div>
                      <div class="item-details">
                        <div class="detail-row">
                          <span class="detail-label">Element:</span>
                          <span class="detail-value">{enemy.element}</span>
                        </div>
                        <div class="detail-row">
                          <span class="detail-label">Level:</span>
                          <span class="detail-value">{enemy.level}</span>
                        </div>
                        <div class="stats-grid">
                          <div>HP: {enemy.stats.hp}</div>
                          <div>ATK: {enemy.stats.atk}</div>
                          <div>DEF: {enemy.stats.def}</div>
                          <div>MAG: {enemy.stats.mag}</div>
                          <div>SPD: {enemy.stats.spd}</div>
                        </div>
                        {enemy.abilities && enemy.abilities.length > 0 && (
                          <div class="ability-section">
                            <div class="ability-header">Abilities:</div>
                            {enemy.abilities.map((abilityRef, idx) => {
                              const ability = ABILITIES[abilityRef.id];
                              if (!ability) return null;
                              return (
                                <div key={idx} class="ability-item">
                                  <div class="ability-header-with-icon">
                                    <SimpleSprite
                                      id={getAbilityIconSprite(ability.id)}
                                      width={24}
                                      height={24}
                                    />
                                    <div class="ability-name">{ability.name}</div>
                                  </div>
                                  <div class="ability-description">{ability.description}</div>
                                  <div class="ability-stats">
                                    {ability.type && <span>Type: {ability.type}</span>}
                                    {ability.manaCost !== undefined && ability.manaCost > 0 && (
                                      <span>Mana: {ability.manaCost}</span>
                                    )}
                                    {ability.basePower !== undefined && ability.basePower > 0 && (
                                      <span>Power: {ability.basePower}</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <div class="detail-row">
                          <span class="detail-label">XP:</span>
                          <span class="detail-value">{enemy.baseXp}</span>
                        </div>
                        <div class="detail-row">
                          <span class="detail-label">Gold:</span>
                          <span class="detail-value">{enemy.baseGold}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'npcs' && (
            <div class="compendium-section">
              <h2>NPCs ({COMPENDIUM_NPCS.length})</h2>
              <div class="compendium-grid">
                {COMPENDIUM_NPCS.map((npc) => (
                  <div key={npc.id} class="compendium-item">
                    <div class="item-sprite">
                      <img
                        src={npc.sprite}
                        alt={npc.name}
                        style={{ width: 64, height: 64, imageRendering: 'pixelated', objectFit: 'contain' }}
                      />
                    </div>
                    <div class="item-name">{npc.name}</div>
                    <div class="item-details">
                      <div class="detail-row">
                        <span class="detail-label">Role:</span>
                        <span class="detail-value">{npc.role}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Location:</span>
                        <span class="detail-value">{npc.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Unit Detail View Component
function UnitDetailView({ unitId, onBack }: { unitId: string; onBack: () => void }): JSX.Element | null {
  const unit = UNIT_DEFINITIONS[unitId];
  if (!unit) return null;

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

  return (
    <div class="unit-detail-view">
      <button class="back-btn" onClick={onBack}>← Back</button>
      <div class="unit-detail-header">
        <div class="unit-header-with-sprite">
          <SimpleSprite
            id={getPortraitSprite(unit.id)}
            width={96}
            height={96}
            style={{ borderRadius: '12px' }}
          />
          <div>
            <h2>{unit.name}</h2>
            <div class="unit-meta">
              <span>Element: {unit.element}</span>
              <span>Role: {unit.role}</span>
            </div>
            {unit.description && <p class="unit-description">{unit.description}</p>}
          </div>
        </div>
      </div>

      <div class="unit-stats-progression">
        <h3>Stat Progression</h3>
        <div class="stats-table">
          <div class="stats-row header">
            <div>Stat</div>
            <div>Lv 1</div>
            <div>Lv 5</div>
            <div>Lv 10</div>
            <div>Growth/Value</div>
          </div>
          <div class="stats-row">
            <div>HP</div>
            <div>{statsLv1.hp}</div>
            <div>{statsLv5.hp}</div>
            <div>{statsLv10.hp}</div>
            <div>+{unit.growthRates.hp}/lv</div>
          </div>
          <div class="stats-row">
            <div>Mana Contribution</div>
            <div>{unit.manaContribution}</div>
            <div>{unit.manaContribution}</div>
            <div>{unit.manaContribution}</div>
            <div>Fixed</div>
          </div>
          <div class="stats-row">
            <div>ATK</div>
            <div>{statsLv1.atk}</div>
            <div>{statsLv5.atk}</div>
            <div>{statsLv10.atk}</div>
            <div>+{unit.growthRates.atk}/lv</div>
          </div>
          <div class="stats-row">
            <div>DEF</div>
            <div>{statsLv1.def}</div>
            <div>{statsLv5.def}</div>
            <div>{statsLv10.def}</div>
            <div>+{unit.growthRates.def}/lv</div>
          </div>
          <div class="stats-row">
            <div>MAG</div>
            <div>{statsLv1.mag}</div>
            <div>{statsLv5.mag}</div>
            <div>{statsLv10.mag}</div>
            <div>+{unit.growthRates.mag}/lv</div>
          </div>
          <div class="stats-row">
            <div>SPD</div>
            <div>{statsLv1.spd}</div>
            <div>{statsLv5.spd}</div>
            <div>{statsLv10.spd}</div>
            <div>+{unit.growthRates.spd}/lv</div>
          </div>
        </div>
      </div>

      <div class="unit-abilities">
        <h3>Unlockable Abilities</h3>
        <div class="abilities-list">
          {unit.abilities
            .sort((a, b) => (a.unlockLevel || 1) - (b.unlockLevel || 1))
            .map((abilityRef, idx) => {
              const ability = ABILITIES[abilityRef.id];
              if (!ability) return null;
              return (
                <div key={idx} class="ability-card">
                  <div class="ability-card-header">
                    <span class="ability-level">Lv {abilityRef.unlockLevel || 1}</span>
                    <SimpleSprite
                      id={getAbilityIconSprite(ability.id)}
                      width={32}
                      height={32}
                    />
                    <span class="ability-name">{ability.name}</span>
                  </div>
                  <div class="ability-description">{ability.description}</div>
                  <div class="ability-meta">
                    <span>Type: {ability.type}</span>
                    {ability.element && <span>Element: {ability.element}</span>}
                    {ability.manaCost !== undefined && ability.manaCost > 0 && (
                      <span>Mana Cost: {ability.manaCost}</span>
                    )}
                    {ability.basePower !== undefined && ability.basePower > 0 && (
                      <span>Power: {ability.basePower}</span>
                    )}
                    {ability.targets && <span>Target: {ability.targets}</span>}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

// Djinn Detail View Component - Network Visualization
function DjinnDetailView({ djinnId, onBack }: { djinnId: string; onBack: () => void }): JSX.Element | null {
  const djinn = DJINN[djinnId];
  if (!djinn) return null;

  // Get all units that can use this Djinn
  const unitIds = Object.keys(djinn.grantedAbilities);

  return (
    <div class="djinn-detail-view">
      <button class="back-btn" onClick={onBack}>← Back</button>
      <div class="djinn-detail-header">
        <div class="djinn-header-with-sprite">
          <SimpleSprite
            id={`${djinn.element.toLowerCase()}-djinn-front`}
            width={96}
            height={96}
          />
          <div>
            <h2>{djinn.name}</h2>
            <div class="djinn-meta">
              <span>Element: {djinn.element}</span>
              <span>Tier: {djinn.tier}</span>
            </div>
            <div class="summon-effect">
              <strong>Summon Effect:</strong> {djinn.summonEffect.description}
            </div>
          </div>
        </div>
      </div>

      <div class="djinn-ability-network">
        <h3>Ability Network - Grants to Units</h3>
        <div class="network-container">
          {unitIds.map((unitId) => {
            const unit = UNIT_DEFINITIONS[unitId];
            if (!unit) return null;

            const abilityGroup = djinn.grantedAbilities[unitId];
            if (!abilityGroup) return null;

            const compatibility =
              unit.element === djinn.element ? 'same' :
              (unit.element === 'Venus' && djinn.element === 'Mars') ||
              (unit.element === 'Mars' && djinn.element === 'Venus') ||
              (unit.element === 'Jupiter' && djinn.element === 'Mercury') ||
              (unit.element === 'Mercury' && djinn.element === 'Jupiter') ? 'counter' : 'neutral';

            return (
              <div key={unitId} class={`network-node ${compatibility}`}>
                <div class="node-header">
                  <div class="node-unit-name">{unit.name}</div>
                  <div class="node-compatibility">
                    {compatibility === 'same' && '✓ Same Element'}
                    {compatibility === 'counter' && '⚠ Counter Element'}
                    {compatibility === 'neutral' && '○ Neutral'}
                  </div>
                </div>
                <div class="node-abilities">
                  {abilityGroup.same.length > 0 && (
                    <div class="ability-group same-element">
                      <div class="group-label">Same Element Abilities:</div>
                      {abilityGroup.same.map((abilityId) => {
                        const ability = DJINN_ABILITIES[abilityId];
                        if (!ability) return null;
                        return (
                          <div key={abilityId} class="network-ability">
                            <div class="network-ability-header">
                              <SimpleSprite
                                id={getAbilityIconSprite(abilityId)}
                                width={20}
                                height={20}
                              />
                              <div class="network-ability-name">{ability.name}</div>
                            </div>
                            <div class="network-ability-desc">{ability.description}</div>
                            <div class="network-ability-stats">
                              {ability.type && <span>{ability.type}</span>}
                        {ability.manaCost !== undefined && ability.manaCost > 0 && (
                          <span>Mana: {ability.manaCost}</span>
                        )}
                              {ability.basePower !== undefined && ability.basePower > 0 && (
                                <span>Power: {ability.basePower}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {abilityGroup.counter.length > 0 && (
                    <div class="ability-group counter-element">
                      <div class="group-label">Counter Element Abilities:</div>
                      {abilityGroup.counter.map((abilityId) => {
                        const ability = DJINN_ABILITIES[abilityId];
                        if (!ability) return null;
                        return (
                          <div key={abilityId} class="network-ability">
                            <div class="network-ability-header">
                              <SimpleSprite
                                id={getAbilityIconSprite(abilityId)}
                                width={20}
                                height={20}
                              />
                              <div class="network-ability-name">{ability.name}</div>
                            </div>
                            <div class="network-ability-desc">{ability.description}</div>
                            <div class="network-ability-stats">
                              {ability.type && <span>{ability.type}</span>}
                        {ability.manaCost !== undefined && ability.manaCost > 0 && (
                          <span>Mana: {ability.manaCost}</span>
                        )}
                              {ability.basePower !== undefined && ability.basePower > 0 && (
                                <span>Power: {ability.basePower}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {abilityGroup.neutral.length > 0 && (
                    <div class="ability-group neutral-element">
                      <div class="group-label">Neutral Abilities:</div>
                      {abilityGroup.neutral.map((abilityId) => {
                        const ability = DJINN_ABILITIES[abilityId];
                        if (!ability) return null;
                        return (
                          <div key={abilityId} class="network-ability">
                            <div class="network-ability-header">
                              <SimpleSprite
                                id={getAbilityIconSprite(abilityId)}
                                width={20}
                                height={20}
                              />
                              <div class="network-ability-name">{ability.name}</div>
                            </div>
                            <div class="network-ability-desc">{ability.description}</div>
                            <div class="network-ability-stats">
                              {ability.type && <span>{ability.type}</span>}
                        {ability.manaCost !== undefined && ability.manaCost > 0 && (
                          <span>Mana: {ability.manaCost}</span>
                        )}
                              {ability.basePower !== undefined && ability.basePower > 0 && (
                                <span>Power: {ability.basePower}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
