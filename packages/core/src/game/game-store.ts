import { forEach, map, mergeAll, prop } from "rambda";

import { GameState, StoresToken } from "@core";
import { inject, injectable } from "@lib/dependency-injection";

@injectable()
export class GameStore {
  private stores = inject(StoresToken, { multi: true });

  init(state: GameState) {
    forEach(store => store.store.init(prop(store.scope, state) || store.initialState || {}), this.stores);
  }

  getState(): GameState {
    const states = map(({ store, scope }) => ({ [scope]: store.getState() }), this.stores) as Partial<GameState>[];

    return mergeAll(states) as GameState;
  }
}
