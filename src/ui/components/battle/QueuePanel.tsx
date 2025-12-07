/**
 * Queue Panel Component
 *
 * Displays the action queue, mana status, and execute button.
 * Central command hub for queue-based battle planning.
 */

import { JSX } from 'preact';
import type { QueuePanelProps } from './types';

export function QueuePanel({
  roundNumber,
  queueSlots,
  mana,
  canExecute,
  targetingMode,
  onSelectSlot,
  onClearSlot,
  onPrevUnit,
  onNextUnit,
  onExecuteRound,
}: QueuePanelProps): JSX.Element {
  return (
    <div class="queue-mana-panel">
      {/* Header with navigation */}
      <div class="queue-header">
        <span>Action Queue – Round {roundNumber}</span>
        <div class="queue-nav">
          <button class="queue-nav-button" onClick={onPrevUnit}>
            [Q] Prev Unit
          </button>
          <button class="queue-nav-button" onClick={onNextUnit}>
            [E] Next Unit
          </button>
        </div>
      </div>

      {/* Action Queue Slots */}
      <div class="action-queue">
        {queueSlots.map((slot) => {
          const classes = [
            'action-slot',
            slot.isEmpty ? 'action-slot--empty' : 'action-slot--filled',
            slot.isCurrent ? 'action-slot--current' : '',
            slot.isKo ? 'action-slot--ko' : '',
          ].filter(Boolean).join(' ');

          return (
            <div
              key={slot.unitId}
              class={classes}
              onClick={() => onSelectSlot(slot.unitId)}
            >
              <div class="action-slot__unit">{slot.unitName}</div>
              <div class="action-slot__summary">{slot.summary}</div>
              {!slot.isEmpty && !slot.isKo && (
                <div class="action-slot__meta">
                  <span>{slot.manaCost} mana</span>
                  <span
                    class="action-slot__clear"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearSlot(slot.unitId);
                    }}
                  >
                    × Clear
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mana Display */}
      <div class="mana-row">
        <div class="mana-orbs">
          {Array.from({ length: mana.max }, (_, i) => (
            <div
              key={i}
              class={`mana-orb ${i < mana.current ? 'mana-orb--filled' : ''}`}
            />
          ))}
        </div>
        <div class={`mana-display ${mana.overBudget ? 'mana-display--over-budget' : ''}`}>
          Mana: {mana.current} / {mana.max}
        </div>
      </div>

      {/* Targeting Mode Banner */}
      {targetingMode && (
        <div class="execute-row">
          <span class="target-mode-banner">
            Select Target: Use arrow keys or click on a unit
          </span>
        </div>
      )}

      {/* Execute Button */}
      <div class="execute-row">
        <button
          class={`execute-button ${!canExecute ? 'execute-button--disabled' : ''}`}
          onClick={onExecuteRound}
          disabled={!canExecute}
        >
          Execute Round
        </button>
      </div>
    </div>
  );
}
