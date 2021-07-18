import { GameState, Command } from "@rpg-village/core";

export interface GameUI {
  paused: boolean;
  ai: boolean;
}

export interface GameStoreState {
  game: GameState;
  ui: GameUI;
}

export type AICommandGenerator = (state: GameState) => Command[];
export type StateUpdateCallback = (game: GameState) => void;
