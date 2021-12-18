import { GameState, createGameInstance } from "../../public-api";

interface GameFactory {
  state: Partial<GameState>;
}

export function gameFactory({ state }: Partial<GameFactory> = {}) {
  const game = createGameInstance();

  if (state) {
    game.loadGame(state as GameState);
  }

  return game;
}
