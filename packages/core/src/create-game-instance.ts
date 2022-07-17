import { Container, interfaces } from "inversify";
import { forEach } from "ramda";

import { applyModule } from "@core/module";

import { GameInstance, GameState } from "@modules/game";

import { GameConfig } from "./game-config";
import { GameController } from "./modules/game/game-controller";
import * as modules from "./modules/modules";

export type CreateGameInstance<S extends GameState> = (config?: GameConfig) => GameInstance<S>;

const coreModules = [
  modules.unitModule,
  modules.activityModule,
  modules.gameModule,
  modules.configModule,
  modules.mapModule,
  modules.villageModule,
  modules.villageBuildingsModule,
  modules.partyModule,
  modules.battleModule,
  modules.debugModule,
];

export const createGameInstance: CreateGameInstance<GameState> = () => {
  const container = createInvesifyContainer();

  forEach(applyModule(container), coreModules);

  return container.get(GameController);
};

function createInvesifyContainer() {
  const container = new Container({ defaultScope: "Singleton" });

  container
    .bind("getInjection")
    .toFactory((context: interfaces.Context) => (classDeclaration: any) => context.container.get(classDeclaration));

  container
    .bind("getActivityHandler")
    .toFactory(
      (context: interfaces.Context) => (name: string) => context.container.getTagged("ActivityHandlers", "name", name),
    );

  return container;
}
