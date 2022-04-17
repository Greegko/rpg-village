import { MapLocationID } from "./map-location";

export enum MapEvent {
  NewLocation = "map/new-location",
}

export type MapEventNewLocationArgs = { locationId: MapLocationID };

declare module "@core/event/event-type" {
  export interface EventType {
    [MapEvent.NewLocation]: MapEventNewLocationArgs;
  }
}
