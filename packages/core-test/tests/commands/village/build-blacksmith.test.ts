import { VillageActivity, VillageCommand } from "@rpg-village/core";

import { test } from "../../utils";

const initState = {
  village: { stash: { resource: { gold: 100 } }, blacksmith: 0 },
};

test("should start building activity with blacksmith", {
  initState,
  commands: [VillageCommand.BuildBlacksmith],
  expectedState: (state, t) => t.withRandomId(state.activities, { name: VillageActivity.Build, startArgs: { targetBuilding: 'blacksmith' } }),
});

test("should reduce the village resouce by the blacksmith cost", {
  initState,
  commands: [VillageCommand.BuildBlacksmith],
  expectedState: { village: { stash: { resource: { gold: 0 } } } },
});
