import { Module } from "../../../core-src";
import { EffectService } from "./effect-service";

export const skillModule: Module = {
  provides: [EffectService]
};
