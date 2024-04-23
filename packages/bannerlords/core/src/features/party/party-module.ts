import { Module } from "@rpg-village/core";

import { PartyStore } from "./party-store";

export const partyModule: Module = {
  stores: [{ scope: "parties", store: PartyStore }],
};
