import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

import { PartyID } from "@rpg-village/core";

import { GameStoreState } from "../game-store-state";
import { GameAIState } from "./interface";

export const gameAIStateSelector = (storeState: GameStoreState) => storeState.ai;
const selectorProperty =
  <P>() =>
  (...args: [GameAIState, P]): P =>
    args[1];

export const partiesStatesSelector = (aiState: GameAIState) => aiState.partyStates;

export const partyStateSelector = createSelector(
  partiesStatesSelector,
  selectorProperty<PartyID>(),
  (partiesPreferences, partyId) => partiesPreferences[partyId],
);

export const useGameAIStateSelector = <T extends (gameAiState: GameAIState) => any>(selector: T): ReturnType<T> =>
  useSelector(createSelector(gameAIStateSelector, selector));
