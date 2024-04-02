import { VillageID } from "@features/village";
import { Item } from "@models";

export enum DebugCommand {
  GenerateGold = "debug/generate-gold",
  AddItem = "debug/add-item",
  AddSoul = "debug/add-soul",
}

export interface GenerateGoldArgs {
  villageId: VillageID;
  gold: number;
}

export interface AddItemArgs {
  villageId: VillageID;
  item: Item;
}

export interface AddSoulArgs {
  villageId: VillageID;
  soul: number;
}
