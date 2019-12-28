import { GameState } from './game-state';
import { Event } from "../../../models";
import { Command } from '../../command/interfaces';

export interface GameInstance<S extends GameState> {
  gameTurn(): S;
  getState(): S;
  loadGame(gameState: S): S;
  startNewGame(): S;
  fireEvent(event: Event): S;
  commandParty(command: Command): S;
}
