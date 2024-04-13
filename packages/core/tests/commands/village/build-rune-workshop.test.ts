import { VillageActivity, VillageBuildingCommand } from "@rpg-village/core";

import { createState, test } from "../../utils";

test("should start a build activity runeWorkshop", {
  initState: createState(({ village }) => [
    village({ id: "villageId", stash: { resource: { gold: 100 } }, buildings: { runeWorkshop: 0 } }),
  ]),
  commands: [{ command: VillageBuildingCommand.BuildRuneWorkshop, args: { villageId: "villageId" } }],
  expectedState: (state, t) =>
    t.withRandomId(state.activities, { name: VillageActivity.Build, startArgs: { targetBuilding: "runeWorkshop" } }),
});

test("should reduce the village resouce by the runeWorkshop cost", {
  initState: createState(({ village }) => [
    village({ id: "villageId", stash: { resource: { gold: 100 } }, buildings: { runeWorkshop: 0 } }),
  ]),
  commands: [{ command: VillageBuildingCommand.BuildRuneWorkshop, args: { villageId: "villageId" } }],
  expectedState: { villages: { villageId: { stash: { resource: { gold: 0 } } } } },
});
