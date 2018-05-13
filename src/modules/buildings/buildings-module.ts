import { Module } from "@greegko/rpg-model";
import { BlacksmithEventHandler } from "./blacksmith";

export const buildingsModule: Module = {
  eventHandlers: [{ eventHandler: BlacksmithEventHandler }]
}
