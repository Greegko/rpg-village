import { injectable } from 'inversify';
import { Resource, Item, ItemID } from '@greegko/rpg-model';
import { add, mergeWith, omit, concat, findIndex, remove, find, map, negate, evolve, inc, assoc, propEq } from 'ramda';
import { VillageStoreState } from './interfaces';

const VillageStoreStateInit: VillageStoreState = { houses: 0, resource: { gold: 0 }, stash: [] };

@injectable()
export class VillageStore {
  private _state: VillageStoreState = VillageStoreStateInit;

  init(state: VillageStoreState){
    this._state = state;
  }

  get Houses() {
    return this._state.houses;
  }

  get Gold() {
    return this._state.resource.gold;
  }

  getState() {
    return this._state;
  }

  addHouse() {
    this._state = evolve({ houses: inc }, this._state);
  }

  addResource(resource: Resource) {
    this._state = { ...this._state, resource: this._alterResource(resource) };
  }

  removeResource(resource: Resource) {
    const newResource = map(negate, resource);
    this._state = { ...this._state, resource: this._alterResource(newResource) };
  }

  getItemFromStash(itemId: ItemID): Item {
    return find(propEq('id', itemId), this._state.stash);
  }

  addItemsToStash(items: Item[]) {
    const stash = concat(items, this._state.stash);
    this._state = assoc('stash', stash, this._state);
  }

  takeItemFromStash(itemId: ItemID): Item {
    const index = findIndex(propEq('id', itemId), this._state.stash);
    const item = this._state.stash[index];
    const stash = remove(index, 1, this._state.stash);
    this._state = assoc('stash', stash, this._state);
    return item;
  }

  private _alterResource(resource: Resource) {
    const essences = mergeWith(add, resource.essences, this._state.resource.essences);
    const updateResource = mergeWith(add, omit(['essences'], resource), this._state.resource);

    return { ...updateResource, essences };
  }
}
