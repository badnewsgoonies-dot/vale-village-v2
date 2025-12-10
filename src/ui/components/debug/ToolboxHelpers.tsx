/**
 * ToolboxHelpers
 * Lightweight floating helper panel for QA/debug without breaking layout layers.
 * - Container uses pointer-events: none; only buttons are interactive.
 * - Positions stick to viewport corners; toggle via hotkey (Alt+T) or button.
 */

import { useEffect, useState } from 'preact/hooks';
import './ToolboxHelpers.css';

export type ToolboxAction = {
  id: string;
  label: string;
  onClick: () => void;
  tooltip?: string;
};

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface ToolboxHelpersProps {
  title?: string;
  actions: ToolboxAction[];
  position?: Position;
  initiallyOpen?: boolean;
}

export function ToolboxHelpers({
  title = 'Toolbox',
  actions,
  position = 'bottom-right',
  initiallyOpen = false,
}: ToolboxHelpersProps) {
  const [open, setOpen] = useState(initiallyOpen);

  // Hotkey toggle (Alt+T) to avoid colliding with gameplay keys
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!actions.length) return null;

  return (
    <div class={`toolbox-root ${position}`}>
      <button
        class="toolbox-toggle"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        title={`${open ? 'Hide' : 'Show'} ${title} (Alt+T)`}
      >
        🧰
      </button>

      <div class={`toolbox-panel ${open ? 'open' : 'closed'}`} onClick={(e) => e.stopPropagation()}>
        <div class="toolbox-header">
          <span class="toolbox-title">{title}</span>
          <button
            class="toolbox-close"
            onClick={() => setOpen(false)}
            aria-label="Close toolbox"
            title="Close (Alt+T)"
          >
            ×
          </button>
        </div>
        <div class="toolbox-actions">
          {actions.map((action) => (
            <button
              key={action.id}
              class="toolbox-action"
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
              title={action.tooltip}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
