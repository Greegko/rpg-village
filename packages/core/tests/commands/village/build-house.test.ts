import { VillageActivity, VillageCommand } from "@features/village";

import { test } from "../../utils";

const initState = {
  village: { id: "village-id", stash: { resource: { gold: 20 } }, houses: 0 },
};

test("should start a building acitivity for houses", {
  initState,
  commands: [{ command: VillageCommand.BuildHouse, args: { villageId: "village-id" } }],
  expectedState: (state, t) =>
    t.withRandomId(state.activities, { name: VillageActivity.Build, startArgs: { targetBuilding: "houses" } }),
});

test("should reduce the village resouce by the house cost", {
  initState,
  commands: [{ command: VillageCommand.BuildHouse, args: { villageId: "village-id" } }],
  expectedState: { village: { stash: { resource: { gold: 0 } } } },
});
