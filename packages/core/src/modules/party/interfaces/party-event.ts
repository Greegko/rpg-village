import { MapLocationID } from "@modules/world";
import { PartyID } from "./party";

export enum PartyEvent {
  ArrivedToLocation = "party/arrived-to-location",
}
export type ArrivedToLocationEventArgs = {
  partyId: PartyID;
  locationId: MapLocationID;
};
