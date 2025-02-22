import { Castle, CastleID } from "../interface";

declare module "@rpg-village/core/extend" {
  interface GameState {
    castles: Record<CastleID, Castle>;
  }
}
