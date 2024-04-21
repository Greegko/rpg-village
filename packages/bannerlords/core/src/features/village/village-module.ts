import { Module } from "@rpg-village/core";

import { VillageStore } from "./village-store";

export const villageModule: Module = {
  stores: [{ scope: "villages", store: VillageStore }],
};
