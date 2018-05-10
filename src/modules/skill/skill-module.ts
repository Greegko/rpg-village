import { Module } from "@greegko/rpg-model";
import { EffectService } from "./effect-service";

export const skillModule: Module = {
  provides: [EffectService]
};
