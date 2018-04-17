import { Module } from "@greegko/rpg-model";
import { VillageStore } from "./village-store";
import { VillageEventHandler } from "./village-event-handler";
import { Village } from "./village";
import { VillageResource } from "./village-resource";
import { StashLootActivity, VillageHealActivity } from "./activities";

export const villageModule: Module = {
  eventHandlers: [{ eventHandler: VillageEventHandler }],
  activities: [
    { type: 'stash-loot', activity: StashLootActivity },
    { type: 'village-heal', activity: VillageHealActivity }
  ],
  stores: [{ scope: 'village', store: VillageStore }],
  provides: [VillageResource, Village]
};
