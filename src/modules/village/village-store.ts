import { injectable } from 'inversify';
import { evolve, inc } from 'ramda';
import { VillageStoreState } from './interfaces';

const VillageStoreStateInit: VillageStoreState = { houses: 0, stash: undefined, locationId: undefined };

@injectable()
export class VillageStore {
  private _state: VillageStoreState = VillageStoreStateInit;

  init(state: VillageStoreState){
    this._state = state;
  }

  getNumberOfHouses() {
    return this._state.houses;
  }

  getState() {
    return this._state;
  }

  addHouse() {
    this._state = evolve({ houses: inc }, this._state);
  }

}
