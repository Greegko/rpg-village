import { BattleFinishedActivityArgs, BattleID, BattleStoreState } from "../interfaces";
import { BattleEvent } from "../interfaces/battle-event";

declare module "@rpg-village/core" {
  interface GameState {
    battle: Record<BattleID, BattleStoreState>;
  }

  interface EventType {
    [BattleEvent.Finished]: BattleFinishedActivityArgs;
  }
}
