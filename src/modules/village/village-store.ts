import { injectable } from 'inversify';
import { VillageState } from './interfaces';
import { ObjectStore } from "../../../core-src";

@injectable()
export class VillageStore extends ObjectStore<VillageState> {
  addHouse() {
    this.set('houses', this.getNumberOfHouses() + 1);
  }

  getNumberOfHouses(): number {
    return this.get('houses') as number;
  }
}
