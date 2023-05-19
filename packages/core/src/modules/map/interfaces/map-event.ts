import { MapID } from "./map";
import { MapLocationID } from "./map-location";

export enum MapEvent {
  NewLocation = "map/new-location",
}

export type MapEventNewLocationArgs = { mapId: MapID; locationId: MapLocationID };
