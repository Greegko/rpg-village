import { UnitInit } from "@/features/unit";

import { MapObjectInit } from "./map-object";
import { Tile } from "./tile";

export interface Map {
  size: [number, number];
  tileSize: number;
  tiles: Tile[];
  units: UnitInit[];
  mapObjects: MapObjectInit[];
}
