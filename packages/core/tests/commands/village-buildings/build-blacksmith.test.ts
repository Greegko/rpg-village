import { VillageActivity } from "@features/village";
import { VillageBuildingsCommand } from "@features/village-buildings";

import { test } from "../../utils";

const initState = {
  village: { stash: { resource: { gold: 100 } }, blacksmith: 0 },
};

test("should start building activity with blacksmith", {
  initState,
  commands: [VillageBuildingsCommand.BuildBlacksmith],
  expectedState: (state, t) =>
    t.withRandomId(state.activities, { name: VillageActivity.Build, startArgs: { targetBuilding: "blacksmith" } }),
});

test("should reduce the village resouce by the blacksmith cost", {
  initState,
  commands: [VillageBuildingsCommand.BuildBlacksmith],
  expectedState: { village: { stash: { resource: { gold: 0 } } } },
});
