import { GameState, ModuleConfig } from "@rpg-village/core";
import { createGameInstance } from "@rpg-village/core";

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
