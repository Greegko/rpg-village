import { injectable, inject } from 'inversify';
import { VillageStore } from './village-store';
import { StashResource, StashItems, Item, ItemID } from '@greegko/rpg-model';
import { where, map, lt } from 'ramda';
import { Resource } from '../../models';

@injectable()
export class VillageStash {

  constructor(
    @inject('VillageStore') private villageStore: VillageStore,
    @inject('StashResource') private stashResource: StashResource<Resource>,
    @inject('StashItems') private stashItems: StashItems,
  ){ }

  get villageLocation() {
    return this.villageStore.getState().locationId;
  }

  addResource(resource: Resource) {
    this.stashResource.addResource(this.villageLocation, resource);
  }

  removeResource(resource: Resource) {
    this.stashResource.removeResource(this.villageLocation, resource);
  }

  getResource(): Resource {
    return this.stashResource.getResource(this.villageLocation);
  }

  isEnoughResource(resource: Resource): boolean {
    const storeResource = this.getResource();
    const resourceObjCheck = map((x: number) => lt(x), resource);
    return where(resourceObjCheck, storeResource);
  }

  addItemsToStash(items: Item[]) {
    this.stashItems.addItems(this.villageLocation, items);
  }

  takeItemFromStash(itemId: ItemID): Item {
    return this.stashItems.takeItem(this.villageLocation, itemId);
  }

}
