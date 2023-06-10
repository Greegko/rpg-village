import { PartyID } from "@features/party";

import { MapLocationID } from "./map-location";

export enum MapCommand {
  Explore = "map/explore",
  Travel = "map/travel",
  Battle = "map/battle",
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
