import { expect } from "vitest";

import { VillageActivity, VillageBuildingCommand } from "@/features/village";

import { createState, test } from "@test/utils";

test("should build a trainingField", {
  initState: createState(({ village }) => [
    village({ id: "villageId", stash: { resource: { gold: 100 } }, buildings: { trainingField: 0 } }),
  ]),
  commands: [{ command: VillageBuildingCommand.BuildTrainingField, args: { villageId: "villageId" } }],
  expectedState: state =>
    expect(state.activities).withRandomId({ name: VillageActivity.Build, startArgs: { targetBuilding: "trainingField" } }),
});

test("should reduce the village resouce by the trainingField cost", {
  initState: createState(({ village }) => [
    village({ id: "villageId", stash: { resource: { gold: 100 } }, buildings: { trainingField: 0 } }),
  ]),
  commands: [{ command: VillageBuildingCommand.BuildTrainingField, args: { villageId: "villageId" } }],
  expectedState: { villages: { villageId: { stash: { resource: { gold: 0 } } } } },
});
