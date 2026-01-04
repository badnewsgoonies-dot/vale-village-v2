import { FunctionComponent } from 'preact';
import { useMemo, useState, useEffect, useRef } from 'preact/hooks';
import type { Equipment } from '../core/models/Equipment';
import { useGameStore } from '../store/gameStore';
import { useStore } from '../ui/state/store';
import './modals.css';
import { focusRestore } from '../ui/utils/focusRestore';

interface InventoryModalProps {
  onClose?: () => void;
}

export const InventoryModal: FunctionComponent<InventoryModalProps> = ({ onClose }) => {
  const { gold: legacyGold, equipment: legacyEquipment } = useStore((s) => ({
    gold: s.gold,
    equipment: s.equipment,
  }));
  const { inventoryItems, currency } = useGameStore((s) => ({
    inventoryItems: s.playerData.inventory.items,
    currency: s.playerData.currency,
  }));

  type DisplayItem = {
    id: string;
    name: string;
    quantity: number;
    slot: Equipment['slot'] | 'item';
    statBonus: Partial<Equipment['statBonus']>;
  };

  const items: DisplayItem[] = useMemo(() => {
    if (inventoryItems.length > 0) {
      return inventoryItems.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        slot: item.slot ?? 'item',
        statBonus: item.statBonus ?? {},
      }));
    }

    return legacyEquipment.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: 1,
      slot: item.slot ?? 'item',
      statBonus: item.statBonus ?? {},
    }));
  }, [inventoryItems, legacyEquipment]);

  const gold = inventoryItems.length > 0 ? currency : legacyGold;

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const selectedItem = items.find((item) => item.id === selectedItemId);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const restore = focusRestore();
    // focus modal container for accessibility
    modalRef.current?.focus();
    return () => restore();
  }, []);

  return (
    <div class="modal-overlay" onClick={onClose} data-testid="inventory-modal-overlay">
      <div class="modal modal--inventory" ref={modalRef} tabIndex={-1} onClick={(e) => e.stopPropagation()} data-testid="inventory-modal">
        <div class="modal-header">
          <h2>Inventory</h2>
          <button class="close-btn" onClick={onClose} aria-label="Close inventory" data-testid="inventory-close-button">
            ×
          </button>
        </div>

        <div class="modal-content">
          <div class="inventory-stats">
            <div class="stat-item">
              <span class="stat-label">Gold:</span>
              <span class="stat-value">{gold.toLocaleString()}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Equipment:</span>
              <span class="stat-value">{items.length} items</span>
            </div>
          </div>

          <div class="inventory-content">
            <div class="equipment-list">
              {items.length === 0 ? (
                <div class="empty-message">No equipment in inventory</div>
              ) : (
                items.map((item) => {
                  const isSelected = selectedItemId === item.id;
                  const statBonus = item.statBonus ?? {};

                  return (
                    <div
                      key={item.id}
                      class={`equipment-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedItemId(item.id)}
                    >
                      <div class="item-icon">{item.slot === 'weapon' ? '⚔️' : '🛡️'}</div>
                      <div class="item-info">
                        <div class="item-name">{item.name}</div>
                        <div class="item-type">{item.slot ?? 'item'}</div>
                      </div>
                      <div class="item-stats">
                        {(statBonus.atk ?? 0) > 0 && <span class="stat-bonus">ATK +{statBonus.atk}</span>}
                        {(statBonus.def ?? 0) > 0 && <span class="stat-bonus">DEF +{statBonus.def}</span>}
                        {(statBonus.mag ?? 0) > 0 && <span class="stat-bonus">MAG +{statBonus.mag}</span>}
                        {(statBonus.spd ?? 0) > 0 && <span class="stat-bonus">SPD +{statBonus.spd}</span>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {selectedItem && (
              <div class="item-details">
                <h3>{selectedItem.name}</h3>
                <div class="detail-row">
                  <span class="detail-label">Type:</span>
                  <span class="detail-value">{selectedItem.slot ?? 'item'}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Bonuses:</span>
                  <div class="detail-bonuses">
                    {(selectedItem.statBonus?.atk ?? 0) > 0 && <div>Attack: +{selectedItem.statBonus?.atk}</div>}
                    {(selectedItem.statBonus?.def ?? 0) > 0 && <div>Defense: +{selectedItem.statBonus?.def}</div>}
                    {(selectedItem.statBonus?.mag ?? 0) > 0 && <div>Magic: +{selectedItem.statBonus?.mag}</div>}
                    {(selectedItem.statBonus?.spd ?? 0) > 0 && <div>Speed: +{selectedItem.statBonus?.spd}</div>}
                    {(selectedItem.statBonus?.hp ?? 0) > 0 && <div>HP: +{selectedItem.statBonus?.hp}</div>}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div class="inventory-footer">
            <button class="btn btn-secondary" onClick={onClose} data-testid="inventory-close-footer">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
