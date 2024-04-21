import { Castle, CastleID } from "../interface";

declare module "@rpg-village/core" {
  interface GameState {
    castles: Record<CastleID, Castle>;
  }
}
