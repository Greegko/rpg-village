import { GameCommand, GameEvent, GeneralGameStoreState } from "../interfaces";

declare module "@core" {
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
