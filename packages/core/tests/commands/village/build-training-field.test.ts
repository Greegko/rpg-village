import { VillageActivity, VillageCommand } from "@modules/village";

import { test } from "../../utils";

const initState = {
  village: { stash: { resource: { gold: 100 } }, trainingField: 0 },
};

test("should build a trainingField", {
  initState,
  commands: [VillageCommand.BuildTrainingField],
  expectedState: (state, t) =>
    t.withRandomId(state.activities, { name: VillageActivity.Build, startArgs: { targetBuilding: "trainingField" } }),
});

test("should reduce the village resouce by the trainingField cost", {
  initState,
  commands: [VillageCommand.BuildTrainingField],
  expectedState: { village: { stash: { resource: { gold: 0 } } } },
});
