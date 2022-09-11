import { configureStore } from "@reduxjs/toolkit";
import { filter, map, values } from "ramda";
import { useCallback, useContext, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { GameState, PartyOwner } from "@rpg-village/core";

import { GameInstanceWrapperContext } from "@web/react-hooks";
import { gameAIReducer, partiesPreferencesSelector, useGameAIStateSelector } from "@web/store/ai";
import { gameReducer, idlePartiesSelector, setGameState } from "@web/store/game";
import { globalStoreActionsMiddleware, onStoreAction } from "@web/store/global-store-actions-middleware";
import { gameUIReducer } from "@web/store/ui";
import * as storeUIActions from "@web/store/ui/reducers";

import "../polyfill";
import { PlayerPartyAI } from "./ai/player-party-ai";
import { GameField } from "./components/game-field";
import { GameInstanceWrapper } from "./game/game-instance-wrapper";

const gameStore = configureStore({
  reducer: {
    game: gameReducer,
    ui: gameUIReducer,
    ai: gameAIReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(globalStoreActionsMiddleware),
});

const gameInstanceWrapper = new GameInstanceWrapper();
const partyAI = new PlayerPartyAI();

const GameInstanceLogic = () => {
  const gameInstanceWrapper = useContext(GameInstanceWrapperContext);
  const partiesPreferences = useGameAIStateSelector(partiesPreferencesSelector);

  const generateAICommands = useCallback(
    (gameState: GameState) => {
      const parties = idlePartiesSelector(gameState);
      const playerParties = filter(party => party.owner === PartyOwner.Player, parties);

      return map(
        party => partyAI.execute(gameState, party, partiesPreferences[party.id]),
        values(playerParties),
      ).filter(x => x);
    },
    [partiesPreferences],
  );

  useEffect(() => {
    gameInstanceWrapper.restoreOrNewGame();

    gameStore.dispatch(setGameState(gameInstanceWrapper.getState()));

    gameInstanceWrapper.setAICommandsGenerator(gameState => generateAICommands(gameState));
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
