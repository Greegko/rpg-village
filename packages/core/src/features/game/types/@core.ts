import { GameCommand, GeneralGameStoreState } from "../interfaces";

declare module "@core" {
  interface CommandType {
    [GameCommand.NewGame]: undefined;
    [GameCommand.TurnCommand]: undefined;
  }
  interface GameState {
    general: GeneralGameStoreState;
  }
}
