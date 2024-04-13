import { gameStore } from "../game-store";
import { GameAIState } from "./state";

export const useGameAiStateSelector =
  <T extends (gameAiState: GameAIState) => any>(selector: T): (() => ReturnType<T>) =>
  () =>
    selector(gameStore.ai);
