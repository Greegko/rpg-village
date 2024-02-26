import { VillageActivity } from "@features/village";
import { VillageBuildingsCommand } from "@features/village-buildings";

import { test } from "../../utils";

const initState = {
  village: { id: "village-id", stash: { resource: { gold: 100 } }, portals: 0 },
};

test("should start a building activity with portals", {
  initState,
  commands: [{ command: VillageBuildingsCommand.BuildPortalSummonerStone, args: { villageId: "village-id" } }],
  expectedState: (state, t) =>
    t.withRandomId(state.activities, { name: VillageActivity.Build, startArgs: { targetBuilding: "portals" } }),
});

test("should reduce the village resouce by the portals cost", {
  initState,
  commands: [{ command: VillageBuildingsCommand.BuildPortalSummonerStone, args: { villageId: "village-id" } }],
  expectedState: { village: { stash: { resource: { gold: 0 } } } },
});
