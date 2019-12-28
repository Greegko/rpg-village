import { Module } from "../../models";
import { GameInstance, GameState } from "./interfaces";
import { createInvesifyContainer } from '../../lib/create-inversify-container';
import { forEach } from 'ramda';
import { getCoreModules } from "../../lib/get-core-modules";
import { applyModule } from "../../lib/apply-module";

export type CreateGameInstance = <S extends GameState>(config: { modules: Module[] }) => GameInstance<S>;

export const createGameInstance: CreateGameInstance = (config) => {
  const container = createInvesifyContainer();
  const modules = getCoreModules().concat(config.modules);
  forEach(applyModule(container), modules);
  return container.get('GameController');
};
