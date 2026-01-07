import { test, expect } from "vitest";
import { ENEMIES } from "../../../src/data/definitions/enemies";

test("mire-toad is defined and has expected properties", () => {
  const e = ENEMIES["mire-toad"];
  expect(e).toBeDefined();
  expect(e.id).toBe("mire-toad");
  expect(e.level).toBe(2);
  expect(e.element).toBe("Mercury");
  expect(e.stats).toHaveProperty("hp");
  expect(Array.isArray(e.abilities)).toBe(true);
});
