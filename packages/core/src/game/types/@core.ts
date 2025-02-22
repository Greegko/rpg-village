import { GameCommand, GameEvent, GeneralGameStoreState } from "../interfaces";

declare module "@rpg-village/core/extend" {
  interface CommandType {
    [GameCommand.NewGame]: undefined;
    [GameCommand.TurnCommand]: undefined;
  }
  interface EventType {
    [GameEvent.Turn]: undefined;
  }
  interface GameState {
    general: GeneralGameStoreState;
  }
}
