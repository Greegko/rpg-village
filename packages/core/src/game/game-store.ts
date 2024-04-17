import { injectable, multiInject } from "inversify";
import { forEach, map, mergeAll, prop } from "rambda";

import { GameState, Store, StoresToken } from "@core";

export interface ProvidedStore<State> {
  store: Store;
  scope: keyof State;
  initialState?: object;
}

@injectable()
export class GameStore {
  constructor(@multiInject(StoresToken) private stores: ProvidedStore<GameState>[]) {}

  init(state: GameState) {
    forEach(store => store.store.init(prop(store.scope, state) || store.initialState || {}), this.stores);
  }

  getState(): GameState {
    const states = map(({ store, scope }) => ({ [scope]: store.getState() }), this.stores) as Partial<GameState>[];

    return mergeAll(states) as GameState;
  }
}
