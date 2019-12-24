import { Module } from "../../../core-src";
import { GameInstance, GameState } from "./interfaces";
import { container } from '../../injection.config';
import { forEach } from 'ramda';
import { getCoreModules } from "../../lib/get-core-modules";
import { applyModule } from "../../lib/apply-module";

export type CreateGameInstance = <S extends GameState>(config: { modules: Module[] }) => GameInstance<S>;

export const createGameInstance: CreateGameInstance = (config) => {
  const modules = getCoreModules().concat(config.modules);
  forEach(applyModule(container), modules);
  return container.get('GameController');
};
