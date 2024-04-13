import { gameStore } from "../game-store";
import { GameDebugState } from "./state";

export const useGameDebugState =
  <T extends (gameUiState: GameDebugState) => any>(selector: T): (() => ReturnType<T>) =>
  () =>
    selector(gameStore.debug);
