import "@core/command";

import { GameCommand } from "../interfaces";

declare module "@core/command" {
  interface CommandType {
    [GameCommand.NewGame]: undefined;
    [GameCommand.TurnCommand]: undefined;
  }
}
