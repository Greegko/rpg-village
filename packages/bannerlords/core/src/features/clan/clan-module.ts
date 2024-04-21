import { Module } from "@rpg-village/core";

import { ClanStore } from "./clan-store";

export const clanModule: Module = {
  stores: [{ scope: "clans", store: ClanStore }],
};
