import { GameState } from "@rpg-village/core";

import { GameAIState } from "./ai/interface";
import { GameUIState } from "./ui/interface";

export interface GameStoreState {
  game: GameState;
  ui: GameUIState;
  ai: GameAIState;
}
