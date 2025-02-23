import { Type } from "@greegko/tiny-di";

import { createInjectableToken, inject, makeInjectable } from "@lib/dependency-injection";

import { GameState } from "@rpg-village/core/extend";

import { Store } from "./store";

export interface GameStateScopeStore<T extends keyof GameState> {
  store: Store;
  scope: T;
  initialState?: Partial<GameState[T]>;
}

export const StoresToken = createInjectableToken<GameStateScopeStore<any>>("StoresToken");

export const injectableStore = <T extends keyof GameState>(scope: T, initialState: Partial<GameState[T]>) => {
  return <T extends Type>(target: T) => {
    makeInjectable(target);

    makeInjectable(
      StoresToken,
      () => ({
        scope,
        store: inject(target),
        initialState,
      }),
      { multi: true },
    );
  };
};
