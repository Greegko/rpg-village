import { injectable } from 'inversify';
import { evolve, inc, assoc } from 'ramda';
import { VillageStoreState } from './interfaces';
import { StashID } from '@greegko/rpg-model';
import { MapLocationID } from '../world/interfaces'; 

const VillageStoreStateInit: VillageStoreState = { houses: 0, stash: undefined, locationId: undefined };

@injectable()
export class VillageStore {
  private _state: VillageStoreState = VillageStoreStateInit;

  init(state: VillageStoreState): void {
    this._state = state;
  }

  getNumberOfHouses(): number {
    return this._state.houses;
  }

  getState(): VillageStoreState {
    return this._state;
  }

  assignLocation(locationId: MapLocationID): void { 
    this._state = assoc('locationId', locationId, this._state);
  }

  assignStash(stashId: StashID): void { 
    this._state = assoc('stashId', stashId, this._state);
  }

  addHouse(): void {
    this._state = evolve({ houses: inc }, this._state);
  }

}
