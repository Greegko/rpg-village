import { VillageActivity, VillageCommand } from "@modules/village";

import { test } from "../../utils";

test("should start a build activity when gold is enough", {
  initState: { village: { stash: { resource: { gold: 100 } }, trainingField: 0 } },
  commands: [VillageCommand.BuildTrainingField],
  expectedState: (state, t) =>
    t.withRandomId(state.activities, { name: VillageActivity.Build, startArgs: { targetBuilding: "trainingField" } }),
});

test("should block the second command for building", {
  initState: { village: { stash: { resource: { gold: 1000 } }, trainingField: 0 } },
  commands: [VillageCommand.BuildTrainingField, VillageCommand.BuildTrainingField],
  expectedState: [
    (state, t) =>
      t.withRandomId(state.activities, { name: VillageActivity.Build, startArgs: { targetBuilding: "trainingField" } }),
    (state, t) => t.deepEqual(state.village, { stash: { resource: { gold: 900 } }, trainingField: 0 }),
  ],
});
