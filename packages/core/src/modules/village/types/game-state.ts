import "@core/game-state";

import { VillageState } from "../interfaces";

declare module "@core/game-state" {
  export interface GameState {
    village: VillageState;
  }
}
