import { Module } from "../../../src/models";
import { UnitService } from "./unit-service";
import { UnitStore } from "./unit-store";
import { UnitCommandHandler } from "./unit-command-handler";

export const unitModule: Module = {
  commandHandlers: [UnitCommandHandler],
  stores: [{ scope: 'units', store: UnitStore }],
  provides: [UnitService]
};
