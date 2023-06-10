import { BattleID, BattleStoreState } from "../interfaces";

declare module "@core" {
  export interface GameState {
    battle: Record<BattleID, BattleStoreState>;
  }
}
