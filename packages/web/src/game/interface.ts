import { GameState } from "@rpg-village/core";

export enum GameScreen { Village, WorldMap };
export interface GameUI {
  activeScreen: GameScreen;
  paused: boolean;
}

export interface GameStoreState {
  game: GameState;
  ui: GameUI;
}
