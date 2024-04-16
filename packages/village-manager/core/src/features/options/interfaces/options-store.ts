import { Item } from "@features/item";

export type OptionID = string;
export type OptionItemID = string;

export interface OptionItem {
  id: OptionItemID;
  item: Item;
}

export interface OptionState {
  id: OptionID;
  items: OptionItem[];
}
