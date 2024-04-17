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

import { GameConfig } from "./game-config";
import { GameController } from "./game-controller";
import { gameModule } from "./game-module";
import { GameInstance } from "./interfaces";

export type CreateGameInstance = (config: GameConfig) => GameInstance;

export const createGameInstance: CreateGameInstance = (config: GameConfig) => {
  const container = createInvesifyContainer(config.config);

  forEach(applyModule(container), [gameModule, ...(config.modules || [])]);

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
