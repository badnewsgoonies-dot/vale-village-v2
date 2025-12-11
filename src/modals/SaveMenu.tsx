import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { useStore } from '../ui/state/store';
import './modals.css';

interface SaveMenuProps {
  onClose: () => void;
}

export const SaveMenu: FunctionComponent<SaveMenuProps> = ({ onClose }) => {
  const { saveGameSlot, getSaveSlotMetadata } = useStore((s) => ({
    saveGameSlot: s.saveGameSlot,
    getSaveSlotMetadata: s.getSaveSlotMetadata,
  }));

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSave = (slotIndex: number) => {
    setSelectedSlot(slotIndex);
    saveGameSlot(slotIndex);
    setSaveMessage(`Game saved to Slot ${slotIndex + 1}!`);
    setTimeout(() => {
      setSaveMessage(null);
      setSelectedSlot(null);
    }, 2000);
  };

  return (
    <div class="modal-overlay" onClick={onClose}>
      <div class="modal modal--save" onClick={(e) => e.stopPropagation()}>
        <div class="modal-header">
          <h2>Save Game</h2>
          <button class="close-btn" onClick={onClose} aria-label="Close save menu">
            ×
          </button>
        </div>

        <div class="modal-content">
          <p class="save-instructions">
            Select a save slot to save your current progress.
          </p>

          {saveMessage && (
            <div class="save-message success">
              {saveMessage}
            </div>
          )}

          <div class="save-slots">
            {[0, 1, 2].map((slotIndex) => {
              const metadata = getSaveSlotMetadata(slotIndex);
              const isSelected = selectedSlot === slotIndex;
              const hasData = metadata.exists;

              return (
                <button
                  key={slotIndex}
                  class={`save-slot ${hasData ? 'has-data' : 'empty'} ${isSelected ? 'saving' : ''}`}
                  onClick={() => handleSave(slotIndex)}
                  disabled={isSelected}
                >
                  <div class="slot-header">
                    <span class="slot-label">Slot {slotIndex + 1}</span>
                    {hasData && metadata.timestamp && (
                      <span class="slot-timestamp">
                        {new Date(metadata.timestamp).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {hasData ? (
                    <div class="slot-details">
                      <div class="slot-row">
                        <span>Chapter:</span>
                        <span>{metadata.chapter || 1}</span>
                      </div>
                      <div class="slot-row">
                        <span>Avg Level:</span>
                        <span>{metadata.teamLevel || 1}</span>
                      </div>
                      <div class="slot-row">
                        <span>Playtime:</span>
                        <span>{Math.floor((metadata.playtime || 0) / 60)}m</span>
                      </div>
                    </div>
                  ) : (
                    <div class="slot-empty-message">Empty Slot</div>
                  )}
                </button>
              );
            })}
          </div>

          <div class="save-footer">
            <button class="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
