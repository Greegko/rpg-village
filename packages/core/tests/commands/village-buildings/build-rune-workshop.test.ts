import { VillageActivity } from "@features/village";
import { VillageBuildingsCommand } from "@features/village-buildings";

import { test } from "../../utils";

const initState = {
  village: { id: "village-id", stash: { resource: { gold: 100 } }, runeWorkshop: 0 },
};

test("should start a build activity runeWorkshop", {
  initState,
  commands: [{ command: VillageBuildingsCommand.BuildRuneWorkshop, args: { villageId: "village-id" } }],
  expectedState: (state, t) =>
    t.withRandomId(state.activities, { name: VillageActivity.Build, startArgs: { targetBuilding: "runeWorkshop" } }),
});

test("should reduce the village resouce by the runeWorkshop cost", {
  initState,
  commands: [{ command: VillageBuildingsCommand.BuildRuneWorkshop, args: { villageId: "village-id" } }],
  expectedState: { village: { stash: { resource: { gold: 0 } } } },
});
