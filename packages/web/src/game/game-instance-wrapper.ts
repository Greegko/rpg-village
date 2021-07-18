import { createGameInstance, GameInstance, GameState, Command, GameConfigProvides } from '@rpg-village/core';
import { AICommandGenerator, StateUpdateCallback } from './interface';

export class GameInstanceWrapper {
  private turnsPerSecond = 2;
  private gameInstance: GameInstance<GameState>;
  private timer: any = null;
  private AI?: AICommandGenerator;
  private updateStateCallbacks: StateUpdateCallback[] = [];
  private enabledAI: boolean = true;

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

  enableAI(flag: boolean) {
    this.enabledAI = flag;
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
    const state = localStorage.getItem('gameState');
    const initGameState = state ? JSON.parse(state) as GameState : null;

    if (initGameState !== null) {
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
    if (this.AI && this.enabledAI) {
      const commands = this.AI(state);
      commands.forEach(command => this.gameInstance.executeCommand(command));
    }
  }
}
