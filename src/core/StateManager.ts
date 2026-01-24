// Small, well-typed state manager for core engine
// No magic numbers; simple, deterministic behaviour for unit testing and wiring.

export type Action = { type: string; payload?: any };
export type Reducer<S> = (state: S, action: Action) => S;

export class StateManager<S = Record<string, unknown>> {
  private state: S;
  private reducer: Reducer<S>;
  private listeners: Set<() => void> = new Set();

  constructor(reducer: Reducer<S>, initialState: S) {
    this.reducer = reducer;
    this.state = initialState;
  }

  getState(): S {
    return this.state;
  }

  dispatch(action: Action): S {
    const next = this.reducer(this.state, action);
    if (next !== this.state) {
      this.state = next;
      // notify a snapshot of listeners to avoid mutation during iteration
      for (const l of Array.from(this.listeners)) l();
    }
    return this.state;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  replaceReducer(reducer: Reducer<S>): void {
    this.reducer = reducer;
  }
}

export default StateManager;
