import { forEach } from "rambda";

import { Command, GameInstance, GameState, createGameInstance } from "@rpg-village/village-manager";

import { StateUpdateCallback } from "../interface";

export type AICommandsGenerator = (gameState: GameState) => Command[];
export class GameInstanceWrapper {
  private turnsPerSecond = 2;
  private gameInstance: GameInstance;
  private timer: any | number | null = null;
  private AICommandsGenerator?: AICommandsGenerator;
  private updateStateCallbacks: StateUpdateCallback[] = [];
  private enabledAI: boolean = true;

  constructor() {
    this.gameInstance = createGameInstance();
  }

  setAICommandsGenerator(commandsGenerator: AICommandsGenerator) {
    this.AICommandsGenerator = commandsGenerator;
  }

  onStateUpdate(callback: StateUpdateCallback) {
    this.updateStateCallbacks.push(callback);
  }

  loadGame(gameState: GameState) {
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
    this.pause();

    for (let i = 0; i < turns; i++) {
      this.doTurn();
    }

    this.resume();

    this.emitStateUpdates();
  }

  pause() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  resume() {
    if (this.timer) return;

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
    const gameState = this.gameInstance.gameTurn();

    if (this.AICommandsGenerator && this.enabledAI) {
      forEach(command => this.gameInstance.executeCommand(command), this.AICommandsGenerator(gameState));
    }
  }
}
