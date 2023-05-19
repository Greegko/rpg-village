import "@core/game-state";

import { Unit, UnitID } from "../interfaces";

declare module "@core/game-state" {
  export interface GameState {
    units: Record<UnitID, Unit>;
  }
}
