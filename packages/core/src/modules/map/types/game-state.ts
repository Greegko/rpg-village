import "@core/game-state";

import { Map, MapID, MapLocation, MapLocationID } from "../interfaces";

declare module "@core/game-state" {
  export interface GameState {
    maps: Record<MapID, Map>;
    mapLocations: Record<MapLocationID, MapLocation>;
  }
}
