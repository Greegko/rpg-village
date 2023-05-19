import { Container, interfaces } from "inversify";
import { forEach } from "rambda";

import { ModuleConfig, applyModule } from "@core/module";
import {
  ActivityHandlersToken,
  GetActivityHandlerToken,
  GetInjectionToken,
  ModuleConfigToken,
  ModuleDefaultConfigToken,
} from "@core/module/tokens";

import { GameInstance } from "@modules/game";
import * as modules from "@modules/modules";

import { GameConfig } from "./game-config";
import { GameController } from "./game-controller";

export type CreateGameInstance = (config?: GameConfig) => GameInstance;

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
  modules.shopModule,
  modules.optionsModule,
];

export const createGameInstance: CreateGameInstance = (config?: GameConfig) => {
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

  container.bind(ModuleConfigToken).toDynamicValue((context: interfaces.Context) => {
    const moduleConfigs = context.container.getAll<object>(ModuleDefaultConfigToken);

    return [moduleConfigs, config || {}].reduce((acc, value) => Object.assign(acc, value), {});
  });

  return container;
}
