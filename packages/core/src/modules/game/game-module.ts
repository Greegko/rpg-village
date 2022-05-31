import { CommandSystem } from "@core/command";
import { EventSystem } from "@core/event";
import { Module } from "@core/module";

import { GameCommandHandler } from "./game-command-handler";
import { GameController } from "./game-controller";
import { GameService } from "./game-service";
import { GameStore } from "./game-store";
import { GeneralGameStore } from "./general-store";

export const gameModule: Module = {
  stores: [{ scope: "general", store: GeneralGameStore, initialState: { turn: 0 } }],
  provides: [GameController, GameStore, GameService, CommandSystem, EventSystem, GameCommandHandler],
};
