import { VillageActivity } from "@features/village";
import { VillageBuildingsCommand } from "@features/village-buildings";

import { test } from "../../utils";

const initState = {
  village: { id: "village-id", stash: { resource: { gold: 100 } }, trainingField: 0 },
};

test("should build a trainingField", {
  initState,
  commands: [{ command: VillageBuildingsCommand.BuildTrainingField, args: { villageId: "village-id" } }],
  expectedState: (state, t) =>
    t.withRandomId(state.activities, { name: VillageActivity.Build, startArgs: { targetBuilding: "trainingField" } }),
});

test("should reduce the village resouce by the trainingField cost", {
  initState,
  commands: [{ command: VillageBuildingsCommand.BuildTrainingField, args: { villageId: "village-id" } }],
  expectedState: { village: { stash: { resource: { gold: 0 } } } },
});
