import { AddItemArgs, AddSoulArgs, DebugCommand, GenerateGoldArgs } from "../interfaces";

declare module "@rpg-village/core" {
  interface CommandType {
    [DebugCommand.AddSoul]: AddSoulArgs;
    [DebugCommand.GenerateGold]: GenerateGoldArgs;
    [DebugCommand.AddItem]: AddItemArgs;
  }
}
