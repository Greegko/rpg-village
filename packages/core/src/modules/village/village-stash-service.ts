import { injectable } from "inversify";

import { Item, ItemID } from "@models/item";
import { Resource } from "@models/resource";
import { addItems, addResource, getItem, getResource, removeItem, removeResource } from "@models/stash";

import { VillageStore } from "./village-store";

@injectable()
export class VillageStashService {
  constructor(private villageStore: VillageStore) {}

  addItems(items: Item[]) {
    this.villageStore.update("stash", stash => addItems(stash, items));
  }

  takeItem(itemId: ItemID): Item {
    const stash = this.villageStore.get("stash");
    const item = getItem(stash, itemId);
    this.villageStore.set("stash", removeItem(stash, itemId));
    return item;
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
    if (resource.gold === undefined || stashResource.gold === undefined) return false;

    return stashResource.gold >= resource.gold;
  }
}
