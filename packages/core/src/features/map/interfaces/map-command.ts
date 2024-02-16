import { PartyID } from "@features/party";

import { MapLocationID } from "./map-location";

export enum MapCommand {
  Explore = "map/explore",
  Travel = "map/travel",
  Battle = "map/battle",
  MergeParties = "map/merge-parties",
}

export interface MapCommandMergePartiesArgs {
  partyId: PartyID;
  otherPartyId: PartyID;
}

export interface MapCommandBattleArgs {
  locationId: MapLocationID;
}

export interface MapCommandExploreArgs {
  partyId: PartyID;
}

export interface MapCommandTravelArgs {
  partyId: PartyID;
  targetLocationId: MapLocationID;
}
