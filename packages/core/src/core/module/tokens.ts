import { GameState } from "@core";
import { createInjectableToken } from "@lib/dependency-injection";

import { Store } from "../store";

export interface ProvidedStore<State> {
  store: Store;
  scope: keyof State;
  initialState?: object;
}

export const ModuleDefaultConfigToken = createInjectableToken<object>("ModuleDefaultConfigToken");
export const StoresToken = createInjectableToken<ProvidedStore<GameState>>("StoresToken");
export const ActivityHandlersToken = createInjectableToken("ActivityHandlersToken");

export const ModuleConfigToken = createInjectableToken<object>("ConfigToken");
