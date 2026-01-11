import inputManager from "../../input/InputManager";
import GameLoop from "../../core/GameLoop";

export default function bootstrapEngine() {
  inputManager.init();
  const loop = new GameLoop();
  if (typeof window !== "undefined") {
    // expose for debugging and testing
    window.__GAME_LOOP__ = loop;
  }
  loop.start();
  return loop;
}

// Auto-bootstrap in browser environments so external scripts can push to window.__INPUT_BUFFER__ immediately
if (typeof window !== "undefined") {
  bootstrapEngine();
}
