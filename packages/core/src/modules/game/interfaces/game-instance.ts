import { Command } from "@core/command";
import { Event } from "@core/event";

import { GameState } from "./game-state";

export interface GameInstance<S extends GameState> {
  gameTurn(): S;
  getState(): S;
  loadGame(gameState: S): S;
  startNewGame(): S;
  emitEvent(event: Event): void;
  executeCommand(command: Command): S;
}
