import { Module } from "../../../src/models";
import { PartyService } from "./party-service";
import { PartyStore } from "./party-store";

export const partyModule: Module = {
  stores: [{ scope: 'party', store: PartyStore }],
  provides: [PartyService]
};
