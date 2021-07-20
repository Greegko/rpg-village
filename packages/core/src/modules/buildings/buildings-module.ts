import { Module } from "@core/module";
import { BlacksmithCommandHandler } from "./blacksmith";

export const buildingsModule: Module = {
  commandHandler: BlacksmithCommandHandler,
};
