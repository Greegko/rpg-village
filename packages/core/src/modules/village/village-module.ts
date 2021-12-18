import { Module } from "@core/module";
import { VillageStore } from "./village-store";
import { VillageCommandHandler } from "./village-command-handler";
import { VillageHealActivity } from "./activities";
import { VillageStashService } from "./village-stash-service";
import { VillageEventHandler } from "./village-event-handler";
import { VillageActivity } from "./interfaces";

export const villageModule: Module = {
  activities: [{ name: VillageActivity.Heal, activity: VillageHealActivity }],
  stores: [
    {
      scope: "village",
      store: VillageStore,
      initialState: {
        houses: 0,
        blacksmith: 0,
        stash: { resource: {}, items: [] },
        locationId: undefined,
        heroes: [],
      },
    },
  ],
  provides: [VillageStashService, VillageEventHandler, VillageCommandHandler],
};
