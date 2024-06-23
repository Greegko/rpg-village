import { Module } from "@rpg-village/core";

import { OptionCommandHandler } from "./options-command-handler";
import { OptionStore } from "./options-store";

export const optionsModule: Module = {
  stores: [{ scope: "options", store: OptionStore }],
  provides: [OptionCommandHandler],
};
