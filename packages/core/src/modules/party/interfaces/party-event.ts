import { MapLocationID } from "@modules/map";

import { PartyID } from "./party";

export enum PartyEvent {
  ArrivedToLocation = "party/arrived-to-location",
}

export type PartyEventArrivedToLocationArgs = {
  partyId: PartyID;
  locationId: MapLocationID;
};
