import { Module } from "../../models";
import { PartyService } from "./party-service";
import { PartyStore } from "./party-store";

export const partyModule: Module = {
  stores: [{ scope: 'parties', store: PartyStore }],
  provides: [PartyService]
};
