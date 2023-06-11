import { Module } from "@core";

import { VillageBuildActivity, VillageHealActivity } from "./activities";
import { VillageActivity, VillageConfig } from "./interfaces";
import { VillageCommandHandler } from "./village-command-handler";
import { VillageEventHandler } from "./village-event-handler";
import { VillageStashService } from "./village-stash-service";
import { VillageStore } from "./village-store";

export const villageModule: Module = {
  activities: [
    { name: VillageActivity.Heal, activity: VillageHealActivity },
    { name: VillageActivity.Build, activity: VillageBuildActivity },
  ],
  stores: [
    {
      scope: "village",
      store: VillageStore,
      initialState: {
        houses: 0,
        blacksmith: 0,
        portals: 0,
        trainingField: 0,
        runeWorkshop: 0,
        shop: undefined,

        stash: { resource: { gold: 0, soul: 0 }, items: [] },
        locationId: undefined,
        heroes: [],
      },
    },
  ],
  defaultConfig: { [VillageConfig.DirectLootToVillage]: false },
  provides: [VillageStashService, VillageEventHandler, VillageCommandHandler],
};
