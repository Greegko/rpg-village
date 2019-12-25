import { injectable, inject } from 'inversify';
import { ItemID } from '../../models';
import { VillageStore } from './village-store';
import { Item } from '../../models';
import { MapLocationID } from '../world/interfaces';
import { addItems, getItem, removeItem } from '../../models/stash';

@injectable()
export class VillageStash {

  constructor(
    @inject('VillageStore') private villageStore: VillageStore,
  ) { }

  get villageLocation(): MapLocationID {
    return this.villageStore.getState().locationId;
  }

  addItemsToStash(items: Item[]) {
    this.villageStore.update('stash', (stash) => addItems(stash, items));
  }

  takeItemFromStash(itemId: ItemID): Item {
    const stash = this.villageStore.get('stash');
    const item = getItem(stash, itemId);
    this.villageStore.set('stash', removeItem(stash, itemId));
    return item;
  }
}
