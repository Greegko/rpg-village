import { Module } from "@core/module";

import { UnitCommandHandler } from "./unit-command-handler";
import { UnitStore } from "./unit-store";

export const unitModule: Module = {
  stores: [{ scope: "units", store: UnitStore }],
  provides: [UnitCommandHandler],
};
