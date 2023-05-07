import { forEach } from "rambda";

import { Command, GameInstance, GameState, createGameInstance } from "@rpg-village/core";

import { StateUpdateCallback } from "./interface";

interface CommandHistory {
  turn: number;
  command: Command;
}

export type AICommandsGenerator = (gameState: GameState) => Command[];

export class GameInstanceWrapper {
  private turnsPerSecond = 2;
  private gameInstance: GameInstance<GameState>;
  private timer: any | number | null = null;
  private AICommandsGenerator?: AICommandsGenerator;
  private updateStateCallbacks: StateUpdateCallback[] = [];
  private enabledAI: boolean = true;
  private commandHistory: CommandHistory[] = [];

  constructor() {
    this.gameInstance = createGameInstance({
      config: { "village/direct-loot-to-village": true },
    });
  }

  setAICommandsGenerator(commandsGenerator: AICommandsGenerator) {
    this.AICommandsGenerator = commandsGenerator;
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
    this.pause();

    for (let i = 0; i < turns; i++) {
      this.doTurn();
    }

    this.resume();

    this.emitStateUpdates();
  }

  localSave() {
    localStorage.setItem("gameState", JSON.stringify(this.gameInstance.getState()));
    localStorage.setItem("commandHistory", JSON.stringify(this.commandHistory));
  }

  localReset() {
    localStorage.removeItem("gameState");
    localStorage.removeItem("commandHistory");
  }

  restoreOrNewGame() {
    const state = localStorage.getItem("gameState");
    const initGameState = state ? (JSON.parse(state) as GameState) : null;

    if (initGameState !== null) {
      this.load(initGameState);
      this.commandHistory = JSON.parse(localStorage.getItem("commandHistory") as string);
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
    if (this.timer) return;

    this.timer = setInterval(() => {
      this.doTurn();
      this.emitStateUpdates();
    }, 1000 / this.turnsPerSecond);
  }

  executeCommand(command: Command) {
    this.commandHistory.push({ turn: this.gameInstance.getState().general.turn, command });
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
