import { expect } from "vitest";

import { VillageActivity, VillageBuildingCommand } from "@/features/village";

import { createState, test } from "@test/utils";

test("should start a building activity with portals", {
  initState: createState(({ village }) => [
    village({ id: "villageId", stash: { resource: { gold: 100 } }, buildings: { portalSummoningStone: 0 } }),
  ]),
  commands: [{ command: VillageBuildingCommand.BuildPortalSummoningStone, args: { villageId: "villageId" } }],
  expectedState: state =>
    expect(state.activities).withRandomId({
      name: VillageActivity.Build,
      startArgs: { targetBuilding: "portalSummoningStone" },
    }),
});

test("should reduce the village resouce by the portals cost", {
  initState: createState(({ village }) => [
    village({ id: "villageId", stash: { resource: { gold: 100 } }, buildings: { portalSummoningStone: 0 } }),
  ]),
  commands: [{ command: VillageBuildingCommand.BuildPortalSummoningStone, args: { villageId: "villageId" } }],
  expectedState: { villages: { villageId: { stash: { resource: { gold: 0 } } } } },
});
