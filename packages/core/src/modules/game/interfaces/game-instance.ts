import { Command } from "@core/command";
import { GameState } from "./game-state";

export interface GameInstance<S extends GameState> {
  gameTurn(): S;
  getState(): S;
  loadGame(gameState: S): S;
  startNewGame(): S;
  executeCommand(command: Command): S;
}
