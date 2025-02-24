import { clearInstances } from "@rpg-village/core";

import { GameState, createGameInstance } from "../../src";

interface GameFactory {
  state: Partial<GameState>;
}

export function gameFactory({ state }: GameFactory) {
  clearInstances();
  const game = createGameInstance();

  if (state) {
    game.loadGame(state as GameState);
  }

  return game;
}
