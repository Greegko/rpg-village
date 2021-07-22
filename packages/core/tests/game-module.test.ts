import { gameFactory } from "./game-factory";
import * as expect from "expect";
import { GameState } from "../public-api";

describe("Game Module", () => {
  describe("loadGame", () => {
    it("should load the state", () => {
      const game = gameFactory();

      game.loadGame({ general: { turn: 1 } } as GameState);

      const newState = game.gameTurn();

      expect(newState.general.turn).toBe(2);
    });
  });

  describe("getState", () => {
    it("should return the current state of the game", () => {
      const game = gameFactory({ state: { general: { turn: 1 } } });

      const state = game.getState();

      expect(state.general.turn).toBe(1);
    });
  });
});
