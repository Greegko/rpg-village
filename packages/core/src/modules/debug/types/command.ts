import "@core/command";

import { AddItemArgs, AddSoulArgs, DebugCommand, GenerateGoldArgs } from "../interfaces";

declare module "@core/command" {
  interface CommandType {
    [DebugCommand.AddSoul]: AddSoulArgs;
    [DebugCommand.GenerateGold]: GenerateGoldArgs;
    [DebugCommand.AddItem]: AddItemArgs;
  }
}
