import { MapID } from "./map";
import { MapLocationID } from "./map-location";

export enum MapEvent {
  NewLocation = "map/new-location",
}

export type MapEventNewLocationArgs = { mapId: MapID; locationId: MapLocationID };

declare module "@core/event" {
  export interface EventType {
    [MapEvent.NewLocation]: MapEventNewLocationArgs;
  }
}
