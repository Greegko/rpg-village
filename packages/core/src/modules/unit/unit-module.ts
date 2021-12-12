import { Module } from "@core/module";
import { UnitService } from "./unit-service";
import { UnitStore } from "./unit-store";
import { UnitCommandHandler } from "./unit-command-handler";
import { UnitEventHandler } from "./unit-event-handler";

export const unitModule: Module = {
  eventHandler: UnitEventHandler,
  commandHandler: UnitCommandHandler,
  stores: [{ scope: "units", store: UnitStore }],
  provides: [UnitService],
};
