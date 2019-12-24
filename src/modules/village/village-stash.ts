import { injectable, inject } from 'inversify';
import { ItemID } from '../../models';
import { VillageStore } from './village-store';
import { StashItems } from '../stash';
import { Item } from '../../models';
import { MapLocationID } from '../world/interfaces';

@injectable()
export class VillageStash {

  constructor(
    @inject('VillageStore') private villageStore: VillageStore,
    @inject('StashItems') private stashItems: StashItems,
  ) { }

  get villageLocation(): MapLocationID {
    return this.villageStore.getState().locationId;
  }

  addItemsToStash(items: Item[]) {
    this.stashItems.addItems(this.villageLocation, items);
  }

  takeItemFromStash(itemId: ItemID): Item {
    return this.stashItems.takeItem(this.villageLocation, itemId);
  }
}
