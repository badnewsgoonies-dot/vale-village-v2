import { useFlowStore } from '../../store/gameStore';

export default function Component2() {
  // Read only the flow properties needed and the action to mutate them
  const { isTransitioning, setTransitioning } = useFlowStore((s) => ({
    isTransitioning: s.flow.isTransitioning,
    setTransitioning: s.setTransitioning,
  }));

  return (
    <div>
      <div>Transitioning: {isTransitioning ? 'Yes' : 'No'}</div>
      <button onClick={() => setTransitioning(!isTransitioning)}>
        Toggle Transition
      </button>
    </div>
  );
}
