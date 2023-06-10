import { GameCommand } from "../interfaces";

declare module "@core" {
  export interface CommandType {
    [GameCommand.NewGame]: undefined;
    [GameCommand.TurnCommand]: undefined;
  }
}
