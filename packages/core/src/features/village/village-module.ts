import { Module } from "@core";

import { VillageActivityHeal, VillageBuildActivity } from "./activities";
import { VillageActivity, VillageConfig } from "./interfaces";
import { VillageCommandHandler } from "./village-command-handler";
import { VillageEventHandler } from "./village-event-handler";
import { VillageStashService } from "./village-stash-service";
import { VillageStore } from "./village-store";

export const villageModule: Module = {
  activities: [
    { name: VillageActivity.Heal, activity: VillageActivityHeal },
    { name: VillageActivity.Build, activity: VillageBuildActivity },
  ],
  stores: [
    {
      scope: "village",
      store: VillageStore,
      initialState: {
        houses: 0,
        stash: { resource: { gold: 0, soul: 0 }, items: [] },
        locationId: undefined,
        heroes: [],
      },
    },
  ],
  defaultConfig: { [VillageConfig.DirectLootToVillage]: false },
  provides: [VillageStashService, VillageEventHandler, VillageCommandHandler],
};
