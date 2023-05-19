import "@core/game-state";

import { BattleID, BattleStoreState } from "../interfaces";

declare module "@core/game-state" {
  export interface GameState {
    battle: Record<BattleID, BattleStoreState>;
  }
}
