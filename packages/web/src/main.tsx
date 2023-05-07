import { configureStore } from "@reduxjs/toolkit";
import { filter, forEach, map, values } from "rambda";
import { useContext, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Provider, useDispatch } from "react-redux";

import { Command, GameState, Party, PartyOwner } from "@rpg-village/core";

import { GameInstanceWrapperContext } from "@web/react-hooks";
import {
  PartyAction,
  PartyState,
  clearPartyAction,
  gameAIReducer,
  partiesStatesSelector,
  setPartyAction,
  useGameAIStateSelector,
} from "@web/store/ai";
import { gameReducer, noActiveActivityPartiesSelector, setGameState } from "@web/store/game";
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
  const partyStates = useGameAIStateSelector(partiesStatesSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    gameInstanceWrapper.restoreOrNewGame();

    gameStore.dispatch(setGameState(gameInstanceWrapper.getState()));

    gameInstanceWrapper.onStateUpdate(state => gameStore.dispatch(setGameState(state)));
    gameInstanceWrapper.resume();
  }, []);

  useEffect(() => {
    const executeAI = (gameState: GameState, partyStates: Record<string, PartyState>) => {
      const parties = noActiveActivityPartiesSelector(gameState);
      const playerParties = filter(party => party.owner === PartyOwner.Player, parties);

      return map(
        party => [party, partyAI.execute(gameState, party, partyStates[party.id] || {})],
        values(playerParties),
      ) as [Party, [PartyAction | null, Command | null]][];
    };

    gameInstanceWrapper.setAICommandsGenerator(gameState => {
      const updates = executeAI(gameState, partyStates);

      forEach(([party, [newPartyAction]]) => {
        if (newPartyAction === null) {
          dispatch(clearPartyAction({ partyId: party.id }));
        } else {
          dispatch(setPartyAction({ partyId: party.id, partyAction: newPartyAction }));
        }
      }, updates);

      return filter(
        x => x !== null,
        map(x => x[1][1] as any, updates),
      ) as Command[];
    });
  }, [partyStates]);

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
