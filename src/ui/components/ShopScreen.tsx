// @ts-nocheck
/**
 * ShopScreen Component
 * Redesigned with Golden Sun aesthetic
 */

import { JSX } from 'preact';
import { useEffect, useState, useRef } from 'preact/hooks';
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
import './ShopScreen.css';
import type { Equipment } from '../../data/schemas/EquipmentSchema';
import type { Unit } from '../../core/models/Unit';
import { isAvailableInCampaign } from '../utils/contentAvailability';

interface ShopScreenProps {
  shopId: string;
  onClose: () => void;
}

export function ShopScreen({ shopId, onClose }: ShopScreenProps): JSX.Element {
  const { gold, addGold, addEquipment, team, updateTeamUnits } = useStore((s) => ({
    gold: s.gold,
    addGold: s.addGold,
    addEquipment: s.addEquipment,
    team: s.team,
    updateTeamUnits: s.updateTeamUnits,
  }));

  const storyFlags = useStore((s) => s.story.flags);

  const [error, setError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      onClose();
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [onClose]);

  useEffect(() => {
    if (modalRef.current) {
      try {
        modalRef.current.focus();
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const shop = SHOPS[shopId];
  if (!shop) {
    return (
      <div class="shop-screen-overlay" onClick={onClose}>
        <div class="shop-screen-container gs-window gs-window--layered" onClick={(e) => e.stopPropagation()}>
          <div class="shop-error">Shop not found: {shopId}</div>
          <button class="gs-button" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  // Filter available items based on unlock condition
  const isUnlocked = !shop.unlockCondition || shop.unlockCondition(storyFlags as Record<string, boolean>);
  const availableItems = isUnlocked
    ? (shop.availableItems
        .map((id) => EQUIPMENT[id])
        .filter((item): item is Equipment => Boolean(item))
        .filter(isAvailableInCampaign))
    : [];

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

  const handleStarterKitPurchase = (unitId: string) => {
    if (!team) return;
    const unit = team.units.find(u => u.id === unitId);
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

  return (
    <div class="shop-screen-overlay" onClick={onClose}>
      <div class="shop-screen-container gs-window gs-window--layered" ref={modalRef} tabIndex={-1} role="dialog" aria-modal="true" data-testid="shop-screen" onClick={(e) => e.stopPropagation()} style={{ minWidth: 800, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div class="shop-header">
          <h1 class="gs-title" style={{ margin: '0.5rem 0' }}>{shop.name}</h1>
          <button class="close-btn" onClick={onClose} aria-label="Close shop">
            ×
          </button>
        </div>

        <div class="shop-top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', marginBottom: '1rem' }}>
          <div class="shop-note" style={{ fontSize: '0.85rem', color: '#a8b3c0', maxWidth: '60%' }}>
            Unlock shared, element-locked equipment for your roster.
          </div>
          <div class="shop-gold">
            <span class="gs-label">Gold:</span>
            <span class="gs-value" style={{ marginLeft: '0.5rem', fontSize: '1.2rem' }}>{gold}g</span>
          </div>
        </div>

        {error && (
          <div class="shop-error gs-window gs-window--layered" style={{ background: 'rgba(100, 0, 0, 0.2)', padding: '0.5rem', marginBottom: '1rem', color: '#ffb3b3', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div class="shop-content no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '0 0.5rem' }}>
          {starterKitEntries.length > 0 && (
            <section class="starter-kits-section" style={{ marginBottom: '2rem' }}>
              <h2 class="gs-label" style={{ borderBottom: '1px solid rgba(255,216,127,0.2)', paddingBottom: '0.25rem', marginBottom: '1rem' }}>Starter Kits</h2>
              <div class="shop-items-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                {starterKitEntries.map(({ unit, kit }) => {
                  const affordable = gold >= kit.cost;
                  return (
                    <div key={unit.id} class="shop-item-card gs-window gs-window--layered" style={{ background: 'rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div class="item-details">
                        <div class="gs-value" style={{ fontSize: '1.1rem' }}>{kit.name}</div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                          <span class="gs-label" style={{ fontSize: '0.7rem' }}>{unit.name}</span>
                          <span class="gs-value" style={{ fontSize: '0.7rem' }}>{kit.cost}g</span>
                        </div>
                      </div>
                      <button class={`gs-button ${affordable ? '' : 'disabled'}`} onClick={() => handleStarterKitPurchase(unit.id)} disabled={!affordable} style={{ justifyContent: 'center', padding: '0.5rem' }}>
                        Purchase Kit
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {unlockedUnits.map((unit) => {
            const availableEquipment = Object.values(EQUIPMENT).filter(
              (item) => isAvailableInCampaign(item) && item.allowedElements.includes(unit.element)
            );
            if (availableEquipment.length === 0) return null;
            return (
              <section key={unit.id} class="unit-store-section" style={{ marginBottom: '2rem' }}>
                <h2 class="gs-label" style={{ borderBottom: '1px solid rgba(255,216,127,0.2)', paddingBottom: '0.25rem', marginBottom: '1rem' }}>{unit.name}&apos;s Equipment</h2>
                <div class="shop-items-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                  {availableEquipment.map((item) => {
                    const affordable = canAffordItem(gold, item.id);
                    return (
                      <div key={`${unit.id}-${item.id}`} class="shop-item-card gs-window gs-window--layered" style={{ background: 'rgba(0,0,0,0.15)', display: 'flex', gap: '1rem' }}>
                        <EquipmentIcon equipment={item} size="medium" />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <div class="gs-value">{item.name}</div>
                          <div class="item-price gs-label">{item.cost}g</div>
                          <button class={`gs-button ${affordable ? '' : 'disabled'}`} onClick={() => handleUnitEquipmentPurchase(unit, item.id)} disabled={!affordable} style={{ fontSize: '0.8rem', padding: '0.4rem' }}>
                            Buy for {unit.name}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <div class="shop-footer" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', padding: '1rem', borderTop: '1px solid rgba(255,216,127,0.1)' }}>
          <button class="gs-button" onClick={onClose} style={{ minWidth: 150, justifyContent: 'center' }}>
            Leave Shop
          </button>
        </div>
      </div>
    </div>
  );
}
