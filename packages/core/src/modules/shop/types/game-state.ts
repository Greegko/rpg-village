import "@core/game-state";

import { ShopID, ShopState } from "../interfaces";

declare module "@core/game-state" {
  export interface GameState {
    shops: Record<ShopID, ShopState>;
  }
}
