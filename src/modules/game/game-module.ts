import { Module } from "../../models";
import { GeneralGameStore } from './general-store';
import { GameCommandHandler } from './game-command-handler';
import { GameController } from './game-controller';
import { GameStore } from './game-store';
import { CommandSystem } from "../../lib/command-system";
import { GameService } from './game-service';

export const gameModule: Module = {
  stores: [{ scope: 'general', store: GeneralGameStore, initialState: { turn: 0 } }],
  commandHandlers: [GameCommandHandler],
  provides: [GameController, GameStore, GameService, CommandSystem]
};
