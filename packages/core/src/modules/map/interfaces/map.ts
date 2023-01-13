import { MapLocationID } from "./map-location";

export type MapID = string;

export enum MapSize {
  Small,
  Endless,
}

export interface Map {
  id: MapID;
  mapSize: MapSize;
  difficulty: number;
  mapLocationIds: MapLocationID[];
}
