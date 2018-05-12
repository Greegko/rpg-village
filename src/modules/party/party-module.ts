import { Module } from "@greegko/rpg-model";
import { PartyLocationService } from "./party-location-service";

export const partyModule: Module = {
  provides: [PartyLocationService]
};
