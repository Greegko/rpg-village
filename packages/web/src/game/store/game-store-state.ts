import { GameState } from "@rpg-village/core";

import { GameUIState } from "./game-ui/interface";

export interface GameStoreState {
  game: GameState;
  ui: GameUIState;
}
