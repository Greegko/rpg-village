import { createGameInstance, GameInstance, GameState, Command } from '@rpg-village/core';
import { GameConfigProvides } from '@rpg-village/core/dist/lib/create-game-instance';

type AICommandGenerator = (state: GameState) => Command[];
type StateUpdateCallback = (game: GameState) => void;

export class GameInstanceWrapper {
  private turnsPerSecond = 2;
  private gameInstance: GameInstance<GameState> = null;
  private timer: any = null;
  private AI: AICommandGenerator = null;
  private updateStateCallbacks: StateUpdateCallback[] = [];

  constructor(gameConfig: GameConfigProvides) {
    this.gameInstance = createGameInstance({ provides: gameConfig });
  }

  setAI(AI: AICommandGenerator) {
    this.AI = AI;
  }

  onStateUpdate(callback: StateUpdateCallback) {
    this.updateStateCallbacks.push(callback);
  }

  load(gameState: GameState) {
    this.gameInstance.loadGame(gameState);
    this.emitStateUpdates();
  }

  startNewGame() {
    this.gameInstance.startNewGame();
    this.emitStateUpdates();
  }

  fastForward(turns: number) {
    const isRunning = this.timer !== null;
    this.pause();

    for (let i = 0; i < turns; i++) {
      this.doTurn();
    }

    if (isRunning) {
      this.resume();
    }

    this.emitStateUpdates();
  }

  localSave() {
    localStorage.setItem('gameState', JSON.stringify(this.gameInstance.getState()));
  }

  localReset() {
    localStorage.removeItem('gameState');
  }

  restoreOrNewGame() {
    const initGameState = JSON.parse(localStorage.getItem('gameState'));

    if (initGameState) {
      this.load(initGameState);
    } else {
      this.startNewGame();
    }
  }

  pause() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  resume() {
    this.timer = setInterval(() => {
      this.doTurn();
      this.emitStateUpdates();
    }, 1000 / this.turnsPerSecond);
  }

  executeCommand(command: Command) {
    this.gameInstance.executeCommand(command);
    this.emitStateUpdates();
  }

  getState(): GameState {
    return this.gameInstance.getState();
  }

  private emitStateUpdates() {
    const state = this.gameInstance.getState();
    this.updateStateCallbacks.forEach(callback => callback(state));
  }

  private doTurn() {
    const state = this.gameInstance.gameTurn();
    if (this.AI) {
      const commands = this.AI(state);
      commands.forEach(command => this.gameInstance.executeCommand(command));
    }
  }
}
