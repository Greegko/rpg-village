import { changePage } from "./store/game-ui";

export enum GamePageType {
  CharacterSheet,
}

export interface GamePage {
  page: GamePageType;
  args?: any;
}

export const openCharacterSheet = (unitId: string) => {
  return changePage({ page: GamePageType.CharacterSheet, args: { unitId } });
};
