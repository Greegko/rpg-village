import { injectable, multiInject } from 'inversify';
import { GameState } from './interfaces';
import { IStore } from '@greegko/rpg-model';
import { forEach, prop, map, mergeAll } from 'ramda';

export interface ProvidedStore {
  store: IStore;
  scope: string;
  initialState?: object;
}

@injectable()
export class GameStore<S extends GameState> {

  constructor(
    @multiInject('Stores') private stores: ProvidedStore[]
  ) { }

  init(state: S) {
    forEach(store => {
      (store.store as any).init(prop(store.scope, state) || store.initialState || {});
    }, this.stores);
  }

  getState(): S {
    return mergeAll(map(({ store, scope }) => ({ [scope]: store.getState() }), this.stores));
  }

}