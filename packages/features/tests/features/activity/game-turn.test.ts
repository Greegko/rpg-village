import test from "ava";

import { activityModule } from "@rpg-village/features/activity";

import { gameFactory } from "../../utils/game-factory";

test("activities should be executed", t => {
  const game = gameFactory({
    config: { modules: [activityModule] },
    state: { general: { turn: 1 }, activities: {} },
  });

  const state = game.getState();

  t.is(state.general.turn, 1);
});
