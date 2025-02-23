import { expect } from "vitest";

import { VillageActivity, VillageBuildingCommand } from "@/features/village";

import { createState, test } from "@test/utils";

test("should start building activity with blacksmith", {
  initState: createState(({ village }) => [village({ id: "villageId", stash: { resource: { gold: 100 } }, buildings: { blacksmith: 0 } })]),
  commands: [{ command: VillageBuildingCommand.BuildBlacksmith, args: { villageId: "villageId" } }],
  expectedState: state =>
    expect(state.activities).withRandomId({ name: VillageActivity.Build, startArgs: { targetBuilding: "blacksmith" } }),
});

test("should reduce the village resouce by the blacksmith cost", {
  initState: createState(({ village }) => [village({ id: "villageId", stash: { resource: { gold: 100 } }, buildings: { blacksmith: 0 } })]),
  commands: [{ command: VillageBuildingCommand.BuildBlacksmith, args: { villageId: "villageId" } }],
  expectedState: { villages: { villageId: { stash: { resource: { gold: 0 } } } } },
});
