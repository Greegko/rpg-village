import { GameState, Command } from "@rpg-village/core";

export enum GameScreen { WorldMap };
export enum GameOverlay { Village };
export interface GameUI {
  activeScreen: GameScreen;
  overlay?: GameOverlay;
  paused: boolean;
  ai: boolean;
}

export interface GameStoreState {
  game: GameState;
  ui: GameUI;
}

export type AICommandGenerator = (state: GameState) => Command[];
export type StateUpdateCallback = (game: GameState) => void;
