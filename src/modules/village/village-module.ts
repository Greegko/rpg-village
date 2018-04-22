import { Module } from "@greegko/rpg-model";
import { VillageStore } from "./village-store";
import { VillageEventHandler } from "./village-event-handler";
import { StashLootActivity, VillageHealActivity } from "./activities";
import { VillageStash } from "./village-stash";

export const villageModule: Module = {
  eventHandlers: [{ eventHandler: VillageEventHandler }],
  activities: [
    { type: 'stash-loot', activity: StashLootActivity },
    { type: 'village-heal', activity: VillageHealActivity }
  ],
  stores: [{ scope: 'village', store: VillageStore }],
  provides: [VillageStash]
};
