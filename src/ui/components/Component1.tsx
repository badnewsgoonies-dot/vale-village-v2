import { useFlowStore } from '../../store/gameStore';

export default function Component1() {
  // Use the flow slice to avoid pulling the entire store and keep selectors typed
  const { screen, startTransition } = useFlowStore((s) => ({ screen: s.flow.screen, startTransition: s.startTransition }));

  return (
    <div>
      <div>Current screen: {screen}</div>
      <button onClick={() => startTransition('overworld')}>Go to Overworld</button>
    </div>
  );
}
