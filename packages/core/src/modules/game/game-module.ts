import { CommandSystem, EventSystem, Module } from "@core";

import { GameCommandHandler } from "./game-command-handler";
import { GameService } from "./game-service";
import { GameStore } from "./game-store";
import { GeneralGameStore } from "./general-store";

export const gameModule: Module = {
  stores: [{ scope: "general", store: GeneralGameStore, initialState: { turn: 0 } }],
  provides: [GameStore, GameService, CommandSystem, EventSystem, GameCommandHandler],
};
