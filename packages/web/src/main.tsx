import { filter, forEach, map, values } from "rambda";
import "reflect-metadata";
import { batch, createComputed, onMount } from "solid-js";
import { render } from "solid-js/web";

import { Command, GameState, Party, PartyOwner } from "@rpg-village/core";

import { gameInstanceWrapper } from "@web/engine";
import { gameStore, restoreStateFromLocalStorage, setGameStore } from "@web/store";
import {
  PartyAction,
  PartyState,
  clearPartyAction,
  partiesStatesSelector,
  setPartyAction,
  useGameAiStateSelector,
} from "@web/store/ai";
import { noActiveActivityPartiesSelector } from "@web/store/game";
import { useGameUiStateSelector } from "@web/store/ui";

import { PlayerPartyAI } from "./ai/player-party-ai";
import { GameField } from "./components/game-field";
import "./main.css";

const partyAI = new PlayerPartyAI();

const GameInstanceLogic = () => {
  const partyStates = useGameAiStateSelector(partiesStatesSelector);
  const gameUiState = useGameUiStateSelector(x => x);

  onMount(() => {
    restoreStateFromLocalStorage();

    if (gameStore.game) {
      gameInstanceWrapper().loadGame(gameStore.game);
    } else {
      gameInstanceWrapper().startNewGame();
    }

    setGameStore("game", gameInstanceWrapper().getState());

    gameInstanceWrapper().onStateUpdate(state => setGameStore("game", state));
    gameInstanceWrapper().resume();
  });

  const executeAI = (gameState: GameState, partyStates: Record<string, PartyState>) => {
    const parties = noActiveActivityPartiesSelector(gameState);
    const playerParties = filter(party => party.owner === PartyOwner.Player, parties);

    return map(
      party => [party, partyAI.execute(gameState, party, partyStates[party.id] || {})],
      values(playerParties),
    ) as [Party, [PartyAction | null, Command | null]][];
  };

  gameInstanceWrapper().setAICommandsGenerator(gameState => {
    const updates = executeAI(gameState, partyStates());

    batch(() => {
      forEach(([party, [newPartyAction]]) => {
        if (newPartyAction === null) {
          clearPartyAction(party.id);
        } else {
          setPartyAction(party.id, newPartyAction.type, newPartyAction.args);
        }
      }, updates);
    });

    return filter(
      x => x !== null,
      map(x => x[1][1] as any, updates),
    ) as Command[];
  });

  createComputed(() => {
    if (gameUiState().paused) {
      gameInstanceWrapper().pause();
    } else {
      gameInstanceWrapper().resume();
    }
  });

  createComputed(() => gameInstanceWrapper().enableAI(gameUiState().ai));

  return null;
};

const App = () => {
  return (
    <>
      <GameInstanceLogic />
      <GameField />
    </>
  );
};

render(() => <App />, document.getElementById("game")!);
