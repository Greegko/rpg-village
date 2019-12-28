import { injectable, inject } from 'inversify';
import { ItemID, Resource } from '../../models';
import { VillageStore } from './village-store';
import { Item } from '../../models';
import { addItems, getItem, removeItem, addResource, removeResource, getResource } from '../../models/stash';
import { where, map, lte } from 'ramda';

@injectable()
export class VillageStash {

  constructor(
    @inject('VillageStore') private villageStore: VillageStore,
  ) { }

  addItems(items: Item[]) {
    this.villageStore.update('stash', (stash) => addItems(stash, items));
  }

  takeItem(itemId: ItemID): Item {
    const stash = this.villageStore.get('stash');
    const item = getItem(stash, itemId);
    this.villageStore.set('stash', removeItem(stash, itemId));
    return item;
  }

  addResource(resource: Resource): void {
    this.villageStore.update('stash', stash => addResource(stash, resource));
  }

  removeResource(resource: Resource): void {
    this.villageStore.update('stash', stash => removeResource(stash, resource));
  }

  getResource(): Resource {
    const stash = this.villageStore.getState().stash;
    return getResource(stash);
  }

  hasEnoughResource(resource: Resource): boolean {
    const storeResource = this.getResource();
    const resourceObjCheck = map(lte, resource);
    return where(resourceObjCheck, storeResource);
  }
}
