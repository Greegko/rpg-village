import { expect, it } from "vitest";

import "@features/activity";

import { gameFactory } from "../../utils/game-factory";

it("activities store should be created", () => {
  const game = gameFactory({
    state: { general: { turn: 1 }, activities: {} },
  });

  const state = game.getState();

  expect(state.activities).toEqual({});
});
