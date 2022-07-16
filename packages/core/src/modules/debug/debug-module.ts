import { Module } from "@core/module";

import { DebugCommandHandler } from "./debug-command-handler";

export const debugModule: Module = {
  provides: [DebugCommandHandler],
};
