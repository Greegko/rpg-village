import { injectable, multiInject } from "inversify";
import { forEach, map, mergeAll, prop } from "rambda";

import { GameState } from "@core/game-state";
import { StoresToken } from "@core/module/tokens";
import { IStore } from "@core/store";

export interface ProvidedStore<State> {
  store: IStore;
  scope: keyof State;
  initialState?: object;
}

@injectable()
export class GameStore {
  constructor(@multiInject(StoresToken) private stores: ProvidedStore<GameState>[]) {}

  init(state: GameState) {
    forEach(store => {
      (store.store as any).init(prop(store.scope as keyof GameState, state) || store.initialState || {});
    }, this.stores);
  }

  getState(): GameState {
    const states = map(({ store, scope }) => ({ [scope]: store.getState() }), this.stores) as Partial<GameState>[];

    return mergeAll(states) as GameState;
  }
}
