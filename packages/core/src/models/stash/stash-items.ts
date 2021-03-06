import { Stash } from "./stash";
import { Item, ItemID } from "../item";
import { pipe, prop, find, propEq, evolve, concat, reject, filter, append } from 'ramda';

export interface ItemStash extends Stash {
  items: Item[];
}

export function getItem<T extends ItemStash>(stash: T, itemId: ItemID): Item {
  return pipe(
    prop('items'),
    find(propEq('id', itemId))
  )(stash);
}

export function getItems(stash: ItemStash): Item[] {
  return prop('items', stash);
}

export function addItem<T extends ItemStash>(stash: T, item: Item): T {
  return evolve({
    items: append(item)
  }, stash);
}

export function addItems<T extends ItemStash>(stash: T, items: Item[]): T {
  return evolve({
    items: concat(items)
  }, stash);
}

export function removeItem<T extends ItemStash>(stash: T, itemId: ItemID): T {
  return evolve({
    items: reject(propEq('id', itemId))
  }, stash);
}

export function removeItems<T extends ItemStash>(stash: T, itemIds: ItemID[]): T {
  return evolve({
    items: items => filter(item => itemIds.indexOf(item.id) === -1, items),
  }, stash);
}
