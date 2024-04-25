import { Module } from "@rpg-village/core";

import { TownCommandHandler } from "./town-command-handler";
import { TownStore } from "./town-store";

export const townModule: Module = {
  stores: [{ scope: "towns", store: TownStore }],
  provides: [TownCommandHandler],
};
