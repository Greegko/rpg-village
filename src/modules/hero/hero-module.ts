import { Module } from "../../models";
import { HeroEventHandler } from "./hero-eventhandler";
import { HeroEquipment } from "./hero-equipment";
import { HeroService } from "./hero-service";

export const heroModule: Module = {
  eventHandlers: [{ eventHandler: HeroEventHandler }],
  provides: [HeroService, HeroEquipment]
};
