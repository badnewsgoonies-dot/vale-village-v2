export type Subscriber<T> = (state: T) => void;

export class StateManager<T extends Record<string, unknown>> {
  private state: T;
  private subscribers: Set<Subscriber<T>> = new Set();

  constructor(initialState: T) {
    // immutably copy initial state
    this.state = { ...initialState };
  }

  getState(): T {
    return { ...this.state };
  }

  setState(patch: Partial<T>) {
    this.state = { ...this.state, ...patch };
    // notify subscribers with a copy to avoid mutation leaks
    const snapshot = this.getState();
    this.subscribers.forEach((s) => s(snapshot));
  }

  subscribe(fn: Subscriber<T>) {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }
}
