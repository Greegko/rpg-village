import { Item } from "@models";

export type OptionID = string & { __typeGuard: "option-id" };
export type OptionItemID = string & { __typeGuard: "option-item-id" };

export interface OptionItem {
  id: OptionItemID;
  item: Item;
}

export interface OptionState {
  id: OptionID;
  items: OptionItem[];
}
