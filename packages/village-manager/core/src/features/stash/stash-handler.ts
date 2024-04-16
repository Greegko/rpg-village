import { injectable } from "inversify";
import { always, evolve, map, propEq, when } from "rambda";

import { Item, ItemID } from "@features/item";

import { Resource } from "./resource";
import { Stash, addItems, addResource, getItem, getResource, removeItem, removeResource } from "./stash";

interface StashHandlerDelegator {
  get: () => Stash;
  update: (updater: (stash: Stash) => Stash) => void;
}

@injectable()
export class StashHandler {
  constructor(private stashHandlerDelegator: StashHandlerDelegator) {}

  takeStash(): Stash {
    const stash = this.stashHandlerDelegator.get();

    this.stashHandlerDelegator.update(always({ resource: { gold: 0, soul: 0 }, items: [] }));

    return stash;
  }

  addItems(items: Item[]) {
    this.stashHandlerDelegator.update(stash => addItems(stash, items));
  }

  takeItem<T extends Item>(itemId: ItemID): T {
    const stash = this.stashHandlerDelegator.get();
    const item = getItem(stash, itemId);
    this.stashHandlerDelegator.update(always(removeItem(stash, itemId)));
    return item as T;
  }

  updateStashItem<T extends Item>(itemId: ItemID, item: T | ((item: T) => T)) {
    const itemFn = typeof item === "function" ? item : always(item);

    const evolver = evolve({
      items: map(when(propEq(itemId, "id"), itemFn)),
    });

    this.stashHandlerDelegator.update(evolver as any);
  }

  addResource(resource: Resource): void {
    this.stashHandlerDelegator.update(stash => addResource(stash, resource));
  }

  removeResource(resource: Resource): void {
    this.stashHandlerDelegator.update(stash => removeResource(stash, resource));
  }

  getResource(): Resource {
    return getResource(this.stashHandlerDelegator.get());
  }

  hasEnoughResource(resource: Resource): boolean {
    const stashResource = this.getResource();

    if (resource.gold && resource.gold > (stashResource.gold || 0)) return false;
    if (resource.soul && resource.soul > (stashResource.soul || 0)) return false;

    return true;
  }
}
