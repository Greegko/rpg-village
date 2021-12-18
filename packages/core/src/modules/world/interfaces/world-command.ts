import { PartyID } from "@modules/party";
import { MapLocationID } from "./map-location";

export enum WorldCommand {
  Explore = "world/explore",
  Travel = "world/travel",
  Battle = "world/battle",
}

export interface WorldCommandBattleArgs {
  locationId: MapLocationID;
}

export interface WorldCommandExploreArgs {
  partyId: PartyID;
}

export interface WorldCommandTravelArgs {
  partyId: PartyID;
  targetLocationId: MapLocationID;
}

declare module "@core/command/command-type" {
  interface CommandType {
    [WorldCommand.Explore]: WorldCommandExploreArgs;
    [WorldCommand.Travel]: WorldCommandTravelArgs;
    [WorldCommand.Battle]: WorldCommandBattleArgs;
  }
}
