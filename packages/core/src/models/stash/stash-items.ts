import { append, concat, evolve, filter, find, prop, propEq, reject } from "ramda";

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
  );
}

export function addItems<T extends ItemStash>(stash: T, items: Item[]): T {
  return evolve(
    {
      items: concat(items),
    },
    stash,
  );
}

export function removeItem<T extends ItemStash>(stash: T, itemId: ItemID): T {
  return evolve(
    {
      items: reject(propEq("id", itemId)),
    },
    stash,
  );
}

export function removeItems<T extends ItemStash>(stash: T, itemIds: ItemID[]): T {
  return evolve(
    {
      items: items => filter(item => itemIds.indexOf(item.id) === -1, items),
    },
    stash,
  );
}
