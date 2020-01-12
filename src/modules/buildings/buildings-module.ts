import { Module } from "../../models";
import { BlacksmithCommandHandler } from "./blacksmith";

export const buildingsModule: Module = {
  commandHandler: BlacksmithCommandHandler
}
