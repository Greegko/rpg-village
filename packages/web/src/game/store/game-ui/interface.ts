import { MapID } from "@rpg-village/core";

export enum GamePageType {
  CharacterSheet,
}

export interface GamePage {
  page: GamePageType;
  args?: any;
}

export interface GameUIState {
  paused: boolean;
  ai: boolean;
  page?: GamePage;
  map?: MapID;
}
