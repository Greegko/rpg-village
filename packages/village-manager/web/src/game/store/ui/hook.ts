import { gameStore } from "../game-store";
import { GameUIState } from "./state";

export const useGameUiStateSelector =
  <T extends (gameUiState: GameUIState) => any>(selector: T): (() => ReturnType<T>) =>
  () =>
    selector(gameStore.ui);
