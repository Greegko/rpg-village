import { injectable } from 'inversify';
import { VillageState } from './interfaces';
import { ObjectStore } from "../../lib/object-store";

@injectable()
export class VillageStore extends ObjectStore<VillageState> {
  addHouse() {
    this.set('houses', this.getNumberOfHouses() + 1);
  }

  getNumberOfHouses(): number {
    return this.get('houses') as number;
  }
}
