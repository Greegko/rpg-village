import "@core/game-state";

import { Party, PartyID } from "../interfaces";

declare module "@core/game-state" {
  export interface GameState {
    parties: Record<PartyID, Party>;
  }
}
