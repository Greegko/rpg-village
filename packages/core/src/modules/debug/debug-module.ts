import { Module } from "@core";

import { DebugCommandHandler } from "./debug-command-handler";

export const debugModule: Module = {
  provides: [DebugCommandHandler],
};
