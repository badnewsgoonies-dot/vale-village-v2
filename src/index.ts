import { installGameDriver } from './driver';
import { store } from './state/store';

// Wire the game store to the driver contract so agents can control the game
installGameDriver({
  getState: store.getState,
  dispatch: store.dispatch as any,
  resetRun: store.resetRun,
});

export default store;
