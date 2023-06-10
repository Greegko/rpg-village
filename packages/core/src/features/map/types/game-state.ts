import "@core";

import { Map, MapID, MapLocation, MapLocationID } from "../interfaces";

declare module "@core" {
  export interface GameState {
    maps: Record<MapID, Map>;
    mapLocations: Record<MapLocationID, MapLocation>;
  }
}
