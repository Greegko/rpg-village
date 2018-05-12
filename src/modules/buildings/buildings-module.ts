import { Module } from "@greegko/rpg-model";
import { BlacksmithEventHandler } from "./blacksmith-events";

export const buildingsModule: Module = {
  eventHandlers: [{ eventHandler: BlacksmithEventHandler }]
}
