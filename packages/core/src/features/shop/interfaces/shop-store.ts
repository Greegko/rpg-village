import { Item, Resource } from "@models";

export type ShopID = string;
export type ShopItemID = string;

export interface ShopItem {
  id: ShopItemID;
  item: Item;
  price: Resource;
  quantity: number;
}

export interface ShopState {
  id: ShopID;
  items: ShopItem[];
}
