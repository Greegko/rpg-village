import { ModuleConfig } from "@core";

import { Module } from "@rpg-village/core/extend";

export interface GameConfig {
  config?: ModuleConfig;
  modules?: Module[];
}
