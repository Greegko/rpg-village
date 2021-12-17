import { forEach, forEachObjIndexed } from "ramda";
import { Container, interfaces } from "inversify";

import { GameInstance, GameState } from "@modules/game";
import { applyModule } from "@core/module";

import * as modules from "./modules/public-api";
import { Skill } from "./modules/skill";
import { GameConfig } from "./game-config";
import { GameController } from "./modules/game/game-controller";

export interface GameConfigProvides {
  available_skills: Skill[];
}

export type CreateGameInstance = <S extends GameState>(config?: Partial<GameConfig>) => GameInstance<S>;

const coreModules = [
  modules.unitModule,
  modules.activityModule,
  modules.gameModule,
  modules.configModule,
  modules.worldModule,
  modules.villageModule,
  modules.buildingsModule,
  modules.partyModule,
  modules.battleModule,
  modules.skillModule,
];

export const createGameInstance: CreateGameInstance = (config = {}) => {
  const container = createInvesifyContainer();
  const modules = coreModules.concat(config.modules || []);

  if (config.provides) {
    forEachObjIndexed((val, key) => container.bind(key).toConstantValue(val), config.provides);
  }

  forEach(applyModule(container), modules);

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
