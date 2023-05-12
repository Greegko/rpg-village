import { Module } from "@core/module";

import { OptionCommandHandler } from "./options-command-handler";
import { OptionStore } from "./options-store";

export const optionsModule: Module = {
  provides: [OptionCommandHandler],
  stores: [{ scope: "options", store: OptionStore }],
};
