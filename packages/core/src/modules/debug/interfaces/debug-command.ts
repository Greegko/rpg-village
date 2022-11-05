import { Item } from "@models/item";

export enum DebugCommand {
  GenerateGold = "debug/generate-gold",
  AddItem = "debug/add-item",
}

export interface GenerateGoldArgs {
  gold: number;
}

export interface AddItemArgs {
  item: Item;
}

declare module "@core/global-type/command-type" {
  interface CommandType {
    [DebugCommand.GenerateGold]: GenerateGoldArgs;
    [DebugCommand.AddItem]: AddItemArgs;
  }
}
