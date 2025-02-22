import { evolve } from "remeda";

import { updateValueInList } from "@rpg-village/core";

import { Item, Stash } from "../interface";

export function addItem(stash: Stash, item: Item): Stash {
  const itemWithSameType = stash.items.find(x => x.itemType === item.itemType);

  if (itemWithSameType) {
    return evolve(stash, {
      items: items => updateValueInList(items, itemWithSameType, evolve({ amount: amount => amount + item.amount })),
    });
  }

  return evolve(stash, { items: items => [...items, item] });
}
