import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

import { GameUIState } from "../reducers";
import { GameStoreState } from "../store";

export const gameStoreUISelector = (game: GameStoreState) => game.ui;

export const gameUISelector = (ui: GameUIState) => ui;

export const mapSelector = createSelector(gameUISelector, ui => ui.map);

export const useGameUISelector = <R, T extends (gameState: GameUIState) => R>(selector: T) =>
  useSelector(createSelector(gameStoreUISelector, selector));
