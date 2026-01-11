import { FunctionComponent } from 'preact';
import { useMemo, useState, useRef, useEffect } from 'preact/hooks';
import type { Equipment } from '../core/models/Equipment';
import { useGameStore } from '../store/gameStore';
import { useStore } from '../ui/state/store';
import './modals.css';

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
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (modalRef.current) {
      try {
        modalRef.current.focus();
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const selectedItem = items.find((item) => item.id === selectedItemId);

  return (
    <div class="modal-overlay" onClick={onClose}>
      <div class="modal modal--inventory gs-window gs-window--layered" ref={modalRef} tabIndex={-1} role="dialog" aria-modal="true" data-testid="inventory-modal" onClick={(e) => e.stopPropagation()} style={{ minWidth: 600, maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <div class="modal-header">
          <h2 class="gs-title" style={{ marginBottom: '1rem' }}>Inventory</h2>
          <button class="close-btn" onClick={onClose} aria-label="Close inventory">
            ×
          </button>
        </div>

        <div class="modal-content" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div class="inventory-stats" style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
            <div class="stat-item">
              <span class="gs-label">Gold:</span>
              <span class="gs-value" style={{ marginLeft: '0.5rem' }}>{gold.toLocaleString()}</span>
            </div>
            <div class="stat-item">
              <span class="gs-label">Total Items:</span>
              <span class="gs-value" style={{ marginLeft: '0.5rem' }}>{items.length}</span>
            </div>
          </div>

          <div class="inventory-content" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', flex: 1, overflow: 'hidden' }}>
            <div class="equipment-list no-scrollbar" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {items.length === 0 ? (
                <div class="empty-message" style={{ textAlign: 'center', opacity: 0.5, marginTop: '2rem' }}>No equipment in inventory</div>
              ) : (
                items.map((item) => {
                  const isSelected = selectedItemId === item.id;
                  return (
                    <button
                      key={item.id}
                      class={`gs-button ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedItemId(item.id)}
                    >
                      <div class="item-icon">{item.slot === 'weapon' ? '⚔️' : '🛡️'}</div>
                      <div class="item-info">
                        <div class="item-name">{item.name}</div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div class="item-details gs-window gs-window--layered" style={{ background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,216,127,0.1)' }}>
              {selectedItem ? (
                <>
                  <h3 class="gs-value" style={{ fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,216,127,0.2)', paddingBottom: '0.5rem' }}>{selectedItem.name}</h3>
                  <div class="detail-row">
                    <span class="gs-label">Type:</span>
                    <span class="gs-value" style={{ marginLeft: '0.5rem' }}>{selectedItem.slot ?? 'item'}</span>
                  </div>
                  <div class="detail-row" style={{ marginTop: '1rem' }}>
                    <span class="gs-label">Stat Modifiers:</span>
                    <div class="detail-bonuses" style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {(selectedItem.statBonus?.atk ?? 0) !== 0 && <div class="gs-value">Attack: {selectedItem.statBonus.atk! > 0 ? '+' : ''}{selectedItem.statBonus.atk}</div>}
                      {(selectedItem.statBonus?.def ?? 0) !== 0 && <div class="gs-value">Defense: {selectedItem.statBonus.def! > 0 ? '+' : ''}{selectedItem.statBonus.def}</div>}
                      {(selectedItem.statBonus?.mag ?? 0) !== 0 && <div class="gs-value">Magic: {selectedItem.statBonus.mag! > 0 ? '+' : ''}{selectedItem.statBonus.mag}</div>}
                      {(selectedItem.statBonus?.spd ?? 0) !== 0 && <div class="gs-value">Speed: {selectedItem.statBonus.spd! > 0 ? '+' : ''}{selectedItem.statBonus.spd}</div>}
                      {(selectedItem.statBonus?.hp ?? 0) !== 0 && <div class="gs-value">HP: {selectedItem.statBonus.hp! > 0 ? '+' : ''}{selectedItem.statBonus.hp}</div>}
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '4rem' }}>Select an item to view details</div>
              )}
            </div>
          </div>

          <div class="inventory-footer" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <button class="gs-button" onClick={onClose} style={{ minWidth: 120, justifyContent: 'center' }}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
