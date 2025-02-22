import { forEach } from "rambda";

import { ModuleConfigToken, ModuleDefaultConfigToken, applyModule } from "@core";
import { inject, makeInjectable } from "@lib/dependency-injection";

import { GameConfig } from "./game-config";
import { GameController } from "./game-controller";
import { gameModule } from "./game-module";
import { GameInstance } from "./interfaces";

export type CreateGameInstance = (config: GameConfig) => GameInstance;

export const createGameInstance: CreateGameInstance = (config: GameConfig) => {
  makeInjectable(ModuleConfigToken, () => {
    const moduleConfigs = inject(ModuleDefaultConfigToken, { multi: true });

    return [moduleConfigs, config || {}].reduce((acc, value) => Object.assign(acc, value), {});
  });

  forEach(applyModule(), [gameModule, ...(config.modules || [])]);

  makeInjectable(GameController, GameController);

  return inject(GameController);
};
