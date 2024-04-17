import { Module, ModuleConfig } from "@core";

export interface GameConfig {
  config?: ModuleConfig;
  modules?: Module[];
}
