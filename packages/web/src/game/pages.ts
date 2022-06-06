import { GamePageType } from "./interface";
import { changePage } from "./reducers/game-ui";

export const openCharacterSheet = (unitId: string) => {
  return changePage({ page: GamePageType.CharacterSheet, args: { unitId } });
};
