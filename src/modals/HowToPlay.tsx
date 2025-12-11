import { FunctionComponent } from 'preact';
import './modals.css';

interface HowToPlayProps {
  onClose: () => void;
}

export const HowToPlay: FunctionComponent<HowToPlayProps> = ({ onClose }) => {
  return (
    <div class="modal-overlay" onClick={onClose}>
      <div class="modal modal--help" onClick={(e) => e.stopPropagation()}>
        <div class="modal-header">
          <h2>How to Play</h2>
          <button class="close-btn" onClick={onClose} aria-label="Close help">
            ×
          </button>
        </div>

        <div class="modal-content">
          <section class="help-section">
            <h3>Game Overview</h3>
            <p>
              Vale Village is a Golden Sun-inspired RPG where you build a team of heroes,
              collect Djinn, and battle through challenging encounters.
            </p>
          </section>

          <section class="help-section">
            <h3>Battle System</h3>
            <ul>
              <li><strong>Turn-Based Combat:</strong> Select actions for each unit in turn order</li>
              <li><strong>Abilities:</strong> Each unit has unique abilities that cost mana</li>
              <li><strong>Djinn:</strong> Summon Djinn to provide team-wide stat bonuses</li>
              <li><strong>Elements:</strong> Venus, Mars, Mercury, and Jupiter - each with strengths</li>
            </ul>
          </section>

          <section class="help-section">
            <h3>Team Management</h3>
            <ul>
              <li><strong>Roster:</strong> Recruit units and view their stats in the Unit Compendium</li>
              <li><strong>Formation:</strong> Select your battle formation before each encounter</li>
              <li><strong>Equipment:</strong> Equip items to boost unit stats</li>
            </ul>
          </section>

          <section class="help-section">
            <h3>Djinn System</h3>
            <ul>
              <li><strong>Collecting:</strong> Find Djinn throughout your journey</li>
              <li><strong>States:</strong> Set (passive bonuses) or Standby (ready to summon)</li>
              <li><strong>Summoning:</strong> Use Djinn in battle for powerful effects</li>
              <li><strong>Team Slots:</strong> Equip up to 3 Djinn for global team bonuses</li>
            </ul>
          </section>

          <section class="help-section">
            <h3>Keyboard Controls</h3>
            <ul>
              <li><strong>Arrow Keys:</strong> Navigate menus and select targets</li>
              <li><strong>Enter/Space:</strong> Confirm selection</li>
              <li><strong>Escape:</strong> Cancel or open pause menu</li>
              <li><strong>1-9:</strong> Quick select abilities in battle</li>
            </ul>
          </section>

          <section class="help-section">
            <h3>Pause Menu Shortcuts</h3>
            <ul>
              <li><strong>T:</strong> Team Management</li>
              <li><strong>I:</strong> Inventory</li>
              <li><strong>D:</strong> Djinn Collection</li>
              <li><strong>S:</strong> Save Game</li>
              <li><strong>O:</strong> Settings</li>
              <li><strong>H:</strong> How to Play</li>
              <li><strong>Q:</strong> Return to Title</li>
            </ul>
          </section>

          <div class="help-footer">
            <button class="btn btn-primary" onClick={onClose}>
              Got It!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
