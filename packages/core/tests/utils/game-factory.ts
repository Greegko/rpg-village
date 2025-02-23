import { GameState, createGameInstance } from "../../src";

interface GameFactory {
  state?: Partial<GameState>;
}

export function gameFactory({ state }: GameFactory = {}) {
  const game = createGameInstance();

  if (state) {
    game.loadGame(state as GameState);
  }

  return game;
}
