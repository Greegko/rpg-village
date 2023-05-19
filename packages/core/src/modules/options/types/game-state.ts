import "@core/game-state";

import { OptionID, OptionState } from "../interfaces";

declare module "@core/game-state" {
  export interface GameState {
    options: Record<OptionID, OptionState>;
  }
}
