import { Module } from "../../models";
import { VillageStore } from "./village-store";
import { VillageCommandHandler } from "./village-command-handler";
import { StashLootActivity, VillageHealActivity } from "./activities";
import { VillageStash } from "./village-stash";

export const villageModule: Module = {
  commandHandlers: [VillageCommandHandler],
  activities: [
    { type: 'stash-loot', activity: StashLootActivity },
    { type: 'village-heal', activity: VillageHealActivity }
  ],
  stores: [{ scope: 'village', store: VillageStore, initialState: { houses: 0, stash: { resource: {}, items: [] }, locationId: undefined, heroes: [] } }],
  provides: [VillageStash]
};
