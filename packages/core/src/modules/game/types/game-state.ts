import "@core/game-state";

import { GeneralGameStoreState } from "../interfaces";

declare module "@core/game-state" {
  export interface GameState {
    general: GeneralGameStoreState;
  }
}
