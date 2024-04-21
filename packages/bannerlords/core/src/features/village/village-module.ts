import { Module } from "@rpg-village/core";

import { VillageEventHandler } from "./village-event-handler";
import { VillageStore } from "./village-store";

export const villageModule: Module = {
  stores: [{ scope: "villages", store: VillageStore }],
  provides: [VillageEventHandler],
};
