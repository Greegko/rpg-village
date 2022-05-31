import { Command, GameState } from "@rpg-village/core";

export enum GamePageType {
  CharacterSheet,
}

export interface GamePage {
  page: GamePageType;
  args?: any;
}

export interface GameUI {
  page?: GamePage;
  paused: boolean;
  ai: boolean;
}

export interface GameStoreState {
  game: GameState;
  ui: GameUI;
}

export type AICommandGenerator = (state: GameState) => Command[];
export type StateUpdateCallback = (game: GameState) => void;
