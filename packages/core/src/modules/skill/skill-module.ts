import { Module } from "@core/module";
import { EffectService } from "./effect-service";

export const skillModule: Module = {
  provides: [EffectService],
};
