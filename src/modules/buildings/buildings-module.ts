import { Module } from "../../../core-src";
import { BlacksmithEventHandler } from "./blacksmith";

export const buildingsModule: Module = {
  eventHandlers: [{ eventHandler: BlacksmithEventHandler }]
}
