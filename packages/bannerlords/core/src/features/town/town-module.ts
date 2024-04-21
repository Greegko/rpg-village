import { Module } from "@rpg-village/core";

import { TownStore } from "./town-store";

export const townModule: Module = {
  stores: [{ scope: "towns", store: TownStore }],
};
