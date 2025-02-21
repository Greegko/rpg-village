import { expect, it } from "vitest";

import { activityModule } from "@rpg-village/features/activity";

import { gameFactory } from "../../utils/game-factory";

it("activities should be executed", () => {
  const game = gameFactory({
    config: { modules: [activityModule] },
    state: { general: { turn: 1 }, activities: {} },
  });

  const state = game.getState();

  expect(state.general.turn).toBe(1);
});
