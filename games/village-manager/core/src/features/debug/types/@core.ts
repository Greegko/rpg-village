import { AddItemArgs, AddSoulArgs, DebugCommand, GenerateGoldArgs } from "../interfaces";

declare module "@rpg-village/core/extend" {
  interface CommandType {
    [DebugCommand.AddSoul]: AddSoulArgs;
    [DebugCommand.GenerateGold]: GenerateGoldArgs;
    [DebugCommand.AddItem]: AddItemArgs;
  }
}
