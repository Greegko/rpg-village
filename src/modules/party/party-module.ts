import { Module } from "../../../core-src";
import { PartyLocationService } from "./party-location-service";

export const partyModule: Module = {
  provides: [PartyLocationService]
};
