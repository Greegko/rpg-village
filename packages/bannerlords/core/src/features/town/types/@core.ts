import { Town, TownID } from "../interface";

declare module "@rpg-village/core" {
  interface GameState {
    towns: Record<TownID, Town>;
  }
}
