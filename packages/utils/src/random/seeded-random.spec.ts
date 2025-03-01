import { expect, it } from "vitest";

import { SeededRandom } from "./seeded-random";

it("should resume the previous state", () => {
  const random = SeededRandom.createFromText("test-seed");
  const randomState = random.getState();
  const val = random.next();

  const random2 = SeededRandom.createFromState(randomState);
  const randomState2 = random2.getState();
  const val2 = random2.next();

  expect(randomState).toBe(randomState2);
  expect(val).toBe(val2);
});
