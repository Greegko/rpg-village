import { Command, Event, GameState } from "@core";

export interface GameInstance {
  gameTurn(): GameState;
  getState(): GameState;
  loadGame(gameState: GameState): GameState;
  startNewGame(): GameState;
  emitEvent(event: Event): void;
  executeCommand(command: Command): GameState;
}
