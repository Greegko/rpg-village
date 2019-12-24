import { GameState } from './game-state';
import { Event } from "../../../../core-src";
import { Command } from '../../command/interfaces';

export interface GameInstance<S extends GameState> {
  gameTurn(): S;
  loadGame(gameState: S): S;
  startNewGame(): S;
  fireEvent(event: Event): S;
  commandParty(command: Command): S;
}
