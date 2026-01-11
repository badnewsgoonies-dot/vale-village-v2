// @ts-nocheck
/**
 * SaveMenu Component
 * Displays 3 save slots with metadata and save/load/delete actions
 * Redesigned with Golden Sun aesthetic
 */

import { useState, useEffect, useRef } from 'preact/hooks';
import { useStore } from '../state/store';
import { useGameStore } from '../../store/gameStore';
import type { SaveSlotMetadata } from '../../core/services/SaveService';
import { SimpleSprite } from '../sprites/SimpleSprite';
import { BackgroundSprite } from '../sprites/BackgroundSprite';
import './SaveMenu.css';

interface SaveMenuProps {
  onClose: () => void;
}

/**
 * Format timestamp to readable date/time
 */
function formatTimestamp(timestamp?: number): string {
  if (!timestamp) return 'No save';
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format playtime in seconds to readable format
 */
function formatPlaytime(seconds?: number): string {
  if (!seconds) return '0:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
}

export function SaveMenu({ onClose }: SaveMenuProps) {
  const { saveGameSlot, loadGameSlot, deleteSaveSlot, getSaveSlotMetadata: getMetadata, setMode } = useStore();
  const startTransition = useGameStore((s) => s.startTransition);
  const [slots, setSlots] = useState<SaveSlotMetadata[]>([
    { exists: false },
    { exists: false },
    { exists: false },
  ]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [action, setAction] = useState<'save' | 'load' | 'delete' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prevActiveRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Capture the currently focused element so focus can be restored when the menu closes
    if (typeof document !== 'undefined') {
      const el = document.activeElement;
      prevActiveRef.current = el instanceof HTMLElement ? el : null;
    }

    // Focus the menu container for keyboard navigation when opened
    if (menuRef.current) {
      try {
        menuRef.current.focus();
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const closeWithRestore = () => {
    try {
      if (prevActiveRef.current && prevActiveRef.current.isConnected) prevActiveRef.current.focus();
    } catch (e) {
      // ignore
    }
    onClose();
  };

  // Refresh slot metadata
  const refreshSlots = () => {
    setSlots([
      getMetadata(0),
      getMetadata(1),
      getMetadata(2),
    ]);
  };

  useEffect(() => {
    refreshSlots();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      closeWithRestore();
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [onClose]);

  const handleSlotClick = (slotIndex: number) => {
    if (action === 'save') {
      handleSave(slotIndex);
    } else if (action === 'load') {
      handleLoad(slotIndex);
    } else if (action === 'delete') {
      setSelectedSlot(slotIndex);
    }
  };

  const handleSave = async (slotIndex: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await saveGameSlot(slotIndex);
      refreshSlots();
      setAction(null);
      setSelectedSlot(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save game');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = async (slotIndex: number) => {
    if (!slots[slotIndex]?.exists) {
      setError('No save file found in this slot');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await loadGameSlot(slotIndex);
      setMode('overworld');
      // Navigate to overworld after successful load
      startTransition('overworld');
      closeWithRestore();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load game');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (slotIndex: number) => {
    if (!slots[slotIndex]?.exists) {
      return;
    }
    deleteSaveSlot(slotIndex);
    refreshSlots();
    setSelectedSlot(null);
    setAction(null);
  };

  const handleConfirmDelete = () => {
    if (selectedSlot !== null) {
      handleDelete(selectedSlot);
    }
  };

  return (
    <div class="save-menu-overlay" onClick={closeWithRestore}>
      <div class="save-menu-container gs-window gs-window--layered" ref={menuRef} tabIndex={-1} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" data-testid="save-menu">
        <div class="save-menu-header">
          <h1 class="gs-title">Save / Load Game</h1>
          <button class="close-btn" onClick={closeWithRestore} aria-label="Close save menu">
            ×
          </button>
        </div>

        {error && (
          <div class="save-menu-error" role="alert">
            {error}
          </div>
        )}

        {isLoading && (
          <div class="save-menu-loading">
            {action === 'save' ? 'Saving...' : 'Loading...'}
          </div>
        )}

        {/* Action Buttons */}
        <div class="save-menu-actions">
          <button
            class={`gs-button ${action === 'save' ? 'selected' : ''}`}
            onClick={() => {
              setAction(action === 'save' ? null : 'save');
              setSelectedSlot(null);
            }}
            disabled={isLoading}
          >
            <SimpleSprite
              id="save-game"
              width={24}
              height={24}
              style={{ marginRight: '8px' }}
            />
            New Save
          </button>
          <button
            class={`gs-button ${action === 'load' ? 'selected' : ''}`}
            onClick={() => {
              setAction(action === 'load' ? null : 'load');
              setSelectedSlot(null);
            }}
            disabled={isLoading}
          >
            <SimpleSprite
              id="continue"
              width={24}
              height={24}
              style={{ marginRight: '8px' }}
            />
            Load Save
          </button>
        </div>

        {/* Save Slots */}
        <div class="save-slots">
          {slots.map((slot, index) => (
            <div
              key={index}
              class={`save-slot gs-window gs-window--layered ${selectedSlot === index ? 'selected' : ''} ${!slot.exists ? 'empty' : ''}`}
              onClick={() => handleSlotClick(index)}
              style={{ marginBottom: '1rem', cursor: 'pointer' }}
            >
              <div class="save-slot-header">
                <h2>Slot {index + 1}</h2>
                {action === 'save' && (
                  <span class="gs-value">Click to save</span>
                )}
                {action === 'load' && slot.exists && (
                  <span class="gs-value">Click to load</span>
                )}
                {action === 'delete' && slot.exists && (
                  <span class="gs-value">Click to delete</span>
                )}
              </div>

              {slot.exists ? (
                <div class="save-slot-content">
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div class="save-slot-portrait">
                      <SimpleSprite
                        id="isaac1"
                        width={64}
                        height={64}
                      />
                    </div>
                    <div class="save-slot-meta">
                      <div class="meta-row">
                        <span class="gs-label">Date:</span>
                        <span class="gs-value">{formatTimestamp(slot.timestamp)}</span>
                      </div>
                      <div class="meta-row">
                        <span class="gs-label">Playtime:</span>
                        <span class="gs-value">{formatPlaytime(slot.playtime)}</span>
                      </div>
                      <div class="meta-row">
                        <span class="gs-label">Team Level:</span>
                        <span class="gs-value">Lv. {slot.teamLevel ?? 1}</span>
                      </div>
                      <div class="meta-row">
                        <span class="gs-label">Gold:</span>
                        <span class="gs-value">{slot.gold ?? 0}g</span>
                      </div>
                      {slot.chapter && (
                        <div class="meta-row">
                          <span class="gs-label">Chapter:</span>
                          <span class="gs-value">{slot.chapter}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div class="save-slot-empty">
                  <span>Empty Slot</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Delete Confirmation */}
        {action === 'delete' && selectedSlot !== null && slots[selectedSlot]?.exists && (
          <div class="delete-confirmation gs-window gs-window--layered" style={{ background: 'rgba(100, 0, 0, 0.2)' }}>
            <p>Are you sure you want to delete this save?</p>
            <div class="confirmation-buttons" style={{ display: 'flex', gap: '1rem' }}>
              <button
                class="gs-button selected"
                onClick={handleConfirmDelete}
              >
                Yes, Delete
              </button>
              <button
                class="gs-button"
                onClick={() => {
                  setSelectedSlot(null);
                  setAction(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Delete Button */}
        {action !== 'delete' && (
          <div class="save-menu-footer">
            <button
              class="gs-button"
              style={{ borderColor: 'rgba(255, 0, 0, 0.3)' }}
              onClick={() => {
                setAction('delete');
                setSelectedSlot(null);
              }}
              disabled={isLoading}
            >
              <SimpleSprite
                id="erase-file"
                width={24}
                height={24}
                style={{ marginRight: '8px' }}
              />
              Delete Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
