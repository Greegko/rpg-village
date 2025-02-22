import { expect } from "vitest";

import { VillageActivity, VillageBuilding, VillageBuildingCommand, VillageEvent } from "@/features/village";

import { createState, test } from "@test/utils";

test("should start a building acitivity for houses", {
  initState: createState(({ village }) => [village({ id: "villageId", stash: { resource: { gold: 100 } }, buildings: {} })]),
  commands: [{ command: VillageBuildingCommand.BuildShop, args: { villageId: "villageId" } }],
  expectedState: state => expect(state.activities).withRandomId({ name: VillageActivity.Build, startArgs: { targetBuilding: "shop" } }),
});

test("should reduce the village resouce by the house cost", {
  initState: createState(({ village }) => [village({ id: "villageId", stash: { resource: { gold: 100 } }, buildings: {} })]),
  commands: [{ command: VillageBuildingCommand.BuildShop, args: { villageId: "villageId" } }],
  expectedState: { villages: { villageId: { stash: { resource: { gold: 0 } } } } },
});

test("should increase level", {
  initState: createState(({ village }) => [village({ id: "villageId", buildings: { shop: { level: 1 } } })]),
  event: { event: VillageEvent.BuildingBuilt, args: { villageId: "villageId", buildingType: VillageBuilding.Shop } },
  expectedState: { villages: { villageId: { buildings: { shop: { level: 2 } } } } },
});

test("should create shop when it was undefined", {
  initState: createState(({ village }) => [village({ id: "villageId", buildings: {} })]),
  event: { event: VillageEvent.BuildingBuilt, args: { villageId: "villageId", buildingType: VillageBuilding.Shop } },
  expectedState: { villages: { villageId: { buildings: { shop: { level: 1 } } } } },
});

test("should generate new items on built event", {
  initState: createState(({ village }) => [village({ id: "villageId", buildings: {} })]),
  event: { event: VillageEvent.BuildingBuilt, args: { villageId: "villageId", buildingType: VillageBuilding.Shop } },
  expectedState: state => expect(state.villages.villageId.buildings.shop!.items).not.toHaveLength(0),
});
