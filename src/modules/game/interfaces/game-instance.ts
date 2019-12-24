import { GameState } from './game-state';
import { Event } from '@greegko/rpg-model';
import { Command } from '@greegko/rpg-model';

export interface GameInstance<S extends GameState> {
  gameTurn(): S;
  loadGame(gameState: S): S;
  startNewGame(): S;
  fireEvent(event: Event): S;
  commandParty(command: Command): S;
}
