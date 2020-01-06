import { Module } from "../../../src/models";
import { UnitService } from "./unit-service";
import { UnitStore } from "./unit-store";
import { UnitEventHandler } from "./unit-eventhandler";

export const unitModule: Module = {
  eventHandlers: [{ eventHandler: UnitEventHandler }],
  stores: [{ scope: 'units', store: UnitStore }],
  provides: [UnitService]
};
