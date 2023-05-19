import { injectable } from "inversify";
import { always, evolve, map, propEq, when } from "rambda";

import { Item, ItemID, Resource } from "@models";
import { addItems, addResource, getItem, getResource, removeItem, removeResource } from "@models";

import { VillageStore } from "./village-store";

@injectable()
export class VillageStashService {
  constructor(private villageStore: VillageStore) {}

  addItems(items: Item[]) {
    this.villageStore.update("stash", stash => addItems(stash, items));
  }

  takeItem<T extends Item>(itemId: ItemID): T {
    const stash = this.villageStore.get("stash");
    const item = getItem(stash, itemId);
    this.villageStore.set("stash", removeItem(stash, itemId));
    return item as T;
  }

  updateStashItem<T extends Item>(itemId: ItemID, item: T | ((item: T) => T)) {
    const itemFn = typeof item === "function" ? item : always(item);

    const evolver = evolve({
      items: map(when(propEq("id", itemId), itemFn)),
    });

    this.villageStore.update("stash", evolver as any);
  }

  addResource(resource: Resource): void {
    this.villageStore.update("stash", stash => addResource(stash, resource));
  }

  removeResource(resource: Resource): void {
    this.villageStore.update("stash", stash => removeResource(stash, resource));
  }

  getResource(): Resource {
    const stash = this.villageStore.getState().stash;
    return getResource(stash);
  }

  hasEnoughResource(resource: Resource): boolean {
    const stashResource = this.getResource();

    if (resource.gold && resource.gold > (stashResource.gold || 0)) return false;
    if (resource.soul && resource.soul > (stashResource.soul || 0)) return false;

    return true;
  }
}
