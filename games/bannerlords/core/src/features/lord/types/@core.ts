import { Lord, LordID } from "../interface";

declare module "@rpg-village/core/extend" {
  interface GameState {
    lords: Record<LordID, Lord>;
  }
}
