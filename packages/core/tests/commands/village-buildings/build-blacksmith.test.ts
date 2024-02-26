import { VillageActivity } from "@features/village";
import { VillageBuildingsCommand } from "@features/village-buildings";

import { test } from "../../utils";

const initState = {
  village: { id: "village-id", stash: { resource: { gold: 100 } }, blacksmith: 0 },
};

test("should start building activity with blacksmith", {
  initState,
  commands: [{ command: VillageBuildingsCommand.BuildBlacksmith, args: { villageId: "village-id" } }],
  expectedState: (state, t) =>
    t.withRandomId(state.activities, { name: VillageActivity.Build, startArgs: { targetBuilding: "blacksmith" } }),
});

test("should reduce the village resouce by the blacksmith cost", {
  initState,
  commands: [{ command: VillageBuildingsCommand.BuildBlacksmith, args: { villageId: "village-id" } }],
  expectedState: { village: { stash: { resource: { gold: 0 } } } },
});
