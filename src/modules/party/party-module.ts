import { Module } from "../../models";
import { PartyLocationService } from "./party-location-service";

export const partyModule: Module = {
  provides: [PartyLocationService]
};
