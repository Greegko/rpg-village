import { Module } from "../../models";
import { EffectService } from "./effect-service";

export const skillModule: Module = {
  provides: [EffectService]
};
