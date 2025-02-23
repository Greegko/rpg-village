import { GameState, createGameInstance } from "@rpg-village/core";

interface GameFactory {
  state?: Partial<GameState>;
}

export function gameFactory({ state }: GameFactory) {
  const game = createGameInstance();

  if (state) {
    game.loadGame(state as GameState);
  }

  return game;
}
