// Minimal ambient module declarations to satisfy TypeScript for zustand imports and vitest in tests

declare module 'zustand' {
  export type SetState<T> = (
    partial: Partial<T> | ((state: T) => Partial<T>),
    replace?: boolean
  ) => void;
  export type GetState<T> = () => T;
  export type StoreApi<T> = {
    setState: SetState<T>;
    getState: GetState<T>;
    subscribe: (listener: () => void) => () => void;
    destroy?: () => void;
  };
  export type StateCreator<T, M = any, A = any, U = T> = (
    set: SetState<T>,
    get: GetState<T>,
    api: StoreApi<T>
  ) => U;

  export function create<T>(creator: StateCreator<T, any, any, T>): any;
  export function useStore<T>(): T;
  export default create;
}

declare module 'zustand/traditional' {
  export function createWithEqualityFn<T>(): (
    fn: (set: any, get: any, api: any) => T
  ) => any;
}

declare module 'zustand/middleware' {
  export function devtools<T>(
    fn: (set: any, get: any, api: any) => T,
    opts?: any
  ): (set: any, get: any, api: any) => T;
}

declare module 'zustand/vanilla' {
  export type StoreApi<T> = import('zustand').StoreApi<T>;
}

// Minimal vitest ambient for tests under src/ui/state/__tests__
declare module 'vitest' {
  export const describe: any;
  export const it: any;
  export const test: any;
  export const expect: any;
  export const beforeEach: any;
  export const afterEach: any;
  export const vi: any;
}
