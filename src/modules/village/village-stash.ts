import { injectable, inject } from 'inversify';
import { ItemID, Resource } from '../../models';
import { VillageStore } from './village-store';
import { Item } from '../../models';
import { MapLocationID } from '../world/interfaces';
import { addItems, getItem, removeItem, addResource, removeResource, getResource } from '../../models/stash';
import { where, map, lt } from 'ramda';

@injectable()
export class VillageStash {

  constructor(
    @inject('VillageStore') private villageStore: VillageStore,
  ) { }

  get villageLocation(): MapLocationID {
    return this.villageStore.getState().locationId;
  }

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
    const stash = this.villageStore.getState().stash;
    const newStashResource = addResource(stash, resource);

    this.villageStore.set('stash', newStashResource);
  }

  removeResource(resource: Resource): void {
    const stash = this.villageStore.getState().stash;
    const newStashResource = removeResource(stash, resource);
    this.villageStore.set('stash', newStashResource);
  }

  getResource(): Resource {
    const stash = this.villageStore.getState().stash;
    return getResource(stash);
  }

  hasEnoughResource(resource: Resource): boolean {
    const storeResource = this.getResource();
    const resourceObjCheck = map(lt, resource);
    return where(resourceObjCheck, storeResource);
  }
}
