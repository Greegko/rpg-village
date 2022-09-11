import { configureStore } from "@reduxjs/toolkit";
import { useContext, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { GameInstanceWrapperContext } from "@web/react-hooks";
import { gameReducer, setGameState } from "@web/store/game";
import { globalStoreActionsMiddleware, onStoreAction } from "@web/store/global-store-actions-middleware";
import { gameUIReducer } from "@web/store/ui";
import * as storeUIActions from "@web/store/ui/reducers";

import "../polyfill";
import { PlayerAI } from "./ai/player-ai";
import { GameField } from "./components/game-field";
import { GameInstanceWrapper } from "./game/game-instance-wrapper";

const gameStore = configureStore({
  reducer: {
    game: gameReducer,
    ui: gameUIReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(globalStoreActionsMiddleware),
});

const gameInstanceWrapper = new GameInstanceWrapper();

const GameInstanceLogic = () => {
  const gameInstanceWrapper = useContext(GameInstanceWrapperContext);

  useEffect(() => {
    const playerAI = new PlayerAI();

    gameInstanceWrapper.restoreOrNewGame();

    gameStore.dispatch(setGameState(gameInstanceWrapper.getState()));

    gameInstanceWrapper.setAI(playerAI.execute);
    gameInstanceWrapper.onStateUpdate(state => gameStore.dispatch(setGameState(state)));
    gameInstanceWrapper.resume();
  }, []);

  useEffect(() => {
    onStoreAction(storeUIActions.pause, () => gameInstanceWrapper.pause());
    onStoreAction(storeUIActions.resume, () => gameInstanceWrapper.resume());
    onStoreAction(storeUIActions.enableAI, () => gameInstanceWrapper.enableAI(true));
    onStoreAction(storeUIActions.disableAI, () => gameInstanceWrapper.enableAI(false));
  }, []);

  return null;
};

const container = document.getElementById("game");
const root = createRoot(container!);

root.render(
  <Provider store={gameStore}>
    <GameInstanceWrapperContext.Provider value={gameInstanceWrapper}>
      <GameInstanceLogic />
      <GameField />
    </GameInstanceWrapperContext.Provider>
  </Provider>,
);
