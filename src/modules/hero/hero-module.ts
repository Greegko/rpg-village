import { Module } from "../../models";
import { HeroEventHandler } from "./hero-eventhandler";
import { HeroEquipment } from "./hero-equipment";

export const heroModule: Module = {
  eventHandlers: [{ eventHandler: HeroEventHandler }],
  provides: [HeroEquipment]
};
