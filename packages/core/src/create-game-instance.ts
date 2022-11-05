import { Container, interfaces } from "inversify";
import { forEach } from "ramda";

import { ModuleConfig, applyModule } from "@core/module";
import {
  ActivityHandlersToken,
  ConfigToken,
  GetActivityHandlerToken,
  GetInjectionToken,
  ModuleConfigToken,
} from "@core/module/tokens";

import { GameInstance, GameState } from "@modules/game";

import { GameConfig } from "./game-config";
import { GameController } from "./modules/game/game-controller";
import * as modules from "./modules/modules";

export type CreateGameInstance<S extends GameState> = (config?: GameConfig) => GameInstance<S>;

const coreModules = [
  modules.unitModule,
  modules.activityModule,
  modules.gameModule,
  modules.mapModule,
  modules.villageModule,
  modules.villageBuildingsModule,
  modules.partyModule,
  modules.battleModule,
  modules.debugModule,
];

export const createGameInstance: CreateGameInstance<GameState> = (config?: GameConfig) => {
  const container = createInvesifyContainer(config?.config);

  forEach(applyModule(container), coreModules);

  return container.get(GameController);
};

function createInvesifyContainer(config?: ModuleConfig) {
  const container = new Container({ defaultScope: "Singleton" });

  container
    .bind(GetInjectionToken)
    .toFactory((context: interfaces.Context) => (classDeclaration: any) => context.container.get(classDeclaration));

  container
    .bind(GetActivityHandlerToken)
    .toFactory(
      (context: interfaces.Context) => (name: string) =>
        context.container.getTagged(ActivityHandlersToken, "name", name),
    );

  container.bind(ConfigToken).toDynamicValue((context: interfaces.Context) => {
    const moduleConfigs = context.container.getAll<object>(ModuleConfigToken);

    return [moduleConfigs, config || {}].reduce((acc, value) => Object.assign(acc, value), {});
  });

  return container;
}
