import { GameConfig, GameState, Module } from "@rpg-village/core";
import { createGameInstance } from "@rpg-village/core";
import { activityModule } from "@rpg-village/core/features/activity";
import { battleModule } from "@rpg-village/core/features/battle";
import { debugModule } from "@rpg-village/core/features/debug";
import { gameModule } from "@rpg-village/core/features/game";
import { mapModule } from "@rpg-village/core/features/map";
import { optionsModule } from "@rpg-village/core/features/options";
import { partyModule } from "@rpg-village/core/features/party";
import { unitModule } from "@rpg-village/core/features/unit";
import { villageModule } from "@rpg-village/core/features/village";

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
