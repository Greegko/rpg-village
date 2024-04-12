import { createSelectorFactory } from "../create-selector";
import { GameUIState } from "./state";

const createSelector = createSelectorFactory<GameUIState>();

export const gameUISelf = (ui: GameUIState) => ui;

export const pageSelector = createSelector(gameUISelf, ui => ui.page);
export const mapSelector = createSelector(gameUISelf, ui => ui.map);

export const isAIEnabledSelector = createSelector(gameUISelf, ui => ui.ai);
export const pausedSelector = createSelector(gameUISelf, ui => ui.paused);
export const selectedVillageIdSelector = createSelector(gameUISelf, ui => ui.selectedVillageId);
