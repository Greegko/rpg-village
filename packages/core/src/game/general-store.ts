import { ObjectStore, injectableStore } from "@core";

import { GeneralGameStoreState } from "./interfaces";

@injectableStore("general", { turn: 0 })
export class GeneralGameStore extends ObjectStore<GeneralGameStoreState> {}
