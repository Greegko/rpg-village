import { Module } from "../models";
import * as modules from '../modules';
import { GameInstance, GameState } from "../modules/game/interfaces";
import { createInvesifyContainer } from './create-inversify-container';
import { forEach, forEachObjIndexed } from 'ramda';
import { applyModule } from "./apply-module";
import { Skill } from "../modules";

export interface GameConfigProvides {
  available_skills: Skill[];
}

export interface GameConfig {
  modules: Module[];
  provides: GameConfigProvides;
}

export type CreateGameInstance = <S extends GameState>(config?: Partial<GameConfig>) => GameInstance<S>;

const coreModules = [
  modules.unitModule, modules.activityModule,
  modules.gameModule, modules.configModule, modules.worldModule, modules.villageModule, modules.buildingsModule,
  modules.partyModule, modules.battleModule, modules.skillModule
]

export const createGameInstance: CreateGameInstance = (config = {}) => {
  const container = createInvesifyContainer();
  const modules = coreModules.concat(config.modules || []);

  if (config.provides) {
    forEachObjIndexed((val, key) => container.bind(key).toConstantValue(val), config.provides);
  }

  forEach(applyModule(container), modules);
  return container.get('GameController');
};
