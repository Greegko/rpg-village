import { Module } from "@rpg-village/core";

import { GameCommandHandler } from "./game-command-handler";

export const gameModule: Module = {
  provides: [GameCommandHandler],
};
