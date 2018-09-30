import { injectable, inject } from "inversify";
import { StashStore, StashID, ItemID } from "@greegko/rpg-model";
import { Item } from '../../models';
import { concat, evolve, path, reject, propEq, find, pipe } from 'ramda';

@injectable()
export class StashItems {
  constructor(@inject('StashStore') private stashStore: StashStore<{ items: Item[] }>) {}

  getItem(stashId: StashID, itemId: ItemID): Item {
    const stash = this.stashStore.get(stashId);
    return pipe(
      path([stashId, 'items']),
      find(propEq('id', itemId))
    )(stash);
  }

  getItems(stashId: StashID): Item[] {
    return path([stashId, 'items'], this.stashStore.get(stashId));
  }

  takeAllItems(stashId: StashID): Item[] {
    const items = path<Item[]>([stashId, 'items'], this.stashStore.get(stashId));

    const newStash = evolve({
      items: []
    }, this.stashStore.get(stashId));

    this.stashStore.update(stashId, newStash);

    return items;
  }

  addItems(stashId: StashID, items: Item[]): void {
    const newStash = evolve({
      items: concat(items)
    }, this.stashStore.get(stashId));

    this.stashStore.update(stashId, newStash);
  }

  takeItem(stashId: StashID, itemId: ItemID): Item {
    const stash = this.stashStore.get(stashId);
    const item = this.getItem(stashId, itemId);

    const newStash = evolve({
      items: reject(propEq('id', itemId))
    }, stash);

    this.stashStore.update(stashId, newStash);
    return item;
  }
}
