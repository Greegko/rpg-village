import { Lord, LordID } from "../interface";

declare module "@rpg-village/core" {
  interface GameState {
    lords: Record<LordID, Lord>;
  }
}
