import { MapElement, MapElementID } from "../interface";

declare module "@rpg-village/core" {
  interface GameState {
    map: Record<MapElementID, MapElement>;
  }
}
