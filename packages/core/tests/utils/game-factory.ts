import { GameConfig, GameState, createGameInstance } from "../../src";

interface GameFactory {
  state?: Partial<GameState>;
  config?: Partial<GameConfig>;
}

export function gameFactory({ state, config }: GameFactory = {}) {
  const game = createGameInstance({ config: config?.config, modules: config?.modules || [] });

  if (state) {
    game.loadGame(state as GameState);
  }

  return game;
}
