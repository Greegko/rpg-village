import { GameState } from './game-state';
import { Command } from "../../../models";

export interface GameInstance<S extends GameState> {
  gameTurn(): S;
  getState(): S;
  loadGame(gameState: S): S;
  startNewGame(): S;
  executeCommand(command: Command): S;
}
