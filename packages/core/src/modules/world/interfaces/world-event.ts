import { MapLocationID } from "./map-location";

export enum WorldEvent {
  NewLocation = "world/new-location",
}

export type NewLocationEventArgs = { locationId: MapLocationID };
