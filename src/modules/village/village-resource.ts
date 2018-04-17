import { injectable, inject } from 'inversify';
import { VillageStore } from './village-store';
import { Resource } from '@greegko/rpg-model';
import { where, map, lt } from 'ramda';

@injectable()
export class VillageResource {

  constructor(
    @inject('VillageStore') private villageStore: VillageStore
  ){ }

  removeResource(resource: Resource) {
    this.villageStore.removeResource(resource);
  }

  addResource(resource: Resource) {
    this.villageStore.addResource(resource);
  }

  isEnoughResource(resource: Resource): boolean {
    const storeResource = this.villageStore.getState();
    const resourceObjCheck = map((x: number) => lt(x), resource);
    return where(resourceObjCheck, storeResource);
  }

}
