import { PartyID } from "@modules/party";

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

declare module "@core/command/command-type" {
  interface CommandType {
    [MapCommand.Explore]: MapCommandExploreArgs;
    [MapCommand.Travel]: MapCommandTravelArgs;
    [MapCommand.Battle]: MapCommandBattleArgs;
  }
}
