import { GameState } from "@rpg-village/core";

import { createGameInstance } from "@rpg-village/village-manager/game";

interface GameFactory {
  state: Partial<GameState>;
}

export function gameFactory({ state }: GameFactory) {
  const game = createGameInstance();

  if (state) {
    game.loadGame(state as GameState);
  }

  return game;
}
