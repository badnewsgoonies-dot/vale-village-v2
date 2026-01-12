import { useState } from 'preact/hooks';
import { useStore } from '../state/store';
import { 
  buyItem, 
  purchaseStarterKit, 
  purchaseUnitEquipment 
} from '../../core/services/ShopService';
import type { Unit } from '../../core/models/Unit';

export function useShopController() {
  const { gold, addGold, addEquipment, team, updateTeamUnits } = useStore((s) => ({
    gold: s.gold,
    addGold: s.addGold,
    addEquipment: s.addEquipment,
    team: s.team,
    updateTeamUnits: s.updateTeamUnits,
  }));

  const [error, setError] = useState<string | null>(null);

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

  return {
    gold,
    team,
    error,
    setError,
    handleUnlock,
    handleStarterKitPurchase,
    handleUnitEquipmentPurchase,
  };
}
