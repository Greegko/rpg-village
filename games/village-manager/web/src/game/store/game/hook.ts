import { GameState } from "@rpg-village/village-manager-core";

import { gameStore } from "../game-store";

export const useGameStateSelector =
  <T extends (gameState: GameState) => any>(selector: T): (() => ReturnType<T>) =>
  () =>
    selector(gameStore.game);
