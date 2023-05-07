import { append, concat, evolve, filter, find, prop, propEq, reject } from "rambda";

import { Item, ItemID } from "../item";
import { Stash } from "./stash";

export interface ItemStash extends Stash {
  items: Item[];
}

export function getItem<T extends ItemStash>(stash: T, itemId: ItemID): Item {
  const items = stash.items;
  return find(propEq("id", itemId), items)!;
}

export function getItems(stash: ItemStash): Item[] {
  return prop("items", stash);
}

export function addItem<T extends ItemStash>(stash: T, item: Item): T {
  return evolve(
    {
      items: append(item),
    },
    stash,
  ) as T;
}

export function addItems<T extends ItemStash>(stash: T, items: Item[]): T {
  return evolve(
    {
      items: concat(items),
    },
    stash,
  ) as T;
}

export function removeItem<T extends ItemStash>(stash: T, itemId: ItemID): T {
  return evolve(
    {
      items: reject(propEq("id", itemId)),
    },
    stash,
  ) as T;
}

export function removeItems<T extends ItemStash>(stash: T, itemIds: ItemID[]): T {
  return evolve(
    {
      items: filter((item: Item) => itemIds.indexOf(item.id) === -1),
    },
    stash,
  ) as T;
}
