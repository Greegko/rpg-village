import { Command, Event } from "@core";

import { GameState } from "@rpg-village/core/extend";

export interface GameInstance {
  gameTurn(): GameState;
  getState(): GameState;
  loadGame(gameState: GameState): GameState;
  startNewGame(): GameState;
  emitEvent(event: Event): void;
  executeCommand(command: Command): GameState;
}
