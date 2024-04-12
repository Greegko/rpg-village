import { GameState } from "@rpg-village/core";

import { GameAIState } from "./ai";
import { GameUIState } from "./ui";

export interface GameStoreState {
  game: GameState;
  ui: GameUIState;
  ai: GameAIState;
}
