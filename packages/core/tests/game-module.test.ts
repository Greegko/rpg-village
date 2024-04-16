import test from "ava";

import { GameState } from "@rpg-village/core";

import { GameModules, gameFactory } from "./utils/game-factory";

test("loadGame should load the state", t => {
  const game = gameFactory({ config: { modules: GameModules } });

  game.loadGame({ general: { turn: 1 } } as GameState);

  const newState = game.gameTurn();

  t.is(newState.general.turn, 2);
});

test("gameState should return the current state of the game", t => {
  const game = gameFactory({ state: { general: { turn: 1 } }, config: { modules: GameModules } });

  const state = game.getState();

  t.is(state.general.turn, 1);
});
