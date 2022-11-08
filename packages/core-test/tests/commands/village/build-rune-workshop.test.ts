import { VillageActivity, VillageCommand } from "@rpg-village/core";

import { test } from "../../utils";

const initState = {
  village: { stash: { resource: { gold: 100 } }, runeWorkshop: 0 },
};

test("should start a build activity runeWorkshop", {
  initState,
  commands: [VillageCommand.BuildRuneWorkshop],
  expectedState: (state, t) => t.withRandomId(state.activities, { name: VillageActivity.Build, startArgs: { targetBuilding: 'runeWorkshop' } }),
});

test("should reduce the village resouce by the runeWorkshop cost", {
  initState,
  commands: [VillageCommand.BuildRuneWorkshop],
  expectedState: { village: { stash: { resource: { gold: 0 } } } },
});
