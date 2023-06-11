import { VillageActivity } from "@features/village";
import { VillageBuildingsCommand } from "@features/village-buildings";

import { test } from "../../utils";

const initState = {
  village: { stash: { resource: { gold: 100 } }, portals: 0 },
};

test("should start a building activity with portals", {
  initState,
  commands: [VillageBuildingsCommand.BuildPortalSummonerStone],
  expectedState: (state, t) =>
    t.withRandomId(state.activities, { name: VillageActivity.Build, startArgs: { targetBuilding: "portals" } }),
});

test("should reduce the village resouce by the portals cost", {
  initState,
  commands: [VillageBuildingsCommand.BuildPortalSummonerStone],
  expectedState: { village: { stash: { resource: { gold: 0 } } } },
});
