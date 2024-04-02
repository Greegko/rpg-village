import { EffectStatic } from "@models";

import { MapLocationID } from "./map-location";

export type MapID = string & { __typeGuard: "map-id" };

export enum MapSize {
  Small,
  Endless,
}

export interface Map {
  id: MapID;
  mapSize: MapSize;
  difficulty: number;
  modifiers: EffectStatic[];
  mapLocationIds: MapLocationID[];
}
