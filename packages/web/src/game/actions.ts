import { GamePageType } from "./interface";
import { changePage } from "./reducers";

export const openCharacterSheet = (unitId: string) => {
  return changePage({ page: GamePageType.CharacterSheet, args: { unitId } });
};
