import { Module } from "../../../core-src";
import { GeneralGameStore } from './general-store';
import { GameEventHandler } from './game-event-handler';
import { GameController } from './game-controller';
import { GameStore } from './game-store';
import { EventSystem } from "../../../core-src";
import { GameService } from './game-service';

export const gameModule: Module = {
  stores: [{ scope: 'general', store: GeneralGameStore, initialState: { turn: 0 } }],
  eventHandlers: [{ eventHandler: GameEventHandler }],
  provides: [GameController, GameStore, GameService, EventSystem]
};
