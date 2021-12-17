import { Module } from "@core/module";
import { CommandSystem } from "@core/command";
import { EventSystem } from "@core/event";
import { GeneralGameStore } from "./general-store";
import { GameCommandHandler } from "./game-command-handler";
import { GameController } from "./game-controller";
import { GameStore } from "./game-store";
import { GameService } from "./game-service";

export const gameModule: Module = {
  stores: [{ scope: "general", store: GeneralGameStore, initialState: { turn: 0, difficulty: 0 } }],
  commandHandler: GameCommandHandler,
  provides: [GameController, GameStore, GameService, CommandSystem, EventSystem],
};
