import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { useStore } from '../ui/state/store';
import './modals.css';

interface InventoryModalProps {
  onClose?: () => void;
}

export const InventoryModal: FunctionComponent<InventoryModalProps> = ({ onClose }) => {
  const { gold, equipment } = useStore((s) => ({
    gold: s.gold,
    equipment: s.equipment,
  }));

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const selectedItem = equipment.find((item) => item.id === selectedItemId);

  return (
    <div class="modal-overlay" onClick={onClose}>
      <div class="modal modal--inventory" onClick={(e) => e.stopPropagation()}>
        <div class="modal-header">
          <h2>Inventory</h2>
          <button class="close-btn" onClick={onClose} aria-label="Close inventory">
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
              <span class="stat-value">{equipment.length} items</span>
            </div>
          </div>

          <div class="inventory-content">
            <div class="equipment-list">
              {equipment.length === 0 ? (
                <div class="empty-message">No equipment in inventory</div>
              ) : (
                equipment.map((item) => {
                  const isSelected = selectedItemId === item.id;

                  return (
                    <div
                      key={item.id}
                      class={`equipment-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedItemId(item.id)}
                    >
                      <div class="item-icon">{item.slot === 'weapon' ? '⚔️' : '🛡️'}</div>
                      <div class="item-info">
                        <div class="item-name">{item.name}</div>
                        <div class="item-type">{item.slot}</div>
                      </div>
                      <div class="item-stats">
                        {(item.statBonus.atk ?? 0) > 0 && <span class="stat-bonus">ATK +{item.statBonus.atk}</span>}
                        {(item.statBonus.def ?? 0) > 0 && <span class="stat-bonus">DEF +{item.statBonus.def}</span>}
                        {(item.statBonus.mag ?? 0) > 0 && <span class="stat-bonus">MAG +{item.statBonus.mag}</span>}
                        {(item.statBonus.spd ?? 0) > 0 && <span class="stat-bonus">SPD +{item.statBonus.spd}</span>}
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
                  <span class="detail-value">{selectedItem.slot}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Bonuses:</span>
                  <div class="detail-bonuses">
                    {(selectedItem.statBonus.atk ?? 0) > 0 && <div>Attack: +{selectedItem.statBonus.atk}</div>}
                    {(selectedItem.statBonus.def ?? 0) > 0 && <div>Defense: +{selectedItem.statBonus.def}</div>}
                    {(selectedItem.statBonus.mag ?? 0) > 0 && <div>Magic: +{selectedItem.statBonus.mag}</div>}
                    {(selectedItem.statBonus.spd ?? 0) > 0 && <div>Speed: +{selectedItem.statBonus.spd}</div>}
                    {(selectedItem.statBonus.hp ?? 0) > 0 && <div>HP: +{selectedItem.statBonus.hp}</div>}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div class="inventory-footer">
            <button class="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
