import { VillageActivity, VillageBuildingCommand } from "@rpg-village/core/features/village";

import { createState, test } from "../../utils";

test("should start building activity with blacksmith", {
  initState: createState(({ village }) => [
    village({ id: "villageId", stash: { resource: { gold: 100 } }, buildings: { blacksmith: 0 } }),
  ]),
  commands: [{ command: VillageBuildingCommand.BuildBlacksmith, args: { villageId: "villageId" } }],
  expectedState: (state, t) =>
    t.withRandomId(state.activities, { name: VillageActivity.Build, startArgs: { targetBuilding: "blacksmith" } }),
});

test("should reduce the village resouce by the blacksmith cost", {
  initState: createState(({ village }) => [
    village({ id: "villageId", stash: { resource: { gold: 100 } }, buildings: { blacksmith: 0 } }),
  ]),
  commands: [{ command: VillageBuildingCommand.BuildBlacksmith, args: { villageId: "villageId" } }],
  expectedState: { villages: { villageId: { stash: { resource: { gold: 0 } } } } },
});
