import { configureStore } from "@reduxjs/toolkit";

import { createActionMiddlwareFactory } from "../action-middleware-factory";
import { GameInstanceWrapper } from "../game-instance-wrapper";
import { gameReducer } from "./game";
import { gameCommandsActions } from "./game-command";
import { gameUIReducer, gameUIactions } from "./game-ui";

export const createGameStore = <Context extends { gameInstance: GameInstanceWrapper }>(context: Context) =>
  configureStore({
    reducer: {
      game: gameReducer,
      ui: gameUIReducer,
    },
    middleware: getDefaultMiddleware => {
      const defaultMiddleware = getDefaultMiddleware();
      const actionMiddlewareFactory = createActionMiddlwareFactory(context);

      return [
        ...defaultMiddleware,
        actionMiddlewareFactory(gameUIactions).middleware,
        actionMiddlewareFactory(gameCommandsActions).middleware,
      ];
    },
  });

type Store = ReturnType<typeof createGameStore>;

export type GameStoreState = ReturnType<Store["getState"]>;
