import { MapLocationID } from "./map-location";

export type MapID = string;

export interface Map {
  id: MapID;
  difficulty: number;
  mapLocationIds: MapLocationID[];
}
