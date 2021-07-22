import { MapLocationID } from "@modules/world";
import { PartyID } from "./party";

export enum PartyEvent {
  ArrivedToLocation = "party/arrived-to-location",
}

export type PartyEventArgs = {
  partyId: PartyID;
};

export type ArrivedToLocationEventArgs = PartyEventArgs & {
  locationId: MapLocationID;
};
