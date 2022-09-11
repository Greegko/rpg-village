import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

import { GameStoreState } from "../game-store-state";
import { GameUIState } from "./interface";

export const gameStoreUISelector = (game: GameStoreState) => game.ui;

export const gameUISelf = (ui: GameUIState) => ui;

export const pageSelector = createSelector(gameUISelf, ui => ui.page);
export const mapSelector = createSelector(gameUISelf, ui => ui.map);

export const isAIEnabledSelector = createSelector(gameUISelf, ui => ui.ai);
export const pausedSelector = createSelector(gameUISelf, ui => ui.paused);

export const useGameUISelector = <T extends (gameState: GameUIState) => any>(selector: T): ReturnType<T> =>
  useSelector(createSelector(gameStoreUISelector, selector));
