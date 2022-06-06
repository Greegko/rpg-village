import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

import { GameStoreState } from "../store";
import { GameUIState } from "./reducers";

export const gameStoreUISelector = (game: GameStoreState) => game.ui;

export const gameUISelf = (ui: GameUIState) => ui;

export const pageSelector = createSelector(gameUISelf, ui => ui.page);
export const mapSelector = createSelector(gameUISelf, ui => ui.map);

export const isAIEnabledSelector = createSelector(gameUISelf, ui => ui.ai);
export const pausedSelector = createSelector(gameUISelf, ui => ui.paused);

export const useGameUISelector = <R, T extends (gameState: GameUIState) => R>(selector: T) =>
  useSelector(createSelector(gameStoreUISelector, selector));
