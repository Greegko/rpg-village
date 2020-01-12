import { Module } from "../../models";
import { VillageStore } from "./village-store";
import { VillageCommandHandler } from "./village-command-handler";
import { VillageHealActivity } from "./activities";
import { VillageStash } from "./village-stash";
import { VillageEventHandler } from "./village-event-handler";
import { VillageActivity } from "./interfaces";

export const villageModule: Module = {
  eventHandler: VillageEventHandler,
  commandHandler: VillageCommandHandler,
  activities: [
    { type: VillageActivity.Heal, activity: VillageHealActivity }
  ],
  stores: [{ scope: 'village', store: VillageStore, initialState: { houses: 0, stash: { resource: {}, items: [] }, locationId: undefined, heroes: [] } }],
  provides: [VillageStash]
};
