import { AddItemArgs, AddSoulArgs, DebugCommand, GenerateGoldArgs } from "../interfaces";

declare module "@core" {
  interface CommandType {
    [DebugCommand.AddSoul]: AddSoulArgs;
    [DebugCommand.GenerateGold]: GenerateGoldArgs;
    [DebugCommand.AddItem]: AddItemArgs;
  }
}
