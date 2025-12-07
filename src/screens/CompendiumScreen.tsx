/**
 * Compendium Screen Component
 * A read-only catalog showing Djinn, Units, and Equipment
 */

import { useState, useEffect } from 'preact/hooks';
import { useGameStore } from '../store/gameStore';
import { DJINN } from '../data/definitions/djinn';
import { UNIT_DEFINITIONS } from '../data/definitions/units';
import { EQUIPMENT } from '../data/definitions/equipment';
import type { Djinn } from '../data/schemas/DjinnSchema';
import type { UnitDefinition } from '../data/schemas/UnitSchema';
import type { Equipment } from '../data/schemas/EquipmentSchema';
import './CompendiumScreen.css';

type TabType = 'djinn' | 'units' | 'equipment';

const TABS = [
  { id: 'djinn' as TabType, label: 'Djinn Collection', icon: '✨' },
  { id: 'units' as TabType, label: 'Unit Roster', icon: '⚔️' },
  { id: 'equipment' as TabType, label: 'Equipment Catalog', icon: '🛡️' },
];

// Element color mapping
const ELEMENT_COLORS: Record<string, string> = {
  Venus: '#9b6b3f',
  Mars: '#d14545',
  Mercury: '#4a90d9',
  Jupiter: '#9b59b6',
};

// Get element color
function getElementColor(element: string): string {
  return ELEMENT_COLORS[element] || '#888';
}

// Djinn tier labels
const TIER_LABELS: Record<string, string> = {
  '1': 'Tier 1',
  '2': 'Tier 2',
  '3': 'Tier 3',
};

// Equipment tier labels
const EQUIPMENT_TIER_LABELS: Record<string, string> = {
  basic: 'Basic',
  bronze: 'Bronze',
  iron: 'Iron',
  steel: 'Steel',
  silver: 'Silver',
  mythril: 'Mythril',
  legendary: 'Legendary',
  artifact: 'Artifact',
};

// Djinn Card Component
function DjinnCard({ djinn }: { djinn: Djinn }) {
  return (
    <div class="compendium-card" style={{ borderColor: getElementColor(djinn.element) }}>
      <div class="compendium-card-header">
        <h3 class="compendium-card-title">{djinn.name}</h3>
        <span class="compendium-card-element" style={{ backgroundColor: getElementColor(djinn.element) }}>
          {djinn.element}
        </span>
      </div>
      <div class="compendium-card-body">
        <div class="compendium-card-tier">{TIER_LABELS[djinn.tier] || djinn.tier}</div>
        <div class="compendium-card-section">
          <h4>Summon Effect</h4>
          <p class="compendium-card-description">{djinn.summonEffect.description}</p>
          {djinn.summonEffect.type === 'damage' && djinn.summonEffect.damage && (
            <p class="compendium-card-stat">Damage: {djinn.summonEffect.damage}</p>
          )}
          {djinn.summonEffect.type === 'heal' && djinn.summonEffect.healAmount && (
            <p class="compendium-card-stat">Heal: {djinn.summonEffect.healAmount}</p>
          )}
          {djinn.summonEffect.type === 'buff' && djinn.summonEffect.statBonus && (
            <p class="compendium-card-stat">
              Bonus: {Object.entries(djinn.summonEffect.statBonus).map(([stat, value]) => (stat.toUpperCase() + ' +' + value)).join(', ')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Unit Card Component
function UnitCard({ unit }: { unit: UnitDefinition }) {
  return (
    <div class="compendium-card" style={{ borderColor: getElementColor(unit.element) }}>
      <div class="compendium-card-header">
        <h3 class="compendium-card-title">{unit.name}</h3>
        <span class="compendium-card-element" style={{ backgroundColor: getElementColor(unit.element) }}>
          {unit.element}
        </span>
      </div>
      <div class="compendium-card-body">
        <div class="compendium-card-role">{unit.role}</div>
        <p class="compendium-card-description">{unit.description}</p>
        <div class="compendium-card-section">
          <h4>Base Stats (Level 1)</h4>
          <div class="compendium-card-stats">
            <div class="compendium-stat">HP: {unit.baseStats.hp}</div>
            <div class="compendium-stat">PP: {unit.baseStats.pp}</div>
            <div class="compendium-stat">ATK: {unit.baseStats.atk}</div>
            <div class="compendium-stat">DEF: {unit.baseStats.def}</div>
            <div class="compendium-stat">MAG: {unit.baseStats.mag}</div>
            <div class="compendium-stat">SPD: {unit.baseStats.spd}</div>
          </div>
        </div>
        <div class="compendium-card-section">
          <h4>Abilities</h4>
          <p class="compendium-card-stat">{unit.abilities.length} abilities available</p>
        </div>
      </div>
    </div>
  );
}

// Equipment Card Component
function EquipmentCard({ equipment }: { equipment: Equipment }) {
  return (
    <div class="compendium-card" style={{ borderColor: '#888' }}>
      <div class="compendium-card-header">
        <h3 class="compendium-card-title">{equipment.name}</h3>
        <span class="compendium-card-tier-badge">
          {EQUIPMENT_TIER_LABELS[equipment.tier] || equipment.tier}
        </span>
      </div>
      <div class="compendium-card-body">
        <div class="compendium-card-slot">{equipment.slot.toUpperCase()}</div>
        <div class="compendium-card-section">
          <h4>Cost</h4>
          <p class="compendium-card-stat">{equipment.cost} Gold</p>
        </div>
        <div class="compendium-card-section">
          <h4>Stat Bonuses</h4>
          <div class="compendium-card-stats">
            {Object.entries(equipment.statBonus).map(([stat, value]) => (
              <div key={stat} class="compendium-stat">
                {stat.toUpperCase()}: {value > 0 ? '+' : ''}{value}
              </div>
            ))}
          </div>
        </div>
        {equipment.allowedElements && equipment.allowedElements.length > 0 && (
          <div class="compendium-card-section">
            <h4>Allowed Elements</h4>
            <div class="compendium-element-tags">
              {equipment.allowedElements.map((element) => (
                <span
                  key={element}
                  class="compendium-element-tag"
                  style={{ backgroundColor: getElementColor(element) }}
                >
                  {element}
                </span>
              ))}
            </div>
          </div>
        )}
        {equipment.unlocksAbility && (
          <div class="compendium-card-section">
            <h4>Unlocks Ability</h4>
            <p class="compendium-card-stat">{equipment.unlocksAbility}</p>
          </div>
        )}
        {equipment.elementalResist && (
          <div class="compendium-card-section">
            <h4>Elemental Resist</h4>
            <p class="compendium-card-stat">{(equipment.elementalResist * 100).toFixed(0)}%</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function CompendiumScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [activeTab, setActiveTab] = useState<TabType>('djinn');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Get data for current tab - filter out tower-exclusive content
  const djinnList = Object.values(DJINN).filter(d => !d.availableIn || d.availableIn.length === 0);
  const unitsList = Object.values(UNIT_DEFINITIONS).filter(u => !u.availableIn || u.availableIn.length === 0);
  const equipmentList = Object.values(EQUIPMENT).filter(e => !e.availableIn || e.availableIn.length === 0);

  // Get current list based on active tab
  const getCurrentList = () => {
    switch (activeTab) {
      case 'djinn':
        return djinnList;
      case 'units':
        return unitsList;
      case 'equipment':
        return equipmentList;
      default:
        return [];
    }
  };

  const currentList = getCurrentList();

  // Reset selected index when tab changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [activeTab]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // ESC to return to menu
      if (event.key === 'Escape') {
        event.preventDefault();
        setScreen('menu');
        return;
      }

      // Tab navigation: Q/E or Left/Right arrows
      if (event.key === 'q' || event.key === 'Q') {
        event.preventDefault();
        const currentTabIndex = TABS.findIndex(tab => tab.id === activeTab);
        const prevTabIndex = currentTabIndex > 0 ? currentTabIndex - 1 : TABS.length - 1;
        const prevTab = TABS[prevTabIndex];
        if (prevTab?.id) setActiveTab(prevTab.id);
        return;
      }

      if (event.key === 'e' || event.key === 'E') {
        event.preventDefault();
        const currentTabIndex = TABS.findIndex(tab => tab.id === activeTab);
        const nextTabIndex = currentTabIndex < TABS.length - 1 ? currentTabIndex + 1 : 0;
        const nextTab = TABS[nextTabIndex];
        if (nextTab?.id) setActiveTab(nextTab.id);
        return;
      }

      // Arrow navigation for cards
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : currentList.length - 1));
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((prev) => (prev < currentList.length - 1 ? prev + 1 : 0));
        return;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeTab, currentList.length, setScreen]);

  // Render cards based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'djinn':
        return (
          <div class="compendium-grid">
            {djinnList.map((djinn, index) => (
              <div key={djinn.id} class={selectedIndex === index ? 'selected' : ''}>
                <DjinnCard djinn={djinn} />
              </div>
            ))}
          </div>
        );
      case 'units':
        return (
          <div class="compendium-grid">
            {unitsList.map((unit, index) => (
              <div key={unit.id} class={selectedIndex === index ? 'selected' : ''}>
                <UnitCard unit={unit} />
              </div>
            ))}
          </div>
        );
      case 'equipment':
        return (
          <div class="compendium-grid">
            {equipmentList.map((equipment, index) => (
              <div key={equipment.id} class={selectedIndex === index ? 'selected' : ''}>
                <EquipmentCard equipment={equipment} />
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div class="compendium-screen">
      <div class="compendium-header">
        <h1 class="compendium-title">Compendium</h1>
        <div class="compendium-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              class={`compendium-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span class="compendium-tab-icon">{tab.icon}</span>
              <span class="compendium-tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div class="compendium-content">
        {renderContent()}
      </div>

      <div class="compendium-footer">
        <div class="compendium-help">
          <span>Q/E: Switch Tabs</span>
          <span>↑/↓: Navigate</span>
          <span>ESC: Return to Menu</span>
        </div>
        <div class="compendium-count">
          {currentList.length} {activeTab === 'djinn' ? 'Djinn' : activeTab === 'units' ? 'Units' : 'Items'}
        </div>
      </div>
    </div>
  );
}
