import { MapLocationID } from "./map-location";

export enum WorldEvent {
  NewLocation = "world/new-location",
}

export type WorldEventNewLocationArgs = { locationId: MapLocationID };

declare module "@core/event/event-type" {
  export interface EventType {
    [WorldEvent.NewLocation]: WorldEventNewLocationArgs;
  }
}
