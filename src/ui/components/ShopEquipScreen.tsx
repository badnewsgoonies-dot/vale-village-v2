/**
 * ShopEquipScreen Component
 * Combined shop and equipment management screen
 */

import { JSX } from 'preact';
import { useState } from 'preact/hooks';
import { useStore } from '../state/store';
import { SHOPS } from '../../data/definitions/shops';
import { EQUIPMENT } from '../../data/definitions/equipment';
import {
  buyItem,
  canAffordItem,
  purchaseStarterKit,
  purchaseUnitEquipment,
} from '../../core/services/ShopService';
import { getStarterKit } from '../../data/definitions/starterKits';
import { EquipmentIcon } from './EquipmentIcon';
import { updateUnit } from '../../core/models/Unit';
import { calculateEquipmentBonuses } from '../../core/models/Equipment';
import { calculateLevelBonuses } from '../../core/algorithms/stats';
import './ShopEquipScreen.css';
import type { Equipment } from '../../data/schemas/EquipmentSchema';
import type { Unit } from '../../core/models/Unit';
import type { EquipmentSlot } from '../../core/models/Equipment';
import { isAvailableInCampaign } from '../utils/contentAvailability';

type Tab = 'shop' | 'equip';

interface ShopEquipScreenProps {
  shopId?: string;
  onClose: () => void;
}

const EQUIPMENT_SLOTS: EquipmentSlot[] = ['weapon', 'armor', 'helm', 'boots', 'accessory'];

export function ShopEquipScreen({ shopId, onClose }: ShopEquipScreenProps): JSX.Element {
  const { gold, addGold, addEquipment, removeEquipment, team, updateTeamUnits, equipment: inventory } = useStore((s) => ({
    gold: s.gold,
    addGold: s.addGold,
    addEquipment: s.addEquipment,
    removeEquipment: s.removeEquipment,
    team: s.team,
    updateTeamUnits: s.updateTeamUnits,
    equipment: s.equipment,
  }));

  const storyFlags = useStore((s) => s.story.flags);
  const [activeTab, setActiveTab] = useState<Tab>('shop');
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(
    team?.units[0]?.id ?? null
  );
  const [selectedSlot, setSelectedSlot] = useState<EquipmentSlot | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedUnit = team?.units.find((u) => u.id === selectedUnitId) ?? null;

  // Shop tab logic
  const shop = shopId ? SHOPS[shopId] : null;
  const isShopUnlocked = !shop || !shop.unlockCondition || shop.unlockCondition(storyFlags as Record<string, boolean>);
  const availableItems = shop && isShopUnlocked
    ? (shop.availableItems
        .map((id) => EQUIPMENT[id])
        .filter((item): item is Equipment => Boolean(item))
        .filter(isAvailableInCampaign))
    : [];

  const starterKitEntries = team
    ? team.units
        .map((unit) => ({
          unit,
          kit: getStarterKit(unit),
        }))
        .filter(({ kit, unit }) => Boolean(kit) && !unit.storeUnlocked)
        .map(({ unit, kit }) => ({ unit, kit: kit! }))
    : [];

  const unlockedUnits = team ? team.units.filter((unit) => unit.storeUnlocked) : [];

  const handleUnlock = (itemId: string) => {
    setError(null);
    const result = buyItem(gold, itemId);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    addGold(result.value.newGold - gold);
    addEquipment([result.value.item]);
  };

  const handleStarterKitPurchase = (unitId: string) => {
    if (!team) return;
    const unit = team.units.find((u) => u.id === unitId);
    if (!unit) return;

    setError(null);
    const result = purchaseStarterKit(unit, gold);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    addGold(result.value.newGold - gold);
    addEquipment(result.value.equipment);

    const updatedUnits = team.units.map((unit) =>
      unit.id === unitId ? { ...unit, storeUnlocked: true } : unit
    );
    updateTeamUnits(updatedUnits);
  };

  const handleUnitEquipmentPurchase = (unit: Unit, itemId: string) => {
    setError(null);
    const result = purchaseUnitEquipment(unit, gold, itemId);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    addGold(result.value.newGold - gold);
    addEquipment([result.value.item]);
  };


  // Equipment tab logic
  const handleEquip = (equipment: Equipment) => {
    if (!selectedUnit || !selectedSlot) return;

    // If there's already an item in this slot, return it to inventory first
    const currentItem = selectedUnit.equipment[selectedSlot];
    if (currentItem) {
      addEquipment([currentItem]);
    }

    // Remove the new item from inventory
    removeEquipment(equipment.id);

    // Equip the new item
    const newEquipment = { ...selectedUnit.equipment, [selectedSlot]: equipment };
    const updatedUnit = updateUnit(selectedUnit, { equipment: newEquipment });

    const updatedUnits = team!.units.map((u) => (u.id === selectedUnit.id ? updatedUnit : u));
    updateTeamUnits(updatedUnits);
    setSelectedSlot(null);
  };

  const handleUnequip = (slot: EquipmentSlot) => {
    if (!selectedUnit) return;

    // Get the item being unequipped
    const itemToUnequip = selectedUnit.equipment[slot];

    // Update unit equipment (set slot to null)
    const newEquipment = { ...selectedUnit.equipment, [slot]: null };
    const updatedUnit = updateUnit(selectedUnit, { equipment: newEquipment });

    // Return item to inventory if it exists
    if (itemToUnequip) {
      addEquipment([itemToUnequip]);
    }

    const updatedUnits = team!.units.map((u) => (u.id === selectedUnit.id ? updatedUnit : u));
    updateTeamUnits(updatedUnits);
  };

  const availableEquipmentForSlot = selectedUnit && selectedSlot
    ? inventory.filter(
        (item) => item.slot === selectedSlot &&
        (item.allowedElements.length === 0 || item.allowedElements.includes(selectedUnit.element))
      )
    : [];

  const equipmentBonuses = selectedUnit ? calculateEquipmentBonuses(selectedUnit.equipment) : {};
  const levelBonuses = selectedUnit ? calculateLevelBonuses(selectedUnit) : {};

  const previewStats = selectedUnit ? {
    atk: selectedUnit.baseStats.atk + (levelBonuses.atk || 0) + (equipmentBonuses.atk || 0),
    def: selectedUnit.baseStats.def + (levelBonuses.def || 0) + (equipmentBonuses.def || 0),
    mag: selectedUnit.baseStats.mag + (levelBonuses.mag || 0) + (equipmentBonuses.mag || 0),
    spd: selectedUnit.baseStats.spd + (levelBonuses.spd || 0) + (equipmentBonuses.spd || 0),
  } : null;

  return (
    <div class="shop-equip-overlay" onClick={onClose}>
      <div class="shop-equip-container" onClick={(e) => e.stopPropagation()}>
        <div class="shop-equip-header">
          <h1>{shop ? shop.name : 'Shop & Equipment'}</h1>
          <button class="close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div class="shop-equip-gold">
          <span class="gold-label">Gold:</span>
          <span class="gold-value">{gold}g</span>
        </div>

        <div class="shop-equip-note" style={{ fontSize: '0.8rem', color: '#a9b1c8', padding: '0 1rem', marginBottom: '0.5rem' }}>
          Equipment in your inventory is shared across the roster and locked to elements. Use the Pre-Battle screen to finalize
          which pieces each unit actually carries into combat.
        </div>

        {error && (
          <div class="shop-equip-error" role="alert">
            {error}
          </div>
        )}

        <div class="shop-equip-tabs">
          <button
            class={`tab-btn ${activeTab === 'shop' ? 'active' : ''}`}
            onClick={() => setActiveTab('shop')}
          >
            Shop
          </button>
          <button
            class={`tab-btn ${activeTab === 'equip' ? 'active' : ''}`}
            onClick={() => setActiveTab('equip')}
          >
            Equipment
          </button>
        </div>

        <div class="shop-equip-content">
          {activeTab === 'shop' && (
            <div class="shop-tab-content">
              {!shop ? (
                <div class="shop-empty">No shop available</div>
              ) : !isShopUnlocked ? (
                <div class="shop-locked">This shop is not yet available.</div>
              ) : (
                <>
                  {starterKitEntries.length > 0 && (
                    <section class="starter-kits-section">
                      <h2>Starter Kits</h2>
                      <div class="shop-items-grid">
                        {starterKitEntries.map(({ unit, kit }) => {
                          const affordable = gold >= kit.cost;
                          return (
                            <div
                              key={unit.id}
                              class={`shop-item-card ${!affordable ? 'unaffordable' : ''}`}
                            >
                              <div class="item-details">
                                <div class="item-name">{kit.name}</div>
                                <div class="item-stats">
                                  <span class="stat-badge">{unit.name}</span>
                                  <span class="stat-badge">{kit.cost}g</span>
                                </div>
                              </div>
                              <button
                                class="buy-btn"
                                onClick={() => handleStarterKitPurchase(unit.id)}
                                disabled={!affordable}
                              >
                                Purchase Starter Kit
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {unlockedUnits.map((unit) => {
                    // Filter equipment by element type (not unit-specific)
            const availableEquipment = Object.values(EQUIPMENT).filter(
              (item) => isAvailableInCampaign(item) && item.allowedElements.includes(unit.element)
            );
                    return (
                      <section key={unit.id} class="unit-store-section">
                        <h2>{unit.name}&apos;s Equipment ({unit.element})</h2>
                        {availableEquipment.length === 0 ? (
                          <div class="shop-empty">No equipment available yet.</div>
                        ) : (
                          <div class="shop-items-grid">
                            {availableEquipment.map((item) => {
                              const affordable = canAffordItem(gold, item.id);
                              return (
                                <div
                                  key={`${unit.id}-${item.id}`}
                                  class={`shop-item-card ${!affordable ? 'unaffordable' : ''}`}
                                >
                                  <div class="item-icon">
                                    <EquipmentIcon equipment={item} />
                                  </div>
                                  <div class="item-details">
                                    <div class="item-name">{item.name}</div>
                                    <div class="item-stats">
                                      {Object.entries(item.statBonus).map(([stat, value]) => (
                                        <span key={stat} class="stat-badge">
                                          +{value} {stat.toUpperCase()}
                                        </span>
                                      ))}
                                    </div>
                                    <div class="item-price">{item.cost}g</div>
                                  </div>
                                  <button
                                    class="buy-btn"
                                    onClick={() => handleUnitEquipmentPurchase(unit, item.id)}
                                    disabled={!affordable}
                                  >
                                    Purchase for {unit.name}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </section>
                    );
                  })}

                  {availableItems.length > 0 && (
                    <section class="shop-general-section">
                      <h2>General Equipment</h2>
                      <div class="shop-items-grid">
                        {availableItems.map((item) => {
                          const affordable = canAffordItem(gold, item.id);
                          return (
                            <div
                              key={item.id}
                              class={`shop-item-card ${!affordable ? 'unaffordable' : ''}`}
                            >
                              <div class="item-icon">
                                <EquipmentIcon equipment={item} />
                              </div>
                              <div class="item-details">
                                <div class="item-name">{item.name}</div>
                                <div class="item-stats">
                                  {Object.entries(item.statBonus).map(([stat, value]) => (
                                    <span key={stat} class="stat-badge">
                                      +{value} {stat.toUpperCase()}
                                    </span>
                                  ))}
                                </div>
                                <div class="item-price">{item.cost}g</div>
                              </div>
                              <button
                                class="buy-btn"
                                onClick={() => handleUnlock(item.id)}
                                disabled={!affordable}
                              >
                                Unlock Equipment
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {starterKitEntries.length === 0 && unlockedUnits.length === 0 && availableItems.length === 0 && (
                    <div class="shop-empty">No items available.</div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'equip' && (
            <div class="equip-tab-content">
              <div class="equipment-tab-note" style={{ fontSize: '0.8rem', color: '#9ea6b7', marginBottom: '0.5rem', textAlign: 'center' }}>
                This view shows each unit&apos;s preferred loadout. The Pre-Battle screen is still the final say for actual gear per battle.
              </div>
              {!team || team.units.length === 0 ? (
                <div class="shop-empty">No units available.</div>
              ) : (
                <div class="equip-layout">
                  <div class="unit-selector-panel">
                    <h2>Select Unit</h2>
                    <div class="unit-list">
                      {team.units.map((unit) => (
                        <div
                          key={unit.id}
                          class={`unit-card ${selectedUnitId === unit.id ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedUnitId(unit.id);
                            setSelectedSlot(null);
                          }}
                        >
                          <div class="unit-info">
                            <div class="unit-name">{unit.name}</div>
                            <div class="unit-level">Lv. {unit.level}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedUnit && (
                    <div class="equipment-management-panel">
                      <div class="equipment-slots-section">
                        <h2>{selectedUnit.name}&apos;s Equipment</h2>
                        <div class="equipment-grid">
                          {EQUIPMENT_SLOTS.map((slot) => {
                            const eq = selectedUnit.equipment[slot];
                            const isSelected = selectedSlot === slot;
                            return (
                              <div
                                key={slot}
                                class={`equipment-slot ${slot} ${isSelected ? 'selected' : ''}`}
                                onClick={() => setSelectedSlot(isSelected ? null : slot)}
                              >
                                <div class="equipment-label">{slot.toUpperCase()}</div>
                                {eq ? (
                                  <>
                                    <div class="equipment-value">{eq.name}</div>
                                    <div class="equipment-bonuses">
                                      {eq.statBonus.atk && (
                                        <span class="bonus-badge">+{eq.statBonus.atk} ATK</span>
                                      )}
                                      {eq.statBonus.def && (
                                        <span class="bonus-badge">+{eq.statBonus.def} DEF</span>
                                      )}
                                      {eq.statBonus.mag && (
                                        <span class="bonus-badge">+{eq.statBonus.mag} MAG</span>
                                      )}
                                      {eq.statBonus.spd && (
                                        <span class="bonus-badge">+{eq.statBonus.spd} SPD</span>
                                      )}
                                    </div>
                                    {isSelected && (
                                      <button
                                        class="unequip-btn"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleUnequip(slot);
                                          setSelectedSlot(null);
                                        }}
                                      >
                                        Unequip
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  <div class="equipment-value empty">[None]</div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {previewStats && (
                          <div class="stat-preview">
                            <div class="stat-preview-title">STAT PREVIEW</div>
                            <div class="stat-preview-values">
                              <span>
                                ATK: {previewStats.atk}
                                {equipmentBonuses.atk ? ` (+${equipmentBonuses.atk})` : ''}
                              </span>
                              <span>
                                DEF: {previewStats.def}
                                {equipmentBonuses.def ? ` (+${equipmentBonuses.def})` : ''}
                              </span>
                              <span>
                                MAG: {previewStats.mag}
                                {equipmentBonuses.mag ? ` (+${equipmentBonuses.mag})` : ''}
                              </span>
                              <span>
                                SPD: {previewStats.spd}
                                {equipmentBonuses.spd ? ` (+${equipmentBonuses.spd})` : ''}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div class="equipment-inventory-section">
                        {selectedSlot ? (
                          <>
                            <div class="slot-indicator">
                              Equipping to: <strong>{selectedSlot.toUpperCase()}</strong>
                            </div>
                            {availableEquipmentForSlot.length === 0 ? (
                              <div class="inventory-empty">
                                No {selectedSlot} available in inventory
                              </div>
                            ) : (
                              <div class="inventory-grid">
                                {availableEquipmentForSlot.map((item) => (
                                  <div
                                    key={item.id}
                                    class="inventory-item"
                                    onClick={() => handleEquip(item)}
                                  >
                                    <div class="inventory-item-icon">
                                      <EquipmentIcon equipment={item} />
                                    </div>
                                    <div class="inventory-item-name">{item.name}</div>
                                    <div class="inventory-item-stats">
                                      {item.statBonus.atk && `+${item.statBonus.atk} ATK `}
                                      {item.statBonus.def && `+${item.statBonus.def} DEF `}
                                      {item.statBonus.mag && `+${item.statBonus.mag} MAG `}
                                      {item.statBonus.spd && `+${item.statBonus.spd} SPD `}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <div class="slot-prompt">
                            Select an equipment slot to view available items
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
