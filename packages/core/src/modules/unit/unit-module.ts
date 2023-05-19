import { Module } from "@core";

import { UnitCommandHandler } from "./unit-command-handler";
import { UnitService } from "./unit-service";
import { UnitStore } from "./unit-store";

export const unitModule: Module = {
  stores: [{ scope: "units", store: UnitStore }],
  provides: [UnitCommandHandler, UnitService],
};
