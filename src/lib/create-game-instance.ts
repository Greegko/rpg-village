import { Module } from "../models";
import * as modules from '../modules';
import { GameInstance, GameState } from "../modules/game/interfaces";
import { createInvesifyContainer } from './create-inversify-container';
import { forEach } from 'ramda';
import { applyModule } from "./apply-module";

export interface GameConfig {
  modules: Module[]
}

export type CreateGameInstance = <S extends GameState>(config?: Partial<GameConfig>) => GameInstance<S>;

const coreModules = [
  modules.unitModule, modules.activityModule,
  modules.gameModule, modules.configModule, modules.worldModule, modules.villageModule, modules.buildingsModule,
  modules.partyModule, modules.battleModule, modules.skillModule
]

export const createGameInstance: CreateGameInstance = (config) => {
  const container = createInvesifyContainer();
  const modules = coreModules.concat((config && config.modules) || []);
  forEach(applyModule(container), modules);
  return container.get('GameController');
};
