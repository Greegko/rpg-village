import { GameState, ModuleConfig } from "@core";
import { createGameInstance } from "@game";

interface GameFactory {
  state: Partial<GameState>;
  config?: ModuleConfig;
}

export function gameFactory({ state, config }: Partial<GameFactory> = {}) {
  const game = createGameInstance({ config });

  if (state) {
    game.loadGame(state as GameState);
  }

  return game;
}
