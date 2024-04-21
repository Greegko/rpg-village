import { EntityID, MapElement } from "../interface";

declare module "@rpg-village/core" {
  interface GameState {
    map: Record<EntityID, MapElement>;
  }
}
