import { Item } from "@features/item";
import { Resource, Stash } from "@features/stash";

export type ShopID = string;
export type ShopItemID = string;

export interface ShopItem {
  id: ShopItemID;
  item: Item;
  price: Resource;
  quantity: number;
}

export interface Shop {
  level: number;
  stash: Stash;
  items: ShopItem[];
}
