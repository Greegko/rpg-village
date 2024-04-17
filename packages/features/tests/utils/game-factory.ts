import { GameConfig, GameState, Module, createGameInstance } from "@rpg-village/core";

import { activityModule } from "@rpg-village/features/activity";

interface GameFactory {
  state?: Partial<GameState>;
  config: Partial<GameConfig>;
}

export const GameModules: Module[] = [activityModule];

export function gameFactory({ state, config }: GameFactory) {
  const game = createGameInstance({ config: config?.config, modules: config.modules });

  if (state) {
    game.loadGame(state as GameState);
  }

  return game;
}
