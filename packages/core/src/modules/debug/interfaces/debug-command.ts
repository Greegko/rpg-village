import { Item } from "@models/item";

export enum DebugCommand {
  GenerateGold = "debug/generate-gold",
  AddItem = "debug/add-item",
  AddSoul = "debug/add-soul",
}

export interface GenerateGoldArgs {
  gold: number;
}

export interface AddItemArgs {
  item: Item;
}

export interface AddSoulArgs {
  soul: number;
}

declare module "@core/global-type/command-type" {
  interface CommandType {
    [DebugCommand.AddSoul]: AddSoulArgs;
    [DebugCommand.GenerateGold]: GenerateGoldArgs;
    [DebugCommand.AddItem]: AddItemArgs;
  }
}
