import { GameState } from './game-state';
import { Event } from "../../../models";

export interface GameInstance<S extends GameState> {
  gameTurn(): S;
  getState(): S;
  loadGame(gameState: S): S;
  startNewGame(): S;
  fireEvent(event: Event): S;
}
