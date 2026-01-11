import { useFlowStore, useTeamStore } from '../../store/gameStore';

export default function Component3() {
  // Use the team slice for playerData to read inventory safely
  const itemCount = useTeamStore((s) => s.playerData.inventory.items.length);
  const openModal = useFlowStore((s) => s.openModal);

  return (
    <div>
      <div>Inventory items: {itemCount}</div>
      <button onClick={() => openModal('inventory')}>Open Inventory</button>
    </div>
  );
}
