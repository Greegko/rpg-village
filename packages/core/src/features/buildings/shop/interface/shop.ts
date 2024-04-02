import { Stash } from "@features/stash";
import { Item, Resource } from "@models";

export type ShopID = string & { __typeGuard: "shop-id" };
export type ShopItemID = string & { __typeGuard: "shop-item-id" };

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
