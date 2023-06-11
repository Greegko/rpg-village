import { Item } from "@models";

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
