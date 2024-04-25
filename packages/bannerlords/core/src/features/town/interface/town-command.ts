import { PartyID } from "@features/party";

import { TownID } from "./town";

export interface TownCommandEnterTownArgs {
  townId: TownID;
  partyId: PartyID;
}
export interface TownCommandLeaveTownArgs {
  townId: TownID;
  partyId: PartyID;
}

export enum TownCommand {
  EnterTown = "town/enter-town",
  LeaveTown = "town/leave-town",
}
