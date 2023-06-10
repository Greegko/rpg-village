import { PartyID } from "@features/party";

import { MapEvent, MapEventNewLocationArgs, MapLocationID } from "../interfaces";

declare module "@core" {
  export interface EventType {
    [MapEvent.NewLocation]: MapEventNewLocationArgs;
    [MapEvent.PartyArrivedToLocation]: PartyEventArrivedToLocationArgs;
  }
}

export type PartyEventArrivedToLocationArgs = {
  partyId: PartyID;
  locationId: MapLocationID;
};
