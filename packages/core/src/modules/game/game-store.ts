import { injectable, multiInject } from "inversify";
import { forEach, map, mergeAll, prop } from "ramda";

import { StoresToken } from "@core/module/tokens";
import { IStore } from "@core/store";

import { GameState } from "./interfaces";

export interface ProvidedStore<State> {
  store: IStore;
  scope: keyof State;
  initialState?: object;
}

@injectable()
export class GameStore<S extends GameState> {
  constructor(@multiInject(StoresToken) private stores: ProvidedStore<S>[]) {}

  init(state: S) {
    forEach(store => {
      (store.store as any).init(prop(store.scope as keyof S, state) || store.initialState || {});
    }, this.stores);
  }

  getState(): S {
    const states = map(({ store, scope }) => ({ [scope]: store.getState() }), this.stores) as Partial<S>[];

    return mergeAll(states) as S;
  }
}
