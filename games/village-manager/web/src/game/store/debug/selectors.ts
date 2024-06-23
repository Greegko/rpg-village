import { createSelectorFactory } from "../create-selector";
import { GameDebugState } from "./state";

const createSelector = createSelectorFactory<GameDebugState>();

export const gameDebugStateSelector = (ui: GameDebugState) => ui;

export const commandHistorySelector = createSelector(gameDebugStateSelector, ui => ui.commandHistory);
