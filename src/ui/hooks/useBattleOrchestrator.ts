import { useCallback, useState } from 'preact/hooks';
import { useStore } from '../state/store';

export function useBattleOrchestrator() {
  const [isExecuting, setIsExecuting] = useState(false);
  
  const battle = useStore((s) => s.battle);
  const executeQueuedRound = useStore((s) => s.executeQueuedRound);
  const queueUnitAction = useStore((s) => s.queueUnitAction);
  const clearUnitAction = useStore((s) => s.clearUnitAction);
  const queueDjinnActivation = useStore((s) => s.queueDjinnActivation);
  const unqueueDjinnActivation = useStore((s) => s.unqueueDjinnActivation);
  const events = useStore((s) => s.events);
  const lastError = useStore((s) => s.lastError);
  const clearError = useStore((s) => s.clearError);

  const handleExecuteRound = useCallback(() => {
    if (!battle || battle.phase !== 'planning') return;
    
    setIsExecuting(true);
    executeQueuedRound();
    // Reset local executing state after dispatch (the store updates phase/events)
    setIsExecuting(false);
  }, [battle, executeQueuedRound]);

  return {
    isExecuting,
    handleExecuteRound,
    queueUnitAction,
    clearUnitAction,
    queueDjinnActivation,
    unqueueDjinnActivation,
    events,
    lastError,
    clearError
  };
}
