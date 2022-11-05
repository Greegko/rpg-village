import { MapLocationID } from "@modules/map";

import { PartyID } from "./party";

export enum PartyEvent {
  ArrivedToLocation = "party/arrived-to-location",
}

export type PartyEventArrivedToLocationArgs = {
  partyId: PartyID;
  locationId: MapLocationID;
};

declare module "@core/global-type/event-type" {
  export interface EventType {
    [PartyEvent.ArrivedToLocation]: PartyEventArrivedToLocationArgs;
  }
}
