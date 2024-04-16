import { Module } from "@rpg-village/core";

import { DebugCommandHandler } from "./debug-command-handler";

export const debugModule: Module = {
  provides: [DebugCommandHandler],
};
