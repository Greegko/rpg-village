import { GameState, Module } from "@rpg-village/core";
import { gameModule } from "@rpg-village/core/features/game";
import { GameConfig, createGameInstance } from "@rpg-village/core/game";

interface GameFactory {
  state?: Partial<GameState>;
  config: Partial<GameConfig>;
}

export const GameModules: Module[] = [gameModule];

export function gameFactory({ state, config }: GameFactory) {
  const game = createGameInstance({ config: config?.config, modules: config.modules || GameModules });

  if (state) {
    game.loadGame(state as GameState);
  }

  return game;
}
