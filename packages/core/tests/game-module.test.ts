import { expect, it } from "vitest";

import { GameState } from "../src";
import { gameFactory } from "./utils/game-factory";

it("loadGame should load the state", () => {
  const game = gameFactory();

  game.loadGame({ general: { turn: 1 } } as GameState);

  const newState = game.gameTurn();

  expect(newState.general.turn).toBe(2);
});

it("gameState should return the current state of the game", () => {
  const game = gameFactory({ state: { general: { turn: 1 } } });

  const state = game.getState();

  expect(state.general.turn).toBe(1);
});
