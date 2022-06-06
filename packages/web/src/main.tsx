import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { createGameStore } from "@web/store/create-store";
import { setGameState } from "@web/store/game";

import "../polyfill";
import { PlayerAI } from "./ai/player-ai";
import { GameField } from "./components/game-field";
import { GameInstanceWrapper } from "./game/game-instance-wrapper";

const gameInstanceWrapper = new GameInstanceWrapper();
const playerAI = new PlayerAI();
const gameStore = createGameStore({ gameInstance: gameInstanceWrapper });
gameInstanceWrapper.restoreOrNewGame();

gameStore.dispatch(setGameState(gameInstanceWrapper.getState()));

gameInstanceWrapper.setAI(playerAI.execute);

gameInstanceWrapper.onStateUpdate(state => gameStore.dispatch(setGameState(state)));

gameInstanceWrapper.resume();

const container = document.getElementById("game");
const root = createRoot(container!);

root.render(
  <Provider store={gameStore}>
    <GameField />
  </Provider>,
);
