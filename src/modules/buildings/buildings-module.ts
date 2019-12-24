import { Module } from "../../models";
import { BlacksmithEventHandler } from "./blacksmith";

export const buildingsModule: Module = {
  eventHandlers: [{ eventHandler: BlacksmithEventHandler }]
}
