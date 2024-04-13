import { VillageActivity, VillageBuildingCommand } from "@rpg-village/core/features/village";

import { createState, test } from "../../utils";

test("should start a building acitivity for houses", {
  initState: createState(({ village }) => [
    village({ id: "villageId", stash: { resource: { gold: 20 } }, buildings: { houses: 0 } }),
  ]),
  commands: [{ command: VillageBuildingCommand.BuildHouse, args: { villageId: "villageId" } }],
  expectedState: (state, t) =>
    t.withRandomId(state.activities, { name: VillageActivity.Build, startArgs: { targetBuilding: "houses" } }),
});

test("should reduce the village resouce by the house cost", {
  initState: createState(({ village }) => [
    village({ id: "villageId", stash: { resource: { gold: 20 } }, buildings: { houses: 0 } }),
  ]),
  commands: [{ command: VillageBuildingCommand.BuildHouse, args: { villageId: "villageId" } }],
  expectedState: { villages: { villageId: { stash: { resource: { gold: 0 } } } } },
});
