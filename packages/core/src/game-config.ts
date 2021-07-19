import { Module } from '@core/module';
import { GameConfigProvides } from "./create-game-instance";

export interface GameConfig {
  modules: Module[];
  provides: GameConfigProvides;
}