import { VillageActivity, VillageCommand } from "@modules/village";

import { test } from "../../utils";

const initState = {
  village: { stash: { resource: { gold: 20 } }, houses: 0 },
};

test("should start a building acitivity for houses", {
  initState,
  commands: [VillageCommand.BuildHouse],
  expectedState: (state, t) =>
    t.withRandomId(state.activities, { name: VillageActivity.Build, startArgs: { targetBuilding: "houses" } }),
});

test("should reduce the village resouce by the house cost", {
  initState,
  commands: [VillageCommand.BuildHouse],
  expectedState: { village: { stash: { resource: { gold: 0 } } } },
});
