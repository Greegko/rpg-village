import { VillageActivity } from "@features/village";
import { VillageBuildingsCommand } from "@features/village-buildings";

import { test } from "../../utils";

test("should start a build activity when gold is enough", {
  initState: { village: { id: "village-id", stash: { resource: { gold: 100 } }, trainingField: 0 } },
  commands: [{ command: VillageBuildingsCommand.BuildTrainingField, args: { villageId: "village-id" } }],
  expectedState: (state, t) =>
    t.withRandomId(state.activities, { name: VillageActivity.Build, startArgs: { targetBuilding: "trainingField" } }),
});

test("should block the second command for building", {
  initState: { village: { id: "village-id", stash: { resource: { gold: 1000 } }, trainingField: 0 } },
  commands: [{ command: VillageBuildingsCommand.BuildTrainingField, args: { villageId: "village-id" } }],
  expectedState: [
    (state, t) =>
      t.withRandomId(state.activities, { name: VillageActivity.Build, startArgs: { targetBuilding: "trainingField" } }),
    (state, t) =>
      t.deepEqual(state.village, { id: "village-id", stash: { resource: { gold: 900 } }, trainingField: 0 }),
  ],
});
