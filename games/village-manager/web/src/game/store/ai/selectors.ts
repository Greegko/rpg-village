import { PartyID } from "@rpg-village/village-manager";

import { createSelectorFactory, selectorProperty } from "../create-selector";
import { GameStoreState } from "../game-store-state";
import { GameAIState } from "./state";

const createSelector = createSelectorFactory<GameAIState>();

export const gameAIStateSelector = (storeState: GameStoreState) => storeState.ai;

export const partiesStatesSelector = (aiState: GameAIState) => aiState.partyStates;

export const partyStateSelector = createSelector(
  partiesStatesSelector,
  selectorProperty<PartyID>,
  (partiesPreferences, partyId) => partiesPreferences[partyId],
);
