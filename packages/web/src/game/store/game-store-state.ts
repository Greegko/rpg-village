import { GameState } from "@rpg-village/core";

import { GameAIState } from "./ai";
import { GameDebugState } from "./debug";
import { GameUIState } from "./ui";

export interface GameStoreState {
  game: GameState;
  ui: GameUIState;
  ai: GameAIState;
  debug: GameDebugState;
}
