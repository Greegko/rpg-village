import { GameState, Command } from "@rpg-village/core";

export enum GameScreen { Village, WorldMap };
export interface GameUI {
  activeScreen: GameScreen;
  paused: boolean;
  ai: boolean;
}

export interface GameStoreState {
  game: GameState;
  ui: GameUI;
}

export type AICommandGenerator = (state: GameState) => Command[];
export type StateUpdateCallback = (game: GameState) => void;
