import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

import { GameStoreState } from "../store";
import { GameUIState } from "./reducers";

export const gameStoreUISelector = (game: GameStoreState) => game.ui;

export const gameUISelector = (ui: GameUIState) => ui;

export const pageSelector = createSelector(gameUISelector, ui => ui.page);
export const mapSelector = createSelector(gameUISelector, ui => ui.map);

export const isAIEnabledSelector = createSelector(gameUISelector, ui => ui.ai);
export const pausedSelector = createSelector(gameUISelector, ui => ui.paused);

export const useGameUISelector = <R, T extends (gameState: GameUIState) => R>(selector: T) =>
  useSelector(createSelector(gameStoreUISelector, selector));
