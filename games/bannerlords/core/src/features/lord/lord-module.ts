import { Module } from "@rpg-village/core";

import { LordStore } from "./lord-store";

export const lordModule: Module = {
  stores: [{ scope: "lords", store: LordStore }],
};
