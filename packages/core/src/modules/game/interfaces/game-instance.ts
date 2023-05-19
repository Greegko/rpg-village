import { Command } from "@core/command";
import { Event } from "@core/event";
import { GameState } from "@core/game-state";

export interface GameInstance {
  gameTurn(): GameState;
  getState(): GameState;
  loadGame(gameState: GameState): GameState;
  startNewGame(): GameState;
  emitEvent(event: Event): void;
  executeCommand(command: Command): GameState;
}
