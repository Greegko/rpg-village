import { injectable } from 'inversify';
import { VillageState } from './interfaces';
import { ObjectStore } from "../../lib/object-store";
import { UnitID } from '../unit';

@injectable()
export class VillageStore extends ObjectStore<VillageState> {
  addHouse() {
    this.set('houses', this.getNumberOfHouses() + 1);
  }

  addHero(unitId: UnitID) {
    this.set('heroes', [...this.get('heroes'), unitId]);
  }

  getNumberOfHouses(): number {
    return this.get('houses');
  }
}
