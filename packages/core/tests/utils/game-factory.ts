import { GameConfig, GameState, Module } from "@rpg-village/core";
import {
  activityModule,
  battleModule,
  createGameInstance,
  debugModule,
  gameModule,
  mapModule,
  optionsModule,
  partyModule,
  unitModule,
  villageModule,
} from "@rpg-village/core";

interface GameFactory {
  state?: Partial<GameState>;
  config: Partial<GameConfig>;
}

export const GameModules: Module[] = [
  villageModule,
  debugModule,
  optionsModule,
  gameModule,
  mapModule,
  activityModule,
  partyModule,
  battleModule,
  unitModule,
];

export function gameFactory({ state, config }: GameFactory) {
  const game = createGameInstance({ config: config?.config, modules: config.modules || GameModules });

  if (state) {
    game.loadGame(state as GameState);
  }

  return game;
}
