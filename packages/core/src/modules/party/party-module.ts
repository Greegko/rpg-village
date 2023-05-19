import { Module } from "@core";

import { PartyService } from "./party-service";
import { PartyStore } from "./party-store";

export const partyModule: Module = {
  stores: [{ scope: "parties", store: PartyStore }],
  provides: [PartyService],
};
