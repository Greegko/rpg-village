import test from "ava";

import { gameFactory } from "./utils/game-factory";

import { GameState } from "../public-api";

test("loadGame should load the state", t => {
  const game = gameFactory();

  game.loadGame({ general: { turn: 1 } } as GameState);

  const newState = game.gameTurn();

  t.is(newState.general.turn, 2);
});

test("gameState should return the current state of the game", t => {
  const game = gameFactory({ state: { general: { turn: 1 } } });

  const state = game.getState();

  t.is(state.general.turn, 1);
});
