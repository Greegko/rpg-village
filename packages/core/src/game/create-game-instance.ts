import { Container, interfaces } from "inversify";
import { forEach } from "rambda";

import {
  ActivityHandlersToken,
  GetActivityHandlerToken,
  GetInjectionToken,
  ModuleConfig,
  ModuleConfigToken,
  ModuleDefaultConfigToken,
  applyModule,
} from "@core";

import * as features from "@features";

import { GameConfig } from "./game-config";
import { GameController } from "./game-controller";
import { GameInstance } from "./interfaces";

export type CreateGameInstance = (config?: GameConfig) => GameInstance;

const coreModules = [
  features.villageModule,
  features.debugModule,
  features.optionsModule,
  features.gameModule,
  features.mapModule,
  features.activityModule,
  features.partyModule,
  features.battleModule,
  features.unitModule,
];

export const createGameInstance: CreateGameInstance = (config?: GameConfig) => {
  const container = createInvesifyContainer(config?.config);

  forEach(applyModule(container), coreModules);

  container.bind(GameController).toSelf();

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
