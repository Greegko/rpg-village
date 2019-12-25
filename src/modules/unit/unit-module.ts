import { Module } from "../../../src/models";
import { UnitService } from "./unit-service";
import { UnitStore } from "./unit-store";
import { UnitEquipmentService } from "./unit-equipment-service";

export const unitModule: Module = {
  stores: [{ scope: 'units', store: UnitStore }],
  provides: [UnitService, UnitEquipmentService]
};
