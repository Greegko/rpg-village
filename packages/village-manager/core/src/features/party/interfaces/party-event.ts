import { PartyID } from "./party";

export enum PartyEvent {
  Disband = "party/disband",
}

export type PartyEventDisbandArgs = { partyId: PartyID };
