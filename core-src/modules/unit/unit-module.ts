import { Module } from "../../../src/models";
import { UnitService } from "./unit-service";
import { UnitStore } from "./unit-store";

export const unitModule: Module = {
  stores: [{ scope: 'units', store: UnitStore }],
  provides: [UnitService]
};
