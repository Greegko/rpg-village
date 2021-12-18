import { Module } from "@core/module";
import { UnitStore } from "./unit-store";
import { UnitCommandHandler } from "./unit-command-handler";

export const unitModule: Module = {
  stores: [{ scope: "units", store: UnitStore }],
  provides: [UnitCommandHandler],
};
