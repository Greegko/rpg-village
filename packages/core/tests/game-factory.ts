import { GameState, createGameInstance } from "../src";

interface GameFactory {
  state: Partial<GameState>;
}

export function gameFactory({ state }: Partial<GameFactory> = {}) {
  const game = createGameInstance<GameState>();

  if (state) {
    game.loadGame(state as GameState);
  }

  return game;
}
